import { useEffect, useRef, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import CourseLesson from "./CourseLesson";
import { useNavigate, useParams } from "react-router-dom";
import Resumable from "resumablejs";
import { useForm, Controller } from "react-hook-form";
import { errorMessage } from "../../lib/error/errorMsg";
import { useLessonUploadMutation } from "../../api/lesson-api/lessonApi";
import { uploadAlert } from "../../lib/alert/uploadAlert";
import { toast } from "sonner";
import { Spinner } from "../../components/ui/spinner";
import { IoMdArrowRoundBack } from "react-icons/io";
import ReactPlayer from "react-player";
import {
    MediaController,
    MediaControlBar,
    MediaTimeRange,
    MediaTimeDisplay,
    MediaVolumeRange,
    MediaPlaybackRateButton,
    MediaPlayButton,
    MediaSeekBackwardButton,
    MediaSeekForwardButton,
    MediaMuteButton,
    MediaFullscreenButton,
} from "media-chrome/react";


type FormValues = {
    title: string;
    description: string;
    video_url?: string;
};

export const AddLeason = () => {
    const { id } = useParams<{ id: string }>();

    const [preview, setPrivew] = useState<string | undefined>(undefined);

    const token = localStorage.getItem("token");

    const [videoOption, setVideoOption] = useState<"upload" | "url">("upload");
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [videoPath, setVideoPath] = useState<string>("");
    const [isUpload, setIsUpload] = useState<boolean>(false);

    const [uploadSize, setUploadSize] = useState<number>();




    const resumableRef = useRef<Resumable | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // -------------------- React Hook Form --------------------
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            title: "",
            description: "",
            video_url: "",
        },
    });


    // -------------------- ResumableJS Setup --------------------
    useEffect(() => {
        if (!id || !token) return;

        const r = new Resumable({
            target: `${import.meta.env.VITE_BASE_URL}/api/v1/admin/courses/upload-video`,
            chunkSize: 2 * 1024 * 1024,
            simultaneousUploads: 3,
            testChunks: false,
            // throttleProgressCallbacks: 1,
            headers: { Authorization: `Bearer ${token}` },
            query: { course_id: id },
            fileType: ["mp4", "mkv", "mov", "avi"],
            fileParameterName: "video_file",
        });

        if (!r.support) {
            alert("ResumableJS not supported");
            return;
        }

        resumableRef.current = r;

        r.on("fileAdded", () => {
            setUploading(true);
            setProgress(0);
            r.upload();
        });

        r.on("fileProgress", (file) => setProgress(Math.floor(file.progress(true) * 100)));

        r.on("fileSuccess", (_file: string, message: string) => {
            try {
                const res = JSON.parse(message);
                setPrivew(res?.url)
                if (res.ok && res.path) {
                    setIsUpload(true);
                    setVideoPath(res.path);
                }
            } catch (err) {
                return errorMessage(err)
            }
            setUploading(false);
            setProgress(100);
        });

        r.on("fileError", (_file, message) => {
            toast.success(message)
            setUploading(false);
        });

        return () => r.cancel();
    }, [id, token]);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0];
        if (!file) return;

        // Upload file
        resumableRef.current?.addFile(file);

        // Calculate duration
        const url = URL.createObjectURL(file);
        const audio = new Audio(url);


        audio.addEventListener("loadedmetadata", () => {
            const durationInSeconds = audio.duration;
            setUploadSize(durationInSeconds)

            // const second = durationInSeconds

            URL.revokeObjectURL(url);
        });
    };





    const [lessonUpload, { isLoading }] = useLessonUploadMutation();



    // ======================= calculate video url duraction =================================

    const [loadingDuration, setLoadingDuration] = useState(false);
    const [durationError, setDurationError] = useState<string>('');
    const [videoDuration, setVideoDuration] = useState(''); // formatted (4:13)
    const [videoMinutes, setVideoMinutes] = useState(0);   // total minutes (5)
    const [timeLoading, setTimeLoading] = useState<boolean>(false);

    const extractVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const parseDuration = (isoDuration: string) => {
        const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
        const matches = isoDuration.match(regex);
        if (!matches) return "Unknown";

        const hours = parseInt(matches[1] || "0");
        const minutes = parseInt(matches[2] || "0");
        const seconds = parseInt(matches[3] || "0");

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    };

    const durationToMinutes = (isoDuration: string) => {
        const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
        const matches = isoDuration.match(regex);

        if (!matches) return 0;

        const hours = parseInt(matches[1] || "0");
        const minutes = parseInt(matches[2] || "0");
        const seconds = parseInt(matches[3] || "0");

        return hours * 60 + minutes + Math.ceil(seconds / 60);
    };



    const calculateYouTubeDuration = async (url: string) => {
        setPrivew(url)
        setLoadingDuration(true);
        setDurationError('');
        setVideoDuration('');
        setVideoMinutes(0);

        const videoId = extractVideoId(url);
        if (!videoId) {
            setDurationError('Invalid YouTube URL');
            setLoadingDuration(false);
            return;
        }

        try {
            const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
            const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`;
            const res = await fetch(apiUrl);
            const data = await res.json();

            if (!data.items?.length) {
                setDurationError('Video not found or private');
                return;
            }

            const isoDuration = data.items[0].contentDetails.duration;
            setTimeLoading(true)

            // UI format
            const formatted = parseDuration(isoDuration);


            const totalMinutes = durationToMinutes(isoDuration);


            setVideoDuration(formatted);
            setVideoMinutes(totalMinutes);
            setTimeLoading(false)

        } catch (err) {
            if (err instanceof Error) {
                setDurationError(err.message);
            } else {
                setDurationError("Something went wrong");
            }
        };
    }









    // -------------------- Submit Handler --------------------
    const onSubmit = async (data: FormValues) => {

        const formData = new FormData();
        if (videoOption == "upload") {
            formData.append("video_type", "upload");
            formData.append("video_path", videoPath);
            if (uploadSize) {
                formData.append("duration", String(Math.ceil(uploadSize)));
            }
        } else {
            if (data?.video_url) {
                formData.append("video_url", data.video_url);
                formData.append("video_type", "url");
                formData.append("duration", String(videoMinutes * 60));
            }
        }
        formData.append("title", data.title);
        formData.append("description", data.description);


        // ✅ Send data + videoPath to backend here

        try {

            const res = await uploadAlert();
            if (res) {
                const res = await lessonUpload({ formData, id }).unwrap()
                if (res) {
                    toast.success(res?.message);
                    reset();
                    setIsUpload(false)
                    setPrivew(undefined)
                }
            }

        } catch (error) {
            return errorMessage(error)

        }
    };


    const navigate = useNavigate();





    return (
        <div>
            <div className=" flex items-center gap-x-2 " >
                <div onClick={() => { navigate("/dashboard/courses-management") }} className=" w-10 h-10 border-2 border-black flex justify-center  items-center rounded-full cursor-pointer  " >
                    <span> <IoMdArrowRoundBack size={25} /> </span>
                </div>
                <div>
                    <h1 className=" text-lg font-semibold " >
                        Back
                    </h1>
                </div>
            </div>
            <div className="  pb-20  " >
                <div className="max-w-7xl p-9 rounded-[14px] mx-auto bg-white shadow shadow-[#00000033]">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Add Lessons to Acrylic Nail Art Masterclass
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Lesson Title */}
                        <div className="mb-4">
                            <label className="block text-lg font-medium text-gray-700 mb-2">
                                Lesson Title
                            </label>
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: "Lesson title is required" }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Enter Lesson Title"
                                        className={errors.title ? "border-red-500" : ""}
                                    />
                                )}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Lesson Description */}
                        <div className="mb-4">
                            <label className="block text-lg font-medium text-gray-700 mb-2">
                                Lesson Description
                            </label>
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: "Lesson description is required" }}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        placeholder="Enter Lesson Description"
                                        className={errors.description ? "border-red-500" : ""}
                                    />
                                )}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Lesson Video */}
                        <div className="mb-6">
                            <label className="block text-lg font-medium text-gray-700 mb-2">
                                Lesson Video
                            </label>

                            {/* Option Boxes */}
                            <div className="flex gap-6 mb-4">
                                <div
                                    onClick={() => setVideoOption("upload")}
                                    className={`flex flex-col items-center justify-center h-[100px] w-full rounded-md border cursor-pointer ${videoOption === "upload"
                                        ? "bg-yellow-100 border-2 border-yellow-400"
                                        : "bg-gray-50"
                                        }`}
                                >
                                    <span className="text-sm mt-2">Upload Video</span>
                                </div>

                                <div
                                    onClick={() => setVideoOption("url")}
                                    className={`flex flex-col items-center justify-center h-[100px] w-full rounded-md border cursor-pointer ${videoOption === "url"
                                        ? "bg-yellow-100 border-2 border-yellow-400"
                                        : "bg-gray-50"
                                        }`}
                                >
                                    <span className="text-sm mt-2">Video Link</span>
                                </div>
                            </div>

                            {/* Upload File */}
                            {videoOption === "upload" && (
                                <label className="w-full h-40 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer">
                                    <p>Click to upload video</p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"

                                        accept="video/mp4,video/mov,video/avi"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            )}

                            {videoOption === "upload" && (
                                <>
                                    {/* Progress */}
                                    {uploading && (
                                        <div className="mt-4">
                                            <div className="w-full bg-gray-200 rounded">
                                                <div
                                                    className="h-2 bg-green-500 rounded"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <p className="text-sm mt-2">{progress}%</p>
                                        </div>
                                    )}

                                    {/* Video upload successfully message */}
                                    {isUpload && (
                                        <p className="font-semibold text-xl mt-3 text-green-600">
                                            Video uploaded successfully
                                        </p>
                                    )}
                                </>
                            )}

                            {/* Video Link */}
                            {videoOption === "url" && (
                                <Controller
                                    name="video_url"
                                    control={control}
                                    rules={{
                                        required: videoOption === "url" ? "Video link is required" : false,
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter video link"
                                            className={errors.video_url ? "border-red-500" : ""}
                                            onBlur={(e) => {
                                                field.onBlur();
                                                calculateYouTubeDuration(e.target.value); // calculate on blur
                                            }}
                                        />
                                    )}
                                />
                            )}
                            {errors.video_url && (
                                <p className="text-red-500 text-sm mt-1">{errors.video_url.message}</p>
                            )}

                            {loadingDuration && <p className="text-sm">Calculating duration...</p>}

                            {videoDuration && (
                                <p className="text-green-600 text-sm">
                                    Duration: {videoDuration} ({videoMinutes} minutes)
                                </p>
                            )}

                            {durationError && (
                                <p className="text-red-500 text-sm">{durationError}</p>
                            )}
                        </div>

                        {
                            preview && (
                                <MediaController
                                    style={{
                                        width: "50%",
                                        aspectRatio: "16/9",
                                    }}
                                >
                                    <ReactPlayer
                                        slot="media"
                                        src={preview}
                                        controls={false}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            // "--controls": "none",
                                        }}
                                    ></ReactPlayer>
                                    <MediaControlBar>
                                        <MediaPlayButton />
                                        <MediaSeekBackwardButton seekOffset={10} />
                                        <MediaSeekForwardButton seekOffset={10} />
                                        <MediaTimeRange />
                                        <MediaTimeDisplay showDuration />
                                        <MediaMuteButton />
                                        <MediaVolumeRange />
                                        <MediaPlaybackRateButton />
                                        <MediaFullscreenButton />
                                    </MediaControlBar>
                                </MediaController>
                            )
                        }

                        {/* Submit */}
                        <div className="mt-12 flex justify-end">

                            <Button
                                type="submit"
                                disabled={timeLoading}
                                className="bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] w-full "
                            >
                                {isLoading ? <div className=" " >
                                    <Spinner />
                                </div> : "Add Lesson"}
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="max-w-7xl mx-auto mt-8">
                    <CourseLesson id={id} />
                </div>
            </div>
        </div>
    );
};



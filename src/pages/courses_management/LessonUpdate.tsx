import { useEffect, useRef, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { useParams } from "react-router-dom";
import Resumable from "resumablejs";
import { errorMessage } from "../../lib/error/errorMsg";
import {
    useLazySingleLessonQuery,
    useLessonUpdateMutation,
} from "../../api/lesson-api/lessonApi";
import { uploadAlert } from "../../lib/alert/uploadAlert";
import { toast } from "sonner";
import { Spinner } from "../../components/ui/spinner";
import { Controller, useForm } from "react-hook-form";

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



function LessonUpdate({
    lessonId,
    courseId,
    setUpdateModal

}: {
    lessonId?: string;
    courseId?: string;
    setUpdateModal: (value: boolean) => void
}) {
    const { id } = useParams<{ id: string }>();
    const token = localStorage.getItem("token");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoOption, setVideoOption] = useState<"upload" | "url">("upload");

    const [preview, setPreview] = useState<string | undefined>(undefined)



    const [loadingDuration, setLoadingDuration] = useState(false);
    const [durationError, setDurationError] = useState<string>('');
    const [videoDuration, setVideoDuration] = useState(''); // formatted (4:13)
    const [videoMinutes, setVideoMinutes] = useState(0);   // total minutes (5)
    const [timeLoading, setTimeLoading] = useState<boolean>(false);
    const [uploadSize, setUploadSize] = useState<number>();



    const [getSingleLesson, { data: singleLesson }] =
        useLazySingleLessonQuery();

    useEffect(() => {
        if (courseId && lessonId) {
            getSingleLesson({ courseId, lessonId });
        }
    }, [courseId, lessonId, getSingleLesson]);



    useEffect(() => {
        if (singleLesson?.data) {
            const data = singleLesson.data;
            console.log(data?.updateUrl)
            // console.log(data)
            setTitle(data.title ?? "");
            setDescription(data.description ?? "");
            setVideoOption(data.video_type ?? "upload");

            if (data.video_type === "url") {
                const video = data.video_url ?? "";
                setPreview(`${import.meta.env.VITE_BASE_URL}${video}`);
            }

            if (data.video_type === "upload") {
                const video = data.video_url ?? "";

                setPreview(`${import.meta.env.VITE_BASE_URL}${video}`); // ✅ use direct value here
            }
        }
    }, [singleLesson?.data]);





    // -------------------- VIDEO STATE --------------------
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [videoPath, setVideoPath] = useState<string | File>("");
    const [isUpload, setIsUpload] = useState(false);

    const resumableRef = useRef<Resumable | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // -------------------- RESUMABLE SETUP --------------------
    useEffect(() => {
        if (!id || !token) return;

        const r = new Resumable({
            target: `${import.meta.env.VITE_BASE_URL}/api/v1/admin/courses/upload-video`,
            chunkSize: 2 * 1024 * 1024,
            simultaneousUploads: 3,
            testChunks: false,
            headers: { Authorization: `Bearer ${token}` },
            query: { course_id: id },
            fileType: ["mp4", "mkv", "mov", "avi"],
            fileParameterName: "video_file",
        });

        resumableRef.current = r;

        r.on("fileAdded", () => {
            setUploading(true);
            setProgress(0);
            r.upload();
        });

        r.on("fileProgress", (file: unknown) => {
            const f = file as { progress: () => number };
            setProgress(Math.floor(f.progress() * 100));
        });

        r.on("fileSuccess", (_file: Resumable, message: string) => {
            try {
                const res = JSON.parse(message);
                console.log("upload url", res)
                setPreview(res?.url)
                if (res.ok && res.path) {
                    setIsUpload(true);
                    setVideoPath(res.path);
                    // setVideoSize(res.size / 1024 / 1024);
                }
            } catch (err) {
                return errorMessage(err);
            }
            setUploading(false);
            setProgress(100);
        });

        r.on("fileError", (_file, message) => {
            console.error("Upload error:", message);
            setUploading(false);
        });

        return () => r.cancel();
    }, [id, token]);



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
        console.log("calculate preview url is", url)
        setPreview(url)
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


    // -------------------- API --------------------
    const [lessonUpdate, { isLoading }] = useLessonUpdateMutation();




    // -------------------- SUBMIT --------------------


    type FormValues = {
        title: string;
        description: string;
        video_url?: string;
    };

    // -------------------- React Hook Form --------------------
    const {
        control,
        reset,
        handleSubmit
    } = useForm<FormValues>({
        defaultValues: {
            title: "",
            description: "",
            video_url: "",
        },
    });




    const onSubmit = async (data: FormValues) => {
        const formData = new FormData();
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        formData.append("title", data?.title || title);
        formData.append("description", data?.description || description);


        if (videoOption == "upload") {
            formData.append("video_type", "upload");
            formData.append("video_path", videoPath);
            if (uploadSize) {
                formData.append("duration", String(Math.ceil(uploadSize)));
            }
        }




        if (videoOption == "url") {
            if (data?.video_url) {
                formData.append("video_url", data.video_url);
                formData.append("video_type", "url");
                formData.append("duration", String(videoMinutes * 60));
            }
        }

        if (singleLesson?.data?.video_path) {
            if (singleLesson?.data?.video_type == "upload") {
                formData.append("video_path", singleLesson?.data?.video_path);
                formData.append("video_type", "upload");
                formData.append("duration", singleLesson?.data?.duration);
            }
            else {
                formData.append("video_path", singleLesson?.data?.video_path);
                formData.append("video_type", "url");
                formData.append("duration", singleLesson?.data?.duration);
            }
        }






        try {
            const alert = await uploadAlert();
            if (!alert) return;

            const res = await lessonUpdate({ formData, courseId, lessonId }).unwrap();
            if (res) {
                console.log("update course is", res)
                toast.success(res?.message);
                reset();
                setUpdateModal(false);
            }

        } catch (error) {
            console.log(error)
            return errorMessage(error);
        }
    };







    // -------------------- UI --------------------
    return (
        <div className="pb-10">
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
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter Lesson Title"
                        />

                    </div>

                    {/* Lesson Description */}
                    <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Lesson Description
                        </label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter Lesson Description"
                        />

                    </div>

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

                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Enter video link"
                                        onBlur={(e) => {
                                            field.onBlur();
                                            calculateYouTubeDuration(e.target.value); // calculate on blur
                                        }}
                                    />
                                )}
                            />
                        )}

                        <div>
                            {
                                timeLoading && (
                                    <div>
                                        <Spinner />
                                    </div>
                                )
                            }
                        </div>


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

                    <div className=" mt-10 " >
                        <MediaController
                            style={{
                                width: "100%",
                                aspectRatio: "16/9",
                            }}
                        >
                            <ReactPlayer
                                slot="media"
                                src={`${preview}`}
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
                    </div>



                    {/* Submit */}
                    <div className="mt-12 flex justify-end">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] w-full"
                        >
                            {isLoading ? <Spinner /> : "Update Lesson"}
                        </Button>
                    </div>
                </form>
            </div>


        </div>
    );
}

export default LessonUpdate;

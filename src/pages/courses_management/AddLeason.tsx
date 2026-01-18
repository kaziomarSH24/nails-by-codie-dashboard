import { useEffect, useRef, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import CourseLesson from "./CourseLesson";
import { useParams } from "react-router-dom";
import Resumable from "resumablejs";
import { useForm, Controller } from "react-hook-form";
import { errorMessage } from "../../lib/error/errorMsg";

type FormValues = {
    title: string;
    description: string;
    video_url?: string;
};

function AddLessonForm() {
    const { id } = useParams<{ id: string }>();

    const token = localStorage.getItem("token");

    const [videoOption, setVideoOption] = useState<"upload" | "url">("upload");
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [videoPath, setVideoPath] = useState<string>("");
    const [videoSize, setVideoSize] = useState<number | undefined>(undefined);
    const [isUpload, setIsUpload] = useState<boolean>(false);

    const resumableRef = useRef<Resumable | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // -------------------- React Hook Form --------------------
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            title: "",
            description: "",
            video_url: "",
        },
    });

    const watchedVideoLink = watch("video_url");

    // -------------------- ResumableJS Setup --------------------
    useEffect(() => {
        if (!id || !token) return;

        const r = new Resumable({
            target: "http://10.10.10.55:90/api/v1/admin/courses/upload-video",
            chunkSize: 2 * 1024 * 1024,
            simultaneousUploads: 3,
            testChunks: false,
            throttleProgressCallbacks: 1,
            headers: { Authorization: `Bearer ${token}` },
            query: { course_id: id },
            fileType: ["mp4", "mkv", "mov", "avi"],
            fileParameterName: "video_file", // must match Laravel
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

        r.on("fileProgress", (file) => setProgress(Math.floor(file.progress() * 100)));

        r.on("fileSuccess", (_file, message) => {
            try {
                const res = JSON.parse(message);
                console.log(res)
                if (res.ok && res.path) {
                    setIsUpload(true);
                    setVideoPath(res.path);
                    setVideoSize(res?.size / 1024 / 1024)
                }
            } catch (err) {
                return errorMessage(err)
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        resumableRef.current?.addFile(file);
    };

    // ----------------------- Calculate Video Size ---------------------------
    const sizeInMB = videoSize;

    let minutes: number, seconds: number;

    if (sizeInMB !== undefined) {
        const sizeInBytes = sizeInMB * 1024 * 1024; // bytes
        const sizeInBits = sizeInBytes * 8; // bits
        console.log(sizeInBits); // 573,308,416 bits

        const bitrateMbps = 5; // 5 Mbps
        const bitrateBps = bitrateMbps * 1024 * 1024; // bits per second

        const durationSeconds = sizeInBits / bitrateBps;
        minutes = Math.floor(durationSeconds / 60);
        seconds = Math.floor(durationSeconds % 60);

        console.log(`${minutes} min ${seconds} sec`);
    }





    // -------------------- Submit Handler --------------------
    const onSubmit = (data: FormValues) => {
        const formData = new FormData();
        if (videoOption == "upload") {
            formData.append("video_path", videoPath);
        } else {
            if (data?.video_url) {
                formData.append("video_url", data.video_url);
            }
        }
        formData.append("duration", `${minutes}:${seconds}`)
        console.log("Form data:", data);
        console.log("Uploaded video path:", videoPath);
        // ✅ Send data + videoPath to backend here
    };

    console.log("video size is", videoSize?.toFixed(1), videoPath)

    return (
        <>
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
                                    />
                                )}
                            />
                        )}
                        {errors.video_url && (
                            <p className="text-red-500 text-sm mt-1">{errors.video_url.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="mt-12 flex justify-end">
                        <Button type="submit">Add Lesson</Button>
                    </div>
                </form>
            </div>

            <div className="max-w-7xl mx-auto mt-8">
                <CourseLesson />
            </div>
        </>
    );
}

export default AddLessonForm;

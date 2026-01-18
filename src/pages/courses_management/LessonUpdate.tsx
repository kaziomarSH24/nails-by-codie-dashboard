import { useEffect, useRef, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import CourseLesson from "./CourseLesson";
import { useParams } from "react-router-dom";
import Resumable from "resumablejs";
import { errorMessage } from "../../lib/error/errorMsg";
import {
    useGetLessonByCourseIdQuery,
    useLessonUploadMutation,
} from "../../api/lesson-api/lessonApi";
import { uploadAlert } from "../../lib/alert/uploadAlert";
import { toast } from "sonner";
import { Spinner } from "../../components/ui/spinner";
import type { CourseLessonType, Lesson } from "../../lib/type/lessonType";

function LessonUpdate({
    lessonId,
    courseId,
}: {
    lessonId?: string;
    courseId?: string;
}) {
    const { id } = useParams<{ id: string }>();
    const token = localStorage.getItem("token");

    // -------------------- FORM STATE --------------------
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");

    const [errors, setErrors] = useState<{
        title?: string;
        description?: string;
        video_url?: string;
    }>({});

    // -------------------- VIDEO STATE --------------------
    const [videoOption, setVideoOption] = useState<"upload" | "url">("upload");
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [videoPath, setVideoPath] = useState("");
    const [videoSize, setVideoSize] = useState<number>();
    const [isUpload, setIsUpload] = useState(false);

    const resumableRef = useRef<Resumable | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // -------------------- RESUMABLE SETUP --------------------
    useEffect(() => {
        if (!id || !token) return;

        const r = new Resumable({
            target: "http://10.10.10.55:90/api/v1/admin/courses/upload-video",
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

        r.on("fileProgress", (file) =>
            setProgress(Math.floor(file.progress() * 100))
        );

        r.on("fileSuccess", (_file, message) => {
            try {
                const res = JSON.parse(message);
                if (res.ok && res.path) {
                    setIsUpload(true);
                    setVideoPath(res.path);
                    setVideoSize(res.size / 1024 / 1024);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) resumableRef.current?.addFile(file);
    };

    // -------------------- VIDEO DURATION --------------------
    let minutes = 0;
    if (videoSize) {
        const bits = videoSize * 1024 * 1024 * 8;
        const bitrate = 5 * 1024 * 1024;
        minutes = Math.floor(bits / bitrate / 60);
    }

    // -------------------- API --------------------
    const [lessonUpload, { isLoading }] = useLessonUploadMutation();
    const { data } = useGetLessonByCourseIdQuery(courseId);

    const courseData: CourseLessonType = data?.data;
    const lessonData: Lesson[] = data?.data?.lessons || [];

    // -------------------- VALIDATION --------------------
    const validateForm = () => {
        const newErrors: any = {};
        if (!title.trim()) newErrors.title = "Lesson title is required";
        if (!description.trim())
            newErrors.description = "Lesson description is required";
        if (videoOption === "url" && !videoUrl.trim())
            newErrors.video_url = "Video link is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // -------------------- SUBMIT --------------------
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("duration_minutes", `${minutes + 1}`);

        if (videoOption === "upload") {
            formData.append("video_type", "upload");
            formData.append("video_path", videoPath);
        } else {
            formData.append("video_type", "url");
            formData.append("video_url", videoUrl);
        }

        try {
            const confirm = await uploadAlert();
            if (!confirm) return;

            const res = await lessonUpload({ formData, id }).unwrap();
            toast.success(res?.message);

            // reset
            setTitle("");
            setDescription("");
            setVideoUrl("");
            setErrors({});
            setIsUpload(false);
        } catch (error) {
            errorMessage(error);
        }
    };

    // -------------------- UI --------------------
    return (
        <div className="pb-10">
            <div className="max-w-7xl p-9 rounded-[14px] mx-auto bg-white shadow shadow-[#00000033]">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Add Lessons to Acrylic Nail Art Masterclass
                </h2>

                <form onSubmit={onSubmit}>
                    {/* Lesson Title */}
                    <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Lesson Title
                        </label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter Lesson Title"
                            className={errors.title ? "border-red-500" : ""}
                        />
                        {/* {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                        )} */}
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
                            className={errors.description ? "border-red-500" : ""}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
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
                                {isUpload && (
                                    <p className="font-semibold text-xl mt-3 text-green-600">
                                        Video uploaded successfully
                                    </p>
                                )}
                            </>
                        )}

                        {videoOption === "url" && (
                            <>
                                <Input
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder="Enter video link"
                                    className={errors.video_url ? "border-red-500" : ""}
                                />
                                {errors.video_url && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.video_url}
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="mt-12 flex justify-end">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] w-full"
                        >
                            {isLoading ? <Spinner /> : "Add Lesson"}
                        </Button>
                    </div>
                </form>
            </div>

            <div className="max-w-7xl mx-auto mt-8">
                <CourseLesson id={id} />
            </div>
        </div>
    );
}

export default LessonUpdate;

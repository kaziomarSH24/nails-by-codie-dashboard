import { useEffect, useRef, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import CourseLesson from "./CourseLesson";
import { useNavigate, useParams } from "react-router-dom";
import Resumable from "resumablejs";
import { useForm, Controller } from "react-hook-form";
import { errorMessage } from "../../lib/error/errorMsg";
import {
    useLessonUploadMutation,
    useGetLessonByCourseIdQuery,
} from "../../api/lesson-api/lessonApi";
import { uploadAlert } from "../../lib/alert/uploadAlert";
import { toast } from "sonner";
import { Spinner } from "../../components/ui/spinner";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Video, Image as ImageIcon, Layers, Eye, Upload, Link2, X } from "lucide-react";
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
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Course data to get title & existing section names
    const { data: courseResp } = useGetLessonByCourseIdQuery(id);
    const courseTitle = courseResp?.data?.title || "Course";
    const existingLessons = courseResp?.data?.lessons || [];
    const existingSections: string[] = Array.from(
        new Set(
            existingLessons
                .map((l: any) => l.section_name?.trim())
                .filter((s: string | undefined): s is string => Boolean(s && s.length > 0))
        )
    );

    // Section state
    const [sectionName, setSectionName] = useState<string>("Introduction");
    const [isFreePreview, setIsFreePreview] = useState<boolean>(false);

    // Video states
    const [videoOption, setVideoOption] = useState<"upload" | "url">("upload");
    const [preview, setPreview] = useState<string | undefined>(undefined);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [videoPath, setVideoPath] = useState<string>("");
    const [isUpload, setIsUpload] = useState<boolean>(false);
    const [uploadSize, setUploadSize] = useState<number>();

    // Image states (supports multiple images/pages held locally until form submission)
    interface ImageItem {
        id: string;
        file: File;
        previewUrl: string;
    }
    const [imageItems, setImageItems] = useState<ImageItem[]>([]);

    const resumableRef = useRef<Resumable | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);

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
                setPreview(res?.url);
                if (res.ok && res.path) {
                    setIsUpload(true);
                    setVideoPath(res.path);
                }
            } catch (err) {
                return errorMessage(err);
            }
            setUploading(false);
            setProgress(100);
        });

        r.on("fileError", (_file, message) => {
            toast.error(message || "Video upload failed");
            setUploading(false);
        });

        return () => r.cancel();
    }, [id, token]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Upload file
        resumableRef.current?.addFile(file);

        // Calculate duration using video element (handles .mov, .mp4 reliably)
        const url = URL.createObjectURL(file);
        const videoEl = document.createElement("video");
        videoEl.preload = "metadata";
        videoEl.src = url;

        videoEl.onloadedmetadata = () => {
            if (videoEl.duration && isFinite(videoEl.duration)) {
                setUploadSize(videoEl.duration);
                const totalSec = Math.round(videoEl.duration);
                setDurationMinutes(Math.floor(totalSec / 60));
                setDurationSeconds(totalSec % 60);
            }
            URL.revokeObjectURL(url);
        };
        videoEl.onerror = () => {
            // Fallback audio check
            const audio = new Audio(url);
            audio.addEventListener("loadedmetadata", () => {
                if (audio.duration && isFinite(audio.duration)) {
                    setUploadSize(audio.duration);
                    const totalSec = Math.round(audio.duration);
                    setDurationMinutes(Math.floor(totalSec / 60));
                    setDurationSeconds(totalSec % 60);
                }
                URL.revokeObjectURL(url);
            });
        };
    };

    // -------------------- Image Handler (Multiple Local Previews) --------------------
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newItems: ImageItem[] = files.map((file) => ({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        setImageItems((prev) => [...prev, ...newItems]);
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    const handleRemoveImageItem = (idToRemove: string) => {
        setImageItems((prev) => {
            const item = prev.find((x) => x.id === idToRemove);
            if (item) URL.revokeObjectURL(item.previewUrl);
            return prev.filter((x) => x.id !== idToRemove);
        });
    };

    const handleClearAllImages = () => {
        imageItems.forEach((x) => URL.revokeObjectURL(x.previewUrl));
        setImageItems([]);
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    // -------------------- Drag & Drop Reordering --------------------
    const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

    const handleImageDragStart = (index: number) => {
        setDraggedImageIndex(index);
    };

    const handleImageDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleImageDrop = (dropIndex: number) => {
        if (draggedImageIndex === null || draggedImageIndex === dropIndex) return;
        setImageItems((prev) => {
            const updated = [...prev];
            const [movedItem] = updated.splice(draggedImageIndex, 1);
            updated.splice(dropIndex, 0, movedItem);
            return updated;
        });
        setDraggedImageIndex(null);
    };

    const handleMoveImage = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= imageItems.length) return;
        setImageItems((prev) => {
            const updated = [...prev];
            const [movedItem] = updated.splice(fromIndex, 1);
            updated.splice(toIndex, 0, movedItem);
            return updated;
        });
    };

    const [lessonUpload, { isLoading }] = useLessonUploadMutation();

    // -------------------- YouTube Duration Calculation --------------------
    const [loadingDuration, setLoadingDuration] = useState(false);
    const [durationError, setDurationError] = useState<string>("");
    const [videoDuration, setVideoDuration] = useState("");
    const [videoMinutes, setVideoMinutes] = useState(0);
    const [durationMinutes, setDurationMinutes] = useState<number>(0);
    const [durationSeconds, setDurationSeconds] = useState<number>(0);
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
            return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
        setPreview(url);
        setLoadingDuration(true);
        setDurationError("");
        setVideoDuration("");
        setVideoMinutes(0);

        const videoId = extractVideoId(url);
        if (!videoId) {
            setDurationError("Invalid YouTube URL");
            setLoadingDuration(false);
            return;
        }

        try {
            const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
            const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`;
            const res = await fetch(apiUrl);
            const data = await res.json();

            if (!data.items?.length) {
                setDurationError("Video not found or private");
                return;
            }

            const isoDuration = data.items[0].contentDetails.duration;
            setTimeLoading(true);

            const formatted = parseDuration(isoDuration);
            const totalMinutes = durationToMinutes(isoDuration);

            setVideoDuration(formatted);
            setVideoMinutes(totalMinutes);

            const matchDur = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            if (matchDur) {
                const hours = parseInt(matchDur[1] || "0");
                const mins = parseInt(matchDur[2] || "0");
                const secs = parseInt(matchDur[3] || "0");
                setDurationMinutes(hours * 60 + mins);
                setDurationSeconds(secs);
            }
            setTimeLoading(false);
        } catch (err) {
            if (err instanceof Error) {
                setDurationError(err.message);
            } else {
                setDurationError("Something went wrong");
            }
        } finally {
            setLoadingDuration(false);
        }
    };

    // -------------------- Submit Handler --------------------
    const onSubmit = async (data: FormValues) => {
        const hasVideo = (videoOption === "upload" && Boolean(videoPath)) || (videoOption === "url" && Boolean(data?.video_url && data.video_url.trim().length > 0));
        const hasImage = imageItems.length > 0;
        const hasText = Boolean(data.description && data.description.trim().length > 0);

        if (!hasVideo && !hasImage && !hasText) {
            toast.error("Please provide at least a video, image(s), or lesson text content.");
            return;
        }

        const calculatedLessonType = hasVideo ? "video" : (hasImage ? "image" : "article");

        const formData = new FormData();
        formData.append("title", data.title.trim());
        formData.append("description", data.description || "");
        formData.append("section_name", sectionName.trim() || "General");
        formData.append("lesson_type", calculatedLessonType);
        formData.append("is_free_preview", isFreePreview ? "1" : "0");

        const totalDuration = (durationMinutes * 60) + durationSeconds;
        if (hasVideo) {
            if (videoOption === "upload") {
                formData.append("video_type", "upload");
                formData.append("video_path", videoPath);
            } else {
                if (data?.video_url) {
                    formData.append("video_url", data.video_url.trim());
                    formData.append("video_type", "url");
                }
            }
            formData.append(
                "duration",
                String(totalDuration > 0 ? totalDuration : (uploadSize ? Math.ceil(uploadSize) : 0))
            );
        } else {
            formData.append("duration", "0");
        }

        // Attach image(s) if uploaded (supported alongside video)
        imageItems.forEach((item) => {
            formData.append("images[]", item.file);
        });

        try {
            const confirmed = await uploadAlert();
            if (confirmed) {
                const res = await lessonUpload({ formData, id }).unwrap();
                if (res) {
                    toast.success(res?.message || "Lesson added successfully");
                    reset();
                    setIsUpload(false);
                    setVideoPath("");
                    setPreview(undefined);
                    handleClearAllImages();
                    setUploadSize(undefined);
                    setProgress(0);
                    setDurationMinutes(0);
                    setDurationSeconds(0);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    if (imageInputRef.current) imageInputRef.current.value = "";
                }
            }
        } catch (error) {
            return errorMessage(error);
        }
    };

    return (
        <div>
            <div className="flex items-center gap-x-2 mb-4">
                <div
                    onClick={() => {
                        navigate("/dashboard/courses-management");
                    }}
                    className="w-10 h-10 border-2 border-black flex justify-center items-center rounded-full cursor-pointer hover:bg-gray-100 transition"
                >
                    <IoMdArrowRoundBack size={25} />
                </div>
                <div>
                    <h1 className="text-lg font-semibold">Back to Courses</h1>
                </div>
            </div>

            <div className="pb-20">
                <div className="max-w-7xl p-9 rounded-[14px] mx-auto bg-white shadow shadow-[#00000033]">
                    <div className="border-b pb-4 mb-6">
                        <span className="text-sm font-semibold uppercase tracking-wider text-amber-600">
                            Course Content Builder
                        </span>
                        <h2 className="text-2xl font-bold text-gray-800 mt-1">
                            Add Lessons to: {courseTitle}
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* 1. Module / Section Name */}
                        <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Layers className="w-5 h-5 text-amber-600" />
                                <label className="text-base font-semibold text-gray-800">
                                    Course Section / Module Name *
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">
                                Group lessons into structured modules (e.g. "Introduction", "What you will need", "Nail Art Tutorials").
                            </p>
                            <Input
                                value={sectionName}
                                onChange={(e) => setSectionName(e.target.value)}
                                placeholder="Enter section name (e.g. Introduction)"
                                className="w-full bg-white font-medium"
                                required
                            />

                            {/* Quick Suggestions for existing sections */}
                            {existingSections.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    <span className="text-xs font-medium text-gray-600">Existing modules:</span>
                                    {existingSections.map((sec) => (
                                        <button
                                            key={sec}
                                            type="button"
                                            onClick={() => setSectionName(sec)}
                                            className={`text-xs px-3 py-1 rounded-full border transition-all ${
                                                sectionName === sec
                                                    ? "bg-amber-500 text-white border-amber-500 font-semibold shadow-sm"
                                                    : "bg-white text-gray-700 border-gray-300 hover:border-amber-400"
                                            }`}
                                        >
                                            + {sec}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 2. Lesson Title */}
                        <div className="mb-4">
                            <label className="block text-base font-semibold text-gray-700 mb-2">
                                Lesson Title *
                            </label>
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: "Lesson title is required" }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="e.g. Introduction to Nail Art / What You Will Need"
                                        className={errors.title ? "border-red-500" : ""}
                                    />
                                )}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        {/* 3. Lesson Description / Content */}
                        <div className="mb-6">
                            <label className="block text-base font-semibold text-gray-700 mb-2">
                                Lesson Content / Description
                            </label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        rows={4}
                                        placeholder="Enter lesson description, instructions, materials list, or article content..."
                                        className={errors.description ? "border-red-500" : ""}
                                    />
                                )}
                            />
                        </div>

                        {/* 4. Lesson Video Section (Optional) */}
                        <div className="mb-6 p-5 border rounded-xl bg-gray-50/50">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Video className="w-5 h-5 text-amber-600" />
                                    <label className="text-base font-semibold text-gray-800">
                                        Lesson Video (Optional)
                                    </label>
                                </div>
                                {(videoPath || preview) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setVideoPath("");
                                            setPreview(undefined);
                                            setIsUpload(false);
                                            setProgress(0);
                                            if (fileInputRef.current) fileInputRef.current.value = "";
                                        }}
                                        className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline"
                                    >
                                        Remove / Clear Video
                                    </button>
                                )}
                            </div>

                                {/* Option Tabs */}
                                <div className="flex gap-4 mb-4">
                                    <button
                                        type="button"
                                        onClick={() => setVideoOption("upload")}
                                        className={`flex-1 py-3 px-4 rounded-lg border font-medium flex items-center justify-center gap-2 transition-all ${
                                            videoOption === "upload"
                                                ? "bg-yellow-100 border-yellow-400 text-amber-900"
                                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                                        }`}
                                    >
                                        <Upload size={18} /> Upload Video (.MOV / .MP4)
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setVideoOption("url")}
                                        className={`flex-1 py-3 px-4 rounded-lg border font-medium flex items-center justify-center gap-2 transition-all ${
                                            videoOption === "url"
                                                ? "bg-yellow-100 border-yellow-400 text-amber-900"
                                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                                        }`}
                                    >
                                        <Link2 size={18} /> Video Link (YouTube)
                                    </button>
                                </div>

                                {/* Upload File */}
                                {videoOption === "upload" && (
                                    <label className="w-full h-40 border-2 border-dashed border-gray-300 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-white transition">
                                        <Upload size={32} className="text-gray-400 mb-2" />
                                        <p className="font-medium text-gray-700">Click to upload video</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Supports .MOV, .MP4, .MKV, .AVI (Resumable chunked upload)
                                        </p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="video/*,.mov,.mp4,.avi,.mkv"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                )}

                                {videoOption === "upload" && (
                                    <>
                                        {/* Progress Bar */}
                                        {uploading && (
                                            <div className="mt-4">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                                    <div
                                                        className="bg-amber-500 h-2.5 transition-all duration-300"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-sm font-medium text-gray-600 mt-2">
                                                    Uploading: {progress}%
                                                </p>
                                            </div>
                                        )}

                                        {/* Upload Success message */}
                                        {isUpload && (
                                            <p className="font-semibold text-base mt-3 text-green-600 flex items-center gap-2">
                                                ✓ Video uploaded successfully
                                                {uploadSize ? (
                                                    <span className="text-xs text-gray-500 font-normal">
                                                        ({Math.floor(uploadSize / 60)}m {Math.round(uploadSize % 60)}s)
                                                    </span>
                                                ) : null}
                                            </p>
                                        )}
                                    </>
                                )}

                                {/* Video Link */}
                                {videoOption === "url" && (
                                    <div className="mt-2">
                                        <Controller
                                            name="video_url"
                                            control={control}
                                            rules={{
                                                required: videoOption === "url" ? "Video link is required" : false,
                                            }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder="Enter YouTube video link (e.g. https://www.youtube.com/watch?v=...)"
                                                    className={errors.video_url ? "border-red-500" : ""}
                                                    onBlur={(e) => {
                                                        field.onBlur();
                                                        calculateYouTubeDuration(e.target.value);
                                                    }}
                                                />
                                            )}
                                        />
                                        {errors.video_url && (
                                            <p className="text-red-500 text-sm mt-1">{errors.video_url.message}</p>
                                        )}

                                        {loadingDuration && (
                                            <p className="text-sm text-gray-500 mt-2">Calculating duration...</p>
                                        )}

                                        {videoDuration && (
                                            <p className="text-green-600 text-sm font-medium mt-2">
                                                Duration: {videoDuration} ({videoMinutes} minutes)
                                            </p>
                                        )}

                                        {durationError && (
                                            <p className="text-red-500 text-sm mt-2">{durationError}</p>
                                        )}
                                    </div>
                                )}

                                {/* Video Player Preview */}
                                {preview && (
                                    <div className="mt-4 rounded-xl overflow-hidden border">
                                        <MediaController
                                            style={{
                                                width: "100%",
                                                maxHeight: "360px",
                                                aspectRatio: "16/9",
                                            }}
                                        >
                                            <ReactPlayer
                                                slot="media"
                                                src={preview}
                                                controls={false}
                                                onLoadedMetadata={(e: any) => {
                                                    const dur = e?.target?.duration;
                                                    if (dur && isFinite(dur) && dur > 0 && (!uploadSize || uploadSize <= 0)) {
                                                        setUploadSize(dur);
                                                    }
                                                }}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                }}
                                            />
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
                                )}

                                {/* Video Duration Editor (Auto-detected & Editable) */}
                                {(videoPath || preview) && (
                                    <div className="mt-4 p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                                ⏱ Video Duration:
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={durationMinutes || ""}
                                                    onChange={(e) => setDurationMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                                                    className="w-16 px-2.5 py-1 text-sm border border-gray-300 rounded-lg bg-white text-center font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                                                    placeholder="0"
                                                />
                                                <span className="text-xs text-gray-600 font-semibold">min</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="59"
                                                    value={durationSeconds || ""}
                                                    onChange={(e) => setDurationSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                                                    className="w-16 px-2.5 py-1 text-sm border border-gray-300 rounded-lg bg-white text-center font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                                                    placeholder="0"
                                                />
                                                <span className="text-xs text-gray-600 font-semibold">sec</span>
                                            </div>
                                        </div>
                                        <span className="text-[11px] text-amber-900/80 font-medium">
                                            {durationMinutes > 0 || durationSeconds > 0
                                                ? `Total: ${durationMinutes}m ${durationSeconds}s`
                                                : "Auto-detected or enter duration manually"}
                                        </span>
                                    </div>
                                )}
                            </div>

                        {/* 6. Lesson Graphic / Reference Images (Optional) */}
                        <div className="mb-6 p-5 border rounded-xl bg-gray-50/50">
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-base font-semibold text-gray-700">
                                    Lesson Graphics / Document Pages (Optional)
                                </label>
                                {imageItems.length > 0 && (
                                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                        {imageItems.length} {imageItems.length === 1 ? "Page / Image" : "Pages / Images"} selected
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mb-4">
                                Attach single or multiple document pages, illustrative photos, nail art step sheets, or Canva exports to accompany this lesson.
                            </p>

                            {/* Grid of selected images */}
                            {imageItems.length > 0 && (
                                <div className="space-y-4 mb-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {imageItems.map((item, index) => (
                                            <div
                                                key={item.id}
                                                draggable
                                                onDragStart={() => handleImageDragStart(index)}
                                                onDragOver={handleImageDragOver}
                                                onDrop={() => handleImageDrop(index)}
                                                className={`relative border rounded-xl overflow-hidden bg-white shadow-sm flex flex-col p-2 group transition cursor-move select-none ${
                                                    draggedImageIndex === index ? "opacity-40 border-amber-500 scale-[0.98]" : "hover:border-amber-400"
                                                }`}
                                                title="Drag and drop to reorder"
                                            >
                                                <div className="flex items-center justify-between mb-1.5 px-1">
                                                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                                                        ⋮⋮ Page {index + 1}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            disabled={index === 0}
                                                            onClick={(e) => { e.stopPropagation(); handleMoveImage(index, index - 1); }}
                                                            className="w-5 h-5 bg-gray-100 hover:bg-amber-100 text-gray-700 disabled:opacity-20 disabled:pointer-events-none rounded flex items-center justify-center text-xs font-bold"
                                                            title="Move Left / Earlier"
                                                        >
                                                            ←
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={index === imageItems.length - 1}
                                                            onClick={(e) => { e.stopPropagation(); handleMoveImage(index, index + 1); }}
                                                            className="w-5 h-5 bg-gray-100 hover:bg-amber-100 text-gray-700 disabled:opacity-20 disabled:pointer-events-none rounded flex items-center justify-center text-xs font-bold"
                                                            title="Move Right / Later"
                                                        >
                                                            →
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); handleRemoveImageItem(item.id); }}
                                                            className="w-5 h-5 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white rounded flex items-center justify-center transition ml-1"
                                                            title="Remove page"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center h-48 border border-slate-100">
                                                    <img
                                                        src={item.previewUrl}
                                                        alt={`Page ${index + 1}`}
                                                        className="w-full h-full object-contain pointer-events-none"
                                                    />
                                                </div>
                                                <p className="text-[11px] text-gray-500 truncate mt-1 px-1" title={item.file.name}>
                                                    {item.file.name}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between pt-1">
                                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg cursor-pointer transition">
                                            <Upload size={14} /> Add more pages / images
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleClearAllImages}
                                            className="text-xs text-red-600 hover:underline font-medium"
                                        >
                                            Remove all
                                        </button>
                                    </div>
                                </div>
                            )}

                            {imageItems.length === 0 && (
                                <label className="w-full h-36 border-2 border-dashed border-gray-300 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-white transition hover:bg-amber-50/20">
                                    <ImageIcon size={32} className="text-gray-400 mb-2" />
                                    <p className="font-medium text-gray-700">
                                        Click to upload graphics / document pages
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Select one or multiple PNG, JPG, JPEG, WEBP files (up to 10MB each)</p>
                                    <input
                                        ref={imageInputRef}
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>

                        {/* 6. Free Preview Checkbox */}
                        <div className="mb-8 flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                            <input
                                type="checkbox"
                                id="is_free_preview"
                                checked={isFreePreview}
                                onChange={(e) => setIsFreePreview(e.target.checked)}
                                className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500 cursor-pointer"
                            />
                            <label
                                htmlFor="is_free_preview"
                                className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-1.5"
                            >
                                <Eye size={16} className="text-gray-500" />
                                Allow Free Preview (Students can access this lesson before purchasing)
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-end">
                            <Button
                                type="submit"
                                disabled={timeLoading || uploading}
                                className="bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] text-black font-semibold text-base py-3 px-8 rounded-full shadow hover:opacity-95 transition"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Spinner />
                                        <span>Saving Lesson...</span>
                                    </div>
                                ) : (
                                    "+ Add Lesson to Course"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Course Lessons List Component */}
                <div className="max-w-7xl mx-auto mt-10">
                    <CourseLesson id={id} />
                </div>
            </div>
        </div>
    );
};

export default AddLeason;

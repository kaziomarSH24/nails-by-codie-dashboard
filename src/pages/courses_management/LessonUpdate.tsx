import { useEffect, useRef, useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import Resumable from "resumablejs";
import { errorMessage } from "../../lib/error/errorMsg";
import {
    useLazySingleLessonQuery,
    useLessonUpdateMutation,
    useGetLessonByCourseIdQuery,
} from "../../api/lesson-api/lessonApi";
import { uploadAlert } from "../../lib/alert/uploadAlert";
import { toast } from "sonner";
import { Spinner } from "../../components/ui/spinner";
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

interface LessonUpdateProps {
    lessonId?: string;
    courseId?: string;
    setUpdateModal: (value: boolean) => void;
}

export const LessonUpdate = ({ lessonId, courseId, setUpdateModal }: LessonUpdateProps) => {
    const token = localStorage.getItem("token");

    // Fetch course for existing section names
    const { data: courseResp } = useGetLessonByCourseIdQuery(courseId, { skip: !courseId });
    const existingLessons = courseResp?.data?.lessons || [];
    const existingSections: string[] = Array.from(
        new Set(
            existingLessons
                .map((l: any) => l.section_name?.trim())
                .filter((s: string | undefined): s is string => Boolean(s && s.length > 0))
        )
    );

    // Form states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [sectionName, setSectionName] = useState("General");
    const [isFreePreview, setIsFreePreview] = useState(false);

    // Video states
    const [videoOption, setVideoOption] = useState<"upload" | "url">("upload");
    const [videoUrlInput, setVideoUrlInput] = useState("");
    const [preview, setPreview] = useState<string | undefined>(undefined);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [videoPath, setVideoPath] = useState<string>("");
    const [isUpload, setIsUpload] = useState(false);
    const [uploadSize, setUploadSize] = useState<number>();

    // Image states (supporting multiple pages/graphics: existing + newly added)
    interface ExistingImage {
        path: string;
        url: string;
    }
    interface NewImageItem {
        id: string;
        file: File;
        previewUrl: string;
    }
    const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
    const [deletedImages, setDeletedImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<NewImageItem[]>([]);

    const resumableRef = useRef<Resumable | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    // Duration calculation for YouTube
    const [loadingDuration, setLoadingDuration] = useState(false);
    const [durationError, setDurationError] = useState<string>("");
    const [videoDuration, setVideoDuration] = useState("");
    const [videoMinutes, setVideoMinutes] = useState(0);
    const [durationMinutes, setDurationMinutes] = useState<number>(0);
    const [durationSeconds, setDurationSeconds] = useState<number>(0);

    // Query single lesson
    const [getSingleLesson, { data: singleLesson, isLoading: isFetchingLesson }] =
        useLazySingleLessonQuery();

    useEffect(() => {
        if (courseId && lessonId) {
            getSingleLesson({ courseId, lessonId });
        }
    }, [courseId, lessonId, getSingleLesson]);

    // Populate initial lesson data
    useEffect(() => {
        if (singleLesson?.data) {
            const data = singleLesson.data;
            setTitle(data.title ?? "");
            setDescription(data.description ?? "");
            setSectionName(data.section_name ?? "General");
            setIsFreePreview(Boolean(data.is_free_preview));

            // Populate video data
            setVideoOption(data.video_type === "url" ? "url" : "upload");
            if (data.video_type === "url") {
                setVideoUrlInput(data.video_path ?? "");
                setPreview(data.video_path ?? "");
                if (data.video_path) {
                    calculateYouTubeDuration(data.video_path);
                }
            } else if (data.video_url) {
                setPreview(data.video_url);
            }

            if (data.duration && data.duration > 0) {
                setUploadSize(data.duration);
                const totalSec = Math.round(data.duration);
                setDurationMinutes(Math.floor(totalSec / 60));
                setDurationSeconds(totalSec % 60);
            }

            // Populate multiple images list
            const rawImages: string[] = Array.isArray(data.images) && data.images.length > 0
                ? data.images
                : (data.image_url
                    ? [data.image_url]
                    : (data.image_path
                        ? (() => {
                            const p = data.image_path;
                            if (typeof p === "string" && p.startsWith("[") && p.endsWith("]")) {
                                try { return JSON.parse(p); } catch { return [p]; }
                            }
                            return [p];
                        })()
                        : []));

            const rawPaths: string[] = Array.isArray(data.image_paths) && data.image_paths.length > 0
                ? data.image_paths
                : rawImages;

            const existingList: ExistingImage[] = rawImages.map((img: string, idx: number) => {
                const url = img.startsWith("http://") || img.startsWith("https://")
                    ? img
                    : `${import.meta.env.VITE_BASE_URL}${img.startsWith("/storage/") ? img : `/storage/${img.replace(/^\//, "")}`}`;
                const path = rawPaths[idx] || img;
                return { path, url };
            });

            setExistingImages(existingList);
            setDeletedImages([]);
            setNewImages([]);
        }
    }, [singleLesson?.data]);

    // -------------------- RESUMABLE SETUP --------------------
    useEffect(() => {
        if (!courseId || !token) return;

        const r = new Resumable({
            target: `${import.meta.env.VITE_BASE_URL}/api/v1/admin/courses/upload-video`,
            chunkSize: 2 * 1024 * 1024,
            simultaneousUploads: 3,
            testChunks: false,
            headers: { Authorization: `Bearer ${token}` },
            query: { course_id: courseId },
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
            const f = file as { progress: (quick?: boolean) => number };
            setProgress(Math.floor(f.progress(true) * 100));
        });

        r.on("fileSuccess", (_file: Resumable, message: string) => {
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
    }, [courseId, token]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        resumableRef.current?.addFile(file);

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

    const handleRemoveExistingImage = (pathToRemove: string) => {
        setExistingImages((prev) => prev.filter((img) => img.path !== pathToRemove));
        setDeletedImages((prev) => (prev.includes(pathToRemove) ? prev : [...prev, pathToRemove]));
    };

    const handleAddNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newItems: NewImageItem[] = files.map((file) => ({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        setNewImages((prev) => [...prev, ...newItems]);
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    const handleRemoveNewImage = (idToRemove: string) => {
        setNewImages((prev) => {
            const item = prev.find((x) => x.id === idToRemove);
            if (item) URL.revokeObjectURL(item.previewUrl);
            return prev.filter((x) => x.id !== idToRemove);
        });
    };

    const handleClearAllImages = () => {
        existingImages.forEach((img) => {
            setDeletedImages((prev) => (prev.includes(img.path) ? prev : [...prev, img.path]));
        });
        setExistingImages([]);
        newImages.forEach((item) => URL.revokeObjectURL(item.previewUrl));
        setNewImages([]);
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    // -------------------- Drag & Drop Reordering --------------------
    const [draggedExistingIndex, setDraggedExistingIndex] = useState<number | null>(null);

    const handleExistingDragStart = (index: number) => {
        setDraggedExistingIndex(index);
    };

    const handleExistingDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleExistingDrop = (dropIndex: number) => {
        if (draggedExistingIndex === null || draggedExistingIndex === dropIndex) return;
        setExistingImages((prev) => {
            const updated = [...prev];
            const [movedItem] = updated.splice(draggedExistingIndex, 1);
            updated.splice(dropIndex, 0, movedItem);
            return updated;
        });
        setDraggedExistingIndex(null);
    };

    const handleMoveExistingImage = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= existingImages.length) return;
        setExistingImages((prev) => {
            const updated = [...prev];
            const [movedItem] = updated.splice(fromIndex, 1);
            updated.splice(toIndex, 0, movedItem);
            return updated;
        });
    };

    const [draggedNewIndex, setDraggedNewIndex] = useState<number | null>(null);

    const handleNewDragStart = (index: number) => {
        setDraggedNewIndex(index);
    };

    const handleNewDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleNewDrop = (dropIndex: number) => {
        if (draggedNewIndex === null || draggedNewIndex === dropIndex) return;
        setNewImages((prev) => {
            const updated = [...prev];
            const [movedItem] = updated.splice(draggedNewIndex, 1);
            updated.splice(dropIndex, 0, movedItem);
            return updated;
        });
        setDraggedNewIndex(null);
    };

    const handleMoveNewImage = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= newImages.length) return;
        setNewImages((prev) => {
            const updated = [...prev];
            const [movedItem] = updated.splice(fromIndex, 1);
            updated.splice(toIndex, 0, movedItem);
            return updated;
        });
    };

    // YouTube duration parser
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
        }
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
            setVideoDuration(parseDuration(isoDuration));
            setVideoMinutes(durationToMinutes(isoDuration));

            const matchDur = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            if (matchDur) {
                const hours = parseInt(matchDur[1] || "0");
                const mins = parseInt(matchDur[2] || "0");
                const secs = parseInt(matchDur[3] || "0");
                setDurationMinutes(hours * 60 + mins);
                setDurationSeconds(secs);
            }
        } catch (err) {
            setDurationError("Failed to fetch video duration");
        } finally {
            setLoadingDuration(false);
        }
    };

    const [lessonUpdate, { isLoading: isUpdating }] = useLessonUpdateMutation();

    // -------------------- SUBMIT --------------------
    const handleSubmitUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Lesson title is required");
            return;
        }

        const hasVideo =
            (videoOption === "upload" && Boolean(videoPath || preview || singleLesson?.data?.video_path)) ||
            (videoOption === "url" && Boolean(videoUrlInput.trim()));
        const hasImage = existingImages.length > 0 || newImages.length > 0;
        const hasText = Boolean(description && description.trim().length > 0);

        if (!hasVideo && !hasImage && !hasText) {
            toast.error("Please provide at least a video, image(s), or lesson content.");
            return;
        }

        const calculatedLessonType = hasVideo ? "video" : (hasImage ? "image" : "article");

        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("description", description);
        formData.append("section_name", sectionName.trim() || "General");
        formData.append("lesson_type", calculatedLessonType);
        formData.append("is_free_preview", isFreePreview ? "1" : "0");

        const totalDuration = (durationMinutes * 60) + durationSeconds;
        if (hasVideo) {
            formData.append("video_type", videoOption);
            if (videoOption === "upload") {
                if (videoPath) {
                    // Newly uploaded video
                    formData.append("video_path", videoPath);
                } else if (preview && singleLesson?.data?.video_path) {
                    // Keep existing video path
                    formData.append("video_path", singleLesson.data.video_path);
                }
            } else {
                // Video URL
                const url = videoUrlInput.trim();
                if (url) {
                    formData.append("video_url", url);
                }
            }
            formData.append(
                "duration",
                String(totalDuration > 0 ? totalDuration : (uploadSize ? Math.ceil(uploadSize) : (singleLesson?.data?.duration || 0)))
            );
        } else {
            formData.append("duration", "0");
        }

        // Send retained existing image paths
        existingImages.forEach((img) => {
            formData.append("image_paths[]", img.path);
        });

        // Send deleted image paths for server-side file deletion
        deletedImages.forEach((delPath) => {
            formData.append("deleted_images[]", delPath);
        });

        // Send newly uploaded image files
        newImages.forEach((item) => {
            formData.append("images[]", item.file);
        });

        try {
            const confirmed = await uploadAlert();
            if (!confirmed) return;

            const res = await lessonUpdate({ formData, courseId, lessonId }).unwrap();
            if (res) {
                toast.success(res?.message || "Lesson updated successfully");
                setUpdateModal(false);
            }
        } catch (error) {
            return errorMessage(error);
        }
    };

    if (isFetchingLesson) {
        return (
            <div className="flex justify-center p-12">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 bg-white rounded-xl">
            <div className="border-b pb-4 mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                    Edit Lesson Details
                </span>
                <h2 className="text-2xl font-bold text-gray-800 mt-1">
                    Update: {title || "Lesson"}
                </h2>
            </div>

            <form onSubmit={handleSubmitUpdate}>
                {/* 1. Module / Section Name */}
                <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Layers className="w-5 h-5 text-amber-600" />
                        <label className="text-base font-semibold text-gray-800">
                            Course Section / Module Name *
                        </label>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                        Group this lesson into a module (e.g. "Introduction", "What you will need", "Nail Art Tutorials").
                    </p>
                    <Input
                        value={sectionName}
                        onChange={(e) => setSectionName(e.target.value)}
                        placeholder="e.g. Introduction"
                        className="w-full bg-white font-medium"
                        required
                    />

                    {/* Suggestions */}
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

                {/* 2. Title */}
                <div className="mb-4">
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                        Lesson Title *
                    </label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter Lesson Title"
                        required
                    />
                </div>

                {/* 3. Description */}
                <div className="mb-6">
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                        Lesson Content / Description
                    </label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Enter lesson description or article instructions..."
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
                        {(preview || videoPath || videoUrlInput) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setPreview(undefined);
                                    setVideoPath("");
                                    setVideoUrlInput("");
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

                        {/* Upload Option */}
                        {videoOption === "upload" && (
                            <label className="w-full h-36 border-2 border-dashed border-gray-300 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-white transition">
                                <Upload size={32} className="text-gray-400 mb-2" />
                                <p className="font-medium text-gray-700">
                                    {videoPath ? "Replace video file" : "Click to upload replacement video"}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Supports .MOV, .MP4, .MKV, .AVI
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

                                {isUpload && (
                                    <p className="font-semibold text-base mt-3 text-green-600">
                                        ✓ New video uploaded successfully
                                    </p>
                                )}
                            </>
                        )}

                        {/* Video Link Option */}
                        {videoOption === "url" && (
                            <div className="mt-2">
                                <Input
                                    value={videoUrlInput}
                                    onChange={(e) => setVideoUrlInput(e.target.value)}
                                    placeholder="Enter YouTube video link"
                                    onBlur={(e) => calculateYouTubeDuration(e.target.value)}
                                />
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

                        {/* Video Preview */}
                        {preview && (
                            <div className="mt-4 rounded-xl overflow-hidden border">
                                <MediaController
                                    style={{
                                        width: "100%",
                                        maxHeight: "300px",
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
                                        style={{ width: "100%", height: "100%" }}
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
                        {(preview || videoPath || videoUrlInput) && (
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

                {/* 5. Lesson Graphics / Document Pages (Optional) */}
                <div className="mb-6 p-5 border rounded-xl bg-gray-50/50">
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-base font-semibold text-gray-700">
                            Lesson Graphics / Document Pages (Optional)
                        </label>
                        {(existingImages.length > 0 || newImages.length > 0) && (
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                {existingImages.length + newImages.length} {existingImages.length + newImages.length === 1 ? "Page / Image" : "Pages / Images"} total
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                        Attach or replace document pages, illustrative photos, nail art diagrams, or Canva export slides.
                    </p>

                    {(existingImages.length > 0 || newImages.length > 0) ? (
                        <div className="space-y-4 mb-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {/* Existing server images */}
                                {existingImages.map((img, index) => (
                                    <div
                                        key={`existing-${img.path}-${index}`}
                                        draggable
                                        onDragStart={() => handleExistingDragStart(index)}
                                        onDragOver={handleExistingDragOver}
                                        onDrop={() => handleExistingDrop(index)}
                                        className={`relative border rounded-xl overflow-hidden bg-white shadow-sm flex flex-col p-2 group transition cursor-move select-none ${
                                            draggedExistingIndex === index ? "opacity-40 border-amber-500 scale-[0.98]" : "hover:border-amber-400"
                                        }`}
                                        title="Drag and drop to reorder"
                                    >
                                        <div className="flex items-center justify-between mb-1.5 px-1">
                                            <span className="text-[11px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 flex items-center gap-1">
                                                ⋮⋮ Page {index + 1}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    disabled={index === 0}
                                                    onClick={(e) => { e.stopPropagation(); handleMoveExistingImage(index, index - 1); }}
                                                    className="w-5 h-5 bg-gray-100 hover:bg-amber-100 text-gray-700 disabled:opacity-20 disabled:pointer-events-none rounded flex items-center justify-center text-xs font-bold"
                                                    title="Move Left / Earlier"
                                                >
                                                    ←
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={index === existingImages.length - 1}
                                                    onClick={(e) => { e.stopPropagation(); handleMoveExistingImage(index, index + 1); }}
                                                    className="w-5 h-5 bg-gray-100 hover:bg-amber-100 text-gray-700 disabled:opacity-20 disabled:pointer-events-none rounded flex items-center justify-center text-xs font-bold"
                                                    title="Move Right / Later"
                                                >
                                                    →
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); handleRemoveExistingImage(img.path); }}
                                                    className="w-5 h-5 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white rounded flex items-center justify-center transition ml-1"
                                                    title="Remove page"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center h-48 border border-slate-100">
                                            <img
                                                src={img.url}
                                                alt={`Page ${index + 1}`}
                                                className="w-full h-full object-contain pointer-events-none"
                                            />
                                        </div>
                                        <p className="text-[11px] text-gray-400 truncate mt-1 px-1">
                                            Saved on server
                                        </p>
                                    </div>
                                ))}

                                {/* Newly added image items */}
                                {newImages.map((item, index) => (
                                    <div
                                        key={item.id}
                                        draggable
                                        onDragStart={() => handleNewDragStart(index)}
                                        onDragOver={handleNewDragOver}
                                        onDrop={() => handleNewDrop(index)}
                                        className={`relative border-2 border-dashed border-amber-300 rounded-xl overflow-hidden bg-amber-50/20 shadow-sm flex flex-col p-2 group transition cursor-move select-none ${
                                            draggedNewIndex === index ? "opacity-40 border-amber-500 scale-[0.98]" : "hover:border-amber-400"
                                        }`}
                                        title="Drag and drop to reorder"
                                    >
                                        <div className="flex items-center justify-between mb-1.5 px-1">
                                            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                                                ⋮⋮ New Page {index + 1}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    disabled={index === 0}
                                                    onClick={(e) => { e.stopPropagation(); handleMoveNewImage(index, index - 1); }}
                                                    className="w-5 h-5 bg-amber-100 hover:bg-amber-200 text-amber-900 disabled:opacity-20 disabled:pointer-events-none rounded flex items-center justify-center text-xs font-bold"
                                                    title="Move Left / Earlier"
                                                >
                                                    ←
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={index === newImages.length - 1}
                                                    onClick={(e) => { e.stopPropagation(); handleMoveNewImage(index, index + 1); }}
                                                    className="w-5 h-5 bg-amber-100 hover:bg-amber-200 text-amber-900 disabled:opacity-20 disabled:pointer-events-none rounded flex items-center justify-center text-xs font-bold"
                                                    title="Move Right / Later"
                                                >
                                                    →
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); handleRemoveNewImage(item.id); }}
                                                    className="w-5 h-5 bg-red-100 hover:bg-red-600 text-red-600 hover:text-white rounded flex items-center justify-center transition ml-1"
                                                    title="Remove page"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="rounded-lg overflow-hidden bg-white flex items-center justify-center h-48 border border-amber-200">
                                            <img
                                                src={item.previewUrl}
                                                alt={`New Page ${index + 1}`}
                                                className="w-full h-full object-contain pointer-events-none"
                                            />
                                        </div>
                                        <p className="text-[11px] text-amber-700 font-medium truncate mt-1 px-1" title={item.file.name}>
                                            + {item.file.name}
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
                                        onChange={handleAddNewImages}
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={handleClearAllImages}
                                    className="text-xs text-red-600 hover:underline font-medium"
                                >
                                    Remove all pages
                                </button>
                            </div>
                        </div>
                    ) : (
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
                                onChange={handleAddNewImages}
                            />
                        </label>
                    )}
                </div>

                {/* 6. Free Preview Checkbox */}
                <div className="mb-8 flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                    <input
                        type="checkbox"
                        id="update_free_preview"
                        checked={isFreePreview}
                        onChange={(e) => setIsFreePreview(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500 cursor-pointer"
                    />
                    <label
                        htmlFor="update_free_preview"
                        className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-1.5"
                    >
                        <Eye size={16} className="text-gray-500" />
                        Allow Free Preview (Students can view this lesson without course purchase)
                    </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setUpdateModal(false)}
                        className="rounded-full px-6"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isUpdating || uploading}
                        className="bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] text-black font-semibold px-8 rounded-full shadow hover:opacity-95 transition"
                    >
                        {isUpdating ? (
                            <div className="flex items-center gap-2">
                                <Spinner />
                                <span>Saving...</span>
                            </div>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default LessonUpdate;

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
    const [lessonType, setLessonType] = useState<"video" | "image">("video");
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

    // Image states
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const resumableRef = useRef<Resumable | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    // Duration calculation for YouTube
    const [loadingDuration, setLoadingDuration] = useState(false);
    const [durationError, setDurationError] = useState<string>("");
    const [videoDuration, setVideoDuration] = useState("");
    const [videoMinutes, setVideoMinutes] = useState(0);

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
            setLessonType((data.lesson_type as "video" | "image") ?? (data.image_path ? "image" : "video"));
            setIsFreePreview(Boolean(data.is_free_preview));

            // Populate video data
            setVideoOption(data.video_type === "url" ? "url" : "upload");
            if (data.video_type === "url") {
                setVideoUrlInput(data.video_path ?? "");
                setPreview(data.video_path ?? "");
            } else if (data.video_url) {
                setPreview(data.video_url);
            }

            // Populate image data
            if (data.image_path) {
                setImagePreview(data.image_url || `${import.meta.env.VITE_BASE_URL}/storage/${data.image_path}`);
            }
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
            setUploadSize(videoEl.duration);
            URL.revokeObjectURL(url);
        };
        videoEl.onerror = () => {
            const audio = new Audio(url);
            audio.addEventListener("loadedmetadata", () => {
                setUploadSize(audio.duration);
                URL.revokeObjectURL(url);
            });
        };
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        if (imagePreview && imageFile) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
        setImageFile(null);
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
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

        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("description", description);
        formData.append("section_name", sectionName.trim() || "General");
        formData.append("lesson_type", lessonType);
        formData.append("is_free_preview", isFreePreview ? "1" : "0");

        if (lessonType === "video") {
            formData.append("video_type", videoOption);
            if (videoOption === "upload") {
                if (videoPath) {
                    // Newly uploaded video
                    formData.append("video_path", videoPath);
                    if (uploadSize) {
                        formData.append("duration", String(Math.ceil(uploadSize)));
                    }
                } else if (singleLesson?.data?.video_path) {
                    // Keep existing video path
                    formData.append("video_path", singleLesson.data.video_path);
                    if (singleLesson.data.duration) {
                        formData.append("duration", String(singleLesson.data.duration));
                    }
                }
            } else {
                // Video URL
                const url = videoUrlInput.trim();
                if (url) {
                    formData.append("video_url", url);
                    formData.append("duration", String(videoMinutes * 60 || singleLesson?.data?.duration || 0));
                }
            }
        } else {
            // Article / Image Lesson
            if (imageFile) {
                formData.append("image", imageFile);
            } else if (imagePreview && singleLesson?.data?.image_path) {
                formData.append("image_path", singleLesson.data.image_path);
            }
            formData.append("duration", "0");
        }

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

                {/* 4. Lesson Format (Video vs Image) */}
                <div className="mb-6">
                    <label className="block text-base font-semibold text-gray-700 mb-2">
                        Lesson Format
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div
                            onClick={() => setLessonType("video")}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                lessonType === "video"
                                    ? "border-amber-500 bg-amber-50/60 shadow-sm"
                                    : "border-gray-200 bg-gray-50 hover:bg-gray-100/70"
                            }`}
                        >
                            <div
                                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                    lessonType === "video"
                                        ? "bg-amber-500 text-white"
                                        : "bg-gray-200 text-gray-600"
                                }`}
                            >
                                <Video size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Video Lesson</h4>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Upload video file (.MOV, .MP4) or YouTube link
                                </p>
                            </div>
                        </div>

                        <div
                            onClick={() => setLessonType("image")}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                lessonType === "image"
                                    ? "border-amber-500 bg-amber-50/60 shadow-sm"
                                    : "border-gray-200 bg-gray-50 hover:bg-gray-100/70"
                            }`}
                        >
                            <div
                                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                    lessonType === "image"
                                        ? "bg-amber-500 text-white"
                                        : "bg-gray-200 text-gray-600"
                                }`}
                            >
                                <ImageIcon size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">
                                    Article / Image Lesson
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Text instructions with optional image (no video)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Conditional Media Section */}
                {lessonType === "video" ? (
                    <div className="mb-6 p-5 border rounded-xl bg-gray-50/50">
                        <label className="block text-base font-semibold text-gray-700 mb-3">
                            Video Settings
                        </label>

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
                    </div>
                ) : (
                    /* Image / Article Uploader */
                    <div className="mb-6 p-5 border rounded-xl bg-gray-50/50">
                        <label className="block text-base font-semibold text-gray-700 mb-2">
                            Lesson Image / Diagram (Optional)
                        </label>

                        {imagePreview ? (
                            <div className="relative border rounded-xl overflow-hidden bg-white max-w-md shadow-sm">
                                <img
                                    src={imagePreview}
                                    alt="Lesson Preview"
                                    className="w-full h-56 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1.5 shadow hover:bg-red-700 transition"
                                    title="Remove Image"
                                >
                                    <X size={18} />
                                </button>
                                </div>
                            ) : (
                                <label className="w-full h-36 border-2 border-dashed border-gray-300 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-white transition">
                                    <ImageIcon size={32} className="text-gray-400 mb-2" />
                                    <p className="font-medium text-gray-700">Click to upload lesson image</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG, WEBP up to 10MB</p>
                                    <input
                                        ref={imageInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}

                            {imageFile ? (
                                <p className="font-semibold text-sm mt-3 text-green-600 flex items-center gap-1.5">
                                    ✓ New image selected: {imageFile.name} (will replace existing image upon saving)
                                </p>
                            ) : imagePreview ? (
                                <p className="font-medium text-xs mt-3 text-gray-500 flex items-center gap-1.5">
                                    Current lesson image active
                                </p>
                            ) : null}
                        </div>
                )}

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

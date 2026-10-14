import { useState } from "react";
import { toast } from "sonner";
import {
    useGetLessonByCourseIdQuery,
    useLessonDeleteMutation,
} from "../../api/lesson-api/lessonApi";
import { Button } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import { deleteAlert } from "../../lib/alert/deleteAlert";
import { errorMessage } from "../../lib/error/errorMsg";
import type { CourseLessonType, Lesson } from "../../lib/type/lessonType";
import { usePublishCourseMutation, useUnPublishCourseMutation } from "../../api/course-api/courseApi";
import LessonUpdate from "./LessonUpdate";
import { courseUpdateAlert } from "../../lib/alert/updateAlert";
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
import { useNavigate } from "react-router-dom";
import { Play, Image as ImageIcon, Video, Edit3, Trash2, Layers, Eye, FileText, X } from "lucide-react";

interface CourseLessonProps {
    id: string | undefined;
}

const CourseLesson = ({ id }: CourseLessonProps) => {
    const courseId = id;
    const navigate = useNavigate();

    // =================== STATE ===================
    const [videoModal, setVideoModal] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [lessonId, setLessonId] = useState<number | undefined>(undefined);
    const [updateModal, setUpdateModal] = useState<boolean>(false);

    // =================== API ===================
    const { data, isLoading } = useGetLessonByCourseIdQuery(courseId);

    const courseData: CourseLessonType = data?.data;
    const lessonData: Lesson[] = data?.data?.lessons || [];

    // Group lessons by section_name
    const groupedLessons = lessonData.reduce<Record<string, Lesson[]>>((acc, item) => {
        const section = item.section_name?.trim() || "General Lessons";
        if (!acc[section]) {
            acc[section] = [];
        }
        acc[section].push(item);
        return acc;
    }, {});

    const sectionNames = Object.keys(groupedLessons);

    // =================== PREVIEW HANDLERS ===================
    const handlePreview = (item: Lesson) => {
        setActiveLesson(item);
        if (item.lesson_type === "image" || (!item.video_url && item.image_url)) {
            setImageModal(true);
        } else if (item.video_url) {
            setActiveVideo(item.video_url);
            setVideoModal(true);
        } else {
            setImageModal(true);
        }
    };

    // =================== DELETE ===================
    const [lessonDelete] = useLessonDeleteMutation();
    const handleLessonDelete = async (id: number) => {
        setLessonId(id);
        try {
            const res = await deleteAlert();
            if (res.isConfirmed) {
                const response = await lessonDelete({
                    courseId,
                    lessonId: id.toString(),
                }).unwrap();

                toast.success(response?.message || "Lesson deleted successfully");
            }
        } catch (error) {
            errorMessage(error);
        }
    };

    // =================== PUBLISH / UNPUBLISH ===================
    const [publishCourse, { isLoading: courseStatusLoading }] = usePublishCourseMutation();
    const [unPublishCourse, { isLoading: unPublishLoading }] = useUnPublishCourseMutation();

    const courseStatusUpdate = async () => {
        try {
            const res = await courseUpdateAlert();
            if (res.isConfirmed) {
                const resp = await publishCourse(courseId).unwrap();
                if (resp) toast.success(resp?.message);
            }
        } catch (error) {
            return errorMessage(error);
        }
    };

    const courseUnPublish = async () => {
        try {
            const res = await courseUpdateAlert();
            if (res.isConfirmed) {
                const resp = await unPublishCourse(courseId).unwrap();
                if (resp) toast.success(resp?.message);
            }
        } catch (error) {
            return errorMessage(error);
        }
    };

    const handleUpdate = (id: number) => {
        setLessonId(id);
        setUpdateModal(true);
    };

    const formatDurationDisplay = (lesson: Lesson) => {
        if (lesson.actual_duration) return lesson.actual_duration;
        if (lesson.duration) {
            const mins = Math.floor(lesson.duration / 60);
            const secs = Math.round(lesson.duration % 60);
            return `${mins}m ${secs}s`;
        }
        return null;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center mt-10">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="mt-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        {courseData?.title} — Course Curriculum
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Total Modules: <span className="font-semibold text-gray-700">{sectionNames.length}</span> |
                        Total Lessons: <span className="font-semibold text-gray-700">{lessonData.length}</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider ${
                            courseData?.is_published == 1
                                ? "bg-green-100 text-green-700 border border-green-300"
                                : "bg-amber-100 text-amber-700 border border-amber-300"
                        }`}
                    >
                        {courseData?.is_published == 1 ? "● Published" : "○ Draft"}
                    </span>
                </div>
            </div>

            {/* Empty State */}
            {lessonData.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 mt-6">
                    <Layers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700">No lessons added yet</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Use the builder form above to create your first module and add lessons.
                    </p>
                </div>
            ) : (
                /* Grouped Section / Module Curriculum */
                <div className="space-y-8 mt-6">
                    {sectionNames.map((sectionTitle, sIndex) => {
                        const lessons = groupedLessons[sectionTitle];
                        return (
                            <div
                                key={sectionTitle}
                                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                            >
                                {/* Module Header Banner */}
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50/40 px-6 py-4 border-b border-amber-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                                            {sIndex + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">
                                                {sectionTitle}
                                            </h3>
                                            <span className="text-xs text-gray-500 font-medium">
                                                Module {sIndex + 1} • {lessons.length} {lessons.length === 1 ? "Lesson" : "Lessons"}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold px-3 py-1 bg-white/80 rounded-full border border-amber-200 text-amber-800">
                                        {lessons.filter((l) => l.lesson_type === "image").length} Articles /{" "}
                                        {lessons.filter((l) => l.lesson_type !== "image").length} Videos
                                    </span>
                                </div>

                                {/* Lessons inside Module */}
                                <div className="p-4 space-y-3">
                                    {lessons.map((item, lIndex) => {
                                        const isImageLesson = item.lesson_type === "image" || Boolean(item.image_url && !item.video_url);
                                        const durationStr = formatDurationDisplay(item);

                                        return (
                                            <div
                                                key={item.id}
                                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-amber-400 bg-white hover:bg-amber-50/20 transition-all gap-4"
                                            >
                                                {/* Left: Media icon & Title */}
                                                <div className="flex items-start sm:items-center gap-4 flex-1">
                                                    {/* Play or Image Icon Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePreview(item)}
                                                        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all flex-shrink-0 shadow-sm ${
                                                            isImageLesson
                                                                ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                                                : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                                        }`}
                                                        title={isImageLesson ? "View Article & Image" : "Play Video Lesson"}
                                                    >
                                                        {isImageLesson ? (
                                                            <ImageIcon size={20} />
                                                        ) : (
                                                            <Play size={18} className="ml-0.5" />
                                                        )}
                                                    </button>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <h4 className="font-semibold text-gray-900 text-base truncate">
                                                                {sIndex + 1}.{lIndex + 1} {item.title}
                                                            </h4>

                                                            {/* Format Badge */}
                                                            {isImageLesson ? (
                                                                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                                                                    <FileText size={12} /> Article
                                                                </span>
                                                            ) : (
                                                                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                                                                    <Video size={12} /> Video
                                                                </span>
                                                            )}

                                                            {/* Duration Badge */}
                                                            {durationStr && !isImageLesson && (
                                                                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                                                                    ⏱ {durationStr}
                                                                </span>
                                                            )}

                                                            {/* Free Preview Badge */}
                                                            {Boolean(item.is_free_preview) && (
                                                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                                                    <Eye size={12} /> Free Preview
                                                                </span>
                                                            )}
                                                        </div>

                                                        {item.description && (
                                                            <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Right: Actions */}
                                                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                                                    {/* View / Play preview */}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handlePreview(item)}
                                                        className="text-xs font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-100/50 rounded-lg px-2.5"
                                                    >
                                                        {isImageLesson ? "View" : "Watch"}
                                                    </Button>

                                                    {/* Edit */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdate(item.id)}
                                                        className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:text-amber-700 hover:border-amber-400 hover:bg-amber-50 transition"
                                                        title="Edit Lesson"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleLessonDelete(item.id)}
                                                        className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:text-red-600 hover:border-red-400 hover:bg-red-50 transition"
                                                        title="Delete Lesson"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-12 flex items-center justify-end gap-4 border-t pt-6">
                <Button
                    onClick={() => {
                        navigate("/dashboard/courses-management");
                    }}
                    variant="outline"
                    className="rounded-full px-8 py-2.5 font-medium"
                >
                    Back to All Courses
                </Button>

                <Button
                    onClick={courseData?.is_published == 1 ? courseUnPublish : courseStatusUpdate}
                    disabled={courseStatusLoading || unPublishLoading}
                    className="bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] text-black font-semibold px-8 py-2.5 rounded-full shadow hover:opacity-95 transition"
                >
                    {courseStatusLoading || unPublishLoading ? (
                        <div className="flex items-center gap-2">
                            <Spinner />
                            <span>Updating...</span>
                        </div>
                    ) : courseData?.is_published == 1 ? (
                        "Unpublish Course"
                    ) : (
                        "Publish Course to Store"
                    )}
                </Button>
            </div>

            {/* =================== VIDEO PREVIEW MODAL =================== */}
            {videoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative">
                        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                            <div>
                                <h4 className="font-bold text-gray-800 text-lg">
                                    {activeLesson?.title || "Video Lesson"}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    Module: {activeLesson?.section_name || "General"}
                                </p>
                            </div>
                            <button
                                onClick={() => setVideoModal(false)}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-4 bg-black">
                            <MediaController
                                style={{
                                    width: "100%",
                                    aspectRatio: "16/9",
                                }}
                            >
                                <ReactPlayer
                                    slot="media"
                                    src={`${activeVideo}`}
                                    controls={false}
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

                        {activeLesson?.description && (
                            <div className="p-4 bg-white border-t">
                                <h5 className="font-semibold text-sm text-gray-700 mb-1">Lesson Notes</h5>
                                <p className="text-sm text-gray-600 whitespace-pre-line">
                                    {activeLesson.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* =================== IMAGE & ARTICLE PREVIEW MODAL =================== */}
            {imageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl relative flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                                        Article Lesson
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium">
                                        Module: {activeLesson?.section_name || "General"}
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-800 text-xl mt-1">
                                    {activeLesson?.title}
                                </h4>
                            </div>
                            <button
                                onClick={() => setImageModal(false)}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Graphic / Image */}
                            {(activeLesson?.image_url || activeLesson?.image_path) && (
                                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 flex justify-center">
                                    <img
                                        src={(() => {
                                            const target = activeLesson.image_url || activeLesson.image_path;
                                            if (!target) return "";
                                            if (target.startsWith("http://") || target.startsWith("https://")) return target;
                                            const clean = target.startsWith("/") ? target : `/${target}`;
                                            const storagePath = clean.startsWith("/storage/") ? clean : `/storage${clean}`;
                                            return `${import.meta.env.VITE_BASE_URL}${storagePath}`;
                                        })()}
                                        alt={activeLesson.title}
                                        className="max-h-96 w-auto object-contain"
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                    Lesson Content
                                </h5>
                                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    {activeLesson?.description || "No content provided for this lesson."}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t bg-gray-50 flex justify-end">
                            <Button
                                onClick={() => setImageModal(false)}
                                className="bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] text-black font-semibold px-6 rounded-full"
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* =================== UPDATE MODAL =================== */}
            {updateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                    <div className="bg-white w-full max-w-4xl rounded-2xl relative flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
                        <div className="flex justify-end p-3 border-b bg-gray-50">
                            <button
                                onClick={() => setUpdateModal(false)}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 transition font-bold"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                            <LessonUpdate
                                courseId={courseId}
                                lessonId={lessonId?.toString()}
                                setUpdateModal={setUpdateModal}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseLesson;

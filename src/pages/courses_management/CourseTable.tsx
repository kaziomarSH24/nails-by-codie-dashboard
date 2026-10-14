import { useState } from "react";
import {
    Plus,
    Search,
    ChevronLeft,
    ChevronRight,
    Play,
    Image as ImageIcon,
    Eye,
    Edit3,
    Trash2,
    BookOpen,
    Clock,
    X,
    Award,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from "../../components/ui/dialog";
import { Link } from "react-router-dom";
import { useAllCourseQuery, useDeleteCourseMutation, usePublishUnPublishCourseMutation } from "../../api/course-api/courseApi";
import type { CourseType } from "../../lib/type/courseType";
import { errorMessage } from "../../lib/error/errorMsg";
import { deleteAlert } from "../../lib/alert/deleteAlert";
import { toast } from "sonner";
import { Spinner } from "../../components/ui/spinner";

import CourseUpdate from "./CourseUpdate";
import type { CourseLessonType, Lesson } from "../../lib/type/lessonType";
import { useGetLessonByCourseIdQuery } from "../../api/lesson-api/lessonApi";
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

const CourseTable = () => {
    const { data, isLoading, refetch } = useAllCourseQuery({});

    // ------------------------- DELETE COURSE ----------------------
    const [deleteCourse] = useDeleteCourseMutation();

    const handleDelete = async (id: number) => {
        try {
            const res = await deleteAlert();
            if (res.isConfirmed) {
                const res = await deleteCourse(id).unwrap();
                if (res) {
                    refetch();
                    toast.success(res?.message);
                }
            }
        } catch (error) {
            return errorMessage(error);
        }
    };

    // ------------------- ALL COURSE & FILTERS ---------------------
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    type Course = {
        id: number;
        thumbnail: string;
        title: string;
        description: string;
        is_published: boolean;
        price: string;
        reward_points: string;
    };

    const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 10;

    const courseData: CourseType[] = data?.data || [];

    // Filter by search & status
    const filteredCourses = courseData.filter((course) => {
        const matchesSearch =
            course.title.toLowerCase().includes(search.toLowerCase()) ||
            (course.instructor && course.instructor.toLowerCase().includes(search.toLowerCase())) ||
            (course.description && course.description.toLowerCase().includes(search.toLowerCase()));

        if (!matchesSearch) return false;

        if (statusFilter === "published") return Boolean(course.is_published);
        if (statusFilter === "draft") return !Boolean(course.is_published);
        return true;
    });

    const publishedCount = courseData.filter((c) => Boolean(c.is_published)).length;
    const draftCount = courseData.length - publishedCount;

    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    const startIndex = (currentPage - 1) * coursesPerPage;
    const paginatedCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // ====================== course details ============================
    const [courseDetailsModl, setCourseDetailsModal] = useState<boolean>(false);
    const [courseId, setCourseId] = useState<number | undefined>(undefined);
    const [viewingCourse, setViewingCourse] = useState<CourseType | null>(null);

    const handleCourseDetails = (course: CourseType) => {
        setViewingCourse(course);
        setCourseId(course.id);
        setCourseDetailsModal(true);
    };

    const resolveImageUrl = (img?: string | null) => {
        if (!img) return "";
        if (img.startsWith("http://") || img.startsWith("https://")) return img;
        const clean = img.startsWith("/") ? img : `/${img}`;
        const storagePath = clean.startsWith("/storage/") ? clean : `/storage${clean}`;
        return `${import.meta.env.VITE_BASE_URL}${storagePath}`;
    };

    const { data: courseDetails } = useGetLessonByCourseIdQuery(courseId);

    const courseTitle: CourseLessonType = courseDetails?.data;
    const lessonData: Lesson[] = courseDetails?.data?.lessons || [];

    const groupedLessons = lessonData.reduce<Record<string, Lesson[]>>((acc, item) => {
        const sec = item.section_name?.trim() || "General Lessons";
        if (!acc[sec]) acc[sec] = [];
        acc[sec].push(item);
        return acc;
    }, {});
    const sectionNames = Object.keys(groupedLessons);

    const [videoModal, setVideoModal] = useState<boolean>(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [imageModal, setImageModal] = useState<boolean>(false);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

    const handleLessonPreview = (item: Lesson) => {
        setSelectedLesson(item);
        if (item.video_url) {
            setVideoUrl(item.video_url);
            setVideoModal(true);
        } else {
            setImageModal(true);
        }
    };

    // =========================================== Course Publish Unpublish ========================================
    const [publishUnPublishCourse] = usePublishUnPublishCourseMutation();

    const handlePublishCourse = async (courseId: number, publishNumber: number) => {
        try {
            const res = await publishUnPublishCourse({ courseId, publishNumber }).unwrap();
            if (res) {
                toast.success(res?.message);
                refetch();
            }
        } catch (error) {
            return errorMessage(error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-24">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="bg-white shadow-sm border border-gray-100 py-8 px-6 sm:px-8 rounded-2xl space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
                <div>
                    <h1 className="font-bold text-2xl sm:text-3xl text-gray-900 tracking-tight">Courses Management</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Create, manage and publish your online courses and modules.
                    </p>
                </div>
                <Link to="/dashboard/course-create">
                    <button className="flex items-center gap-2 px-6 py-2.5 rounded-full text-black font-semibold text-sm sm:text-base bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] hover:brightness-105 active:scale-[0.99] transition duration-200 shadow-sm">
                        <Plus size={18} strokeWidth={2.5} /> Create Course
                    </button>
                </Link>
            </div>

            {/* Filter Tabs & Search Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title, instructor, or description..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none text-sm transition"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>

                {/* Status Filter Tabs */}
                <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold self-start md:self-auto">
                    <button
                        onClick={() => {
                            setStatusFilter("all");
                            setCurrentPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-lg transition ${
                            statusFilter === "all"
                                ? "bg-white text-gray-900 shadow-sm font-bold"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        All ({courseData.length})
                    </button>
                    <button
                        onClick={() => {
                            setStatusFilter("published");
                            setCurrentPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                            statusFilter === "published"
                                ? "bg-white text-emerald-800 shadow-sm font-bold"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Published ({publishedCount})
                    </button>
                    <button
                        onClick={() => {
                            setStatusFilter("draft");
                            setCurrentPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                            statusFilter === "draft"
                                ? "bg-white text-amber-800 shadow-sm font-bold"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Drafts ({draftCount})
                    </button>
                </div>
            </div>

            {/* Courses Table */}
            <div className="border border-gray-200/80 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/80">
                            <TableRow className="text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-gray-200">
                                <TableHead className="py-3.5 pl-5">Course</TableHead>
                                <TableHead className="py-3.5">Price & Info</TableHead>
                                <TableHead className="py-3.5 text-center">Lessons</TableHead>
                                <TableHead className="py-3.5 text-center">Status</TableHead>
                                <TableHead className="py-3.5 pr-5 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100">
                            {paginatedCourses.length > 0 ? (
                                paginatedCourses.map((course) => (
                                    <TableRow
                                        key={course.id}
                                        className="hover:bg-amber-50/20 transition-colors group"
                                    >
                                        {/* Thumbnail & Title */}
                                        <TableCell className="py-4 pl-5">
                                            <div className="flex items-center gap-3 min-w-[220px] max-w-[280px]">
                                                <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm flex items-center justify-center">
                                                    {course.thumbnail ? (
                                                        <img
                                                            src={course.thumbnail}
                                                            alt={course.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLElement).style.display = "none";
                                                            }}
                                                        />
                                                    ) : (
                                                        <BookOpen className="text-amber-500 w-5 h-5" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3
                                                        className="font-semibold text-sm text-gray-900 truncate group-hover:text-amber-900 transition"
                                                        title={course.title}
                                                    >
                                                        {course.title}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 truncate mt-0.5">
                                                        By {course.instructor || "Instructor"}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Price & Duration */}
                                        <TableCell className="py-4">
                                            <div className="space-y-1">
                                                <div className="font-bold text-sm text-gray-900">
                                                    £{course.price}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    {course.actual_duration ? (
                                                        <span className="flex items-center gap-1 font-medium text-slate-700" title="Calculated from lessons duration">
                                                            <Clock size={11} className="text-amber-600" />
                                                            {course.actual_duration}
                                                        </span>
                                                    ) : Number(course.total_lessons) > 0 ? (
                                                        <span className="flex items-center gap-1 text-slate-400" title="Self-paced">
                                                            <Clock size={11} className="text-slate-400" />
                                                            Self-paced
                                                        </span>
                                                    ) : null}
                                                    {Boolean(course.reward_points) && (
                                                        <span className="inline-flex items-center gap-0.5 text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-medium border border-amber-200/60">
                                                            <Award size={10} /> {course.reward_points} pts
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Total Lessons Count */}
                                        <TableCell className="py-4 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm">
                                                <BookOpen size={13} className="text-amber-600" />
                                                <span>
                                                    {course.total_lessons ?? 0} {Number(course.total_lessons) === 1 ? "Lesson" : "Lessons"}
                                                </span>
                                            </span>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell className="py-4 text-center">
                                            {course.is_published ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                                    Draft
                                                </span>
                                            )}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="py-4 pr-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Manage Lessons Button */}
                                                <Link to={`/dashboard/add-leason/${course.id}`}>
                                                    <button
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition"
                                                        title="Manage lessons & curriculum"
                                                    >
                                                        <BookOpen size={13} />
                                                        <span>Manage Lessons</span>
                                                    </button>
                                                </Link>

                                                {/* Publish / Unpublish Toggle Button */}
                                                {course.is_published ? (
                                                    <button
                                                        onClick={() => handlePublishCourse(course.id, 0)}
                                                        className="w-20 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition text-center"
                                                        title="Unpublish course"
                                                    >
                                                        Unpublish
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handlePublishCourse(course.id, 1)}
                                                        className="w-20 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition text-center"
                                                        title="Publish course"
                                                    >
                                                        Publish
                                                    </button>
                                                )}

                                                {/* Icon Actions: View, Edit, Delete */}
                                                <div className="flex items-center gap-1 pl-1 border-l border-gray-200">
                                                    <button
                                                        onClick={() => handleCourseDetails(course)}
                                                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-amber-800 hover:bg-amber-50 hover:border-amber-300 transition"
                                                        title="View Curriculum & Lessons"
                                                    >
                                                        <Eye size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCourse(course);
                                                            setOpenUpdateModal(true);
                                                        }}
                                                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition"
                                                        title="Edit Course Details"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(course.id)}
                                                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-300 transition"
                                                        title="Delete Course"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12">
                                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-gray-500">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                                                <Search size={22} />
                                            </div>
                                            <p className="font-semibold text-gray-800 text-sm">No courses found</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {search
                                                    ? `No courses matching "${search}". Try clearing search or changing filters.`
                                                    : "No courses are currently available in this category."}
                                            </p>
                                            {search && (
                                                <button
                                                    onClick={() => setSearch("")}
                                                    className="mt-3 text-xs font-semibold text-amber-700 hover:underline"
                                                >
                                                    Clear search
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination & Count Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <p className="text-xs text-gray-500 font-medium">
                    Showing{" "}
                    <span className="font-semibold text-gray-800">
                        {filteredCourses.length > 0 ? startIndex + 1 : 0}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-gray-800">
                        {Math.min(startIndex + coursesPerPage, filteredCourses.length)}
                    </span>{" "}
                    of <span className="font-semibold text-gray-800">{filteredCourses.length}</span> courses
                </p>

                {totalPages > 1 && (
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                            disabled={currentPage === 1}
                            onClick={handlePrev}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {pageNumbers.map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold transition border ${
                                    currentPage === page
                                        ? "bg-amber-400 text-black border-amber-400 shadow-sm"
                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={handleNext}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Update Course Modal */}
            <Dialog open={openUpdateModal} onOpenChange={setOpenUpdateModal}>
                {selectedCourse && (
                    <CourseUpdate
                        selectedCourse={selectedCourse}
                        setOpenUpdateModal={setOpenUpdateModal}
                    />
                )}
            </Dialog>

            {/* course details modal  */}
            <Dialog open={courseDetailsModl} onOpenChange={setCourseDetailsModal}>
                <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh] bg-white p-6">
                    <div className="border-b pb-4 mb-4">
                        <DialogTitle className="text-2xl font-bold text-gray-800">
                            {viewingCourse?.title || courseTitle?.title} — Curriculum & Details
                        </DialogTitle>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="space-y-1.5 text-sm text-gray-700">
                                <p><span className="font-semibold text-gray-900">Instructor:</span> {viewingCourse?.instructor || courseTitle?.instructor || "N/A"}</p>
                                <p><span className="font-semibold text-gray-900">Price:</span> £{viewingCourse?.price ?? courseTitle?.price ?? "0.00"}</p>
                                <p><span className="font-semibold text-gray-900">Reward Points:</span> {viewingCourse?.reward_points ?? courseTitle?.reward_points ?? 0} pts</p>
                                <p><span className="font-semibold text-gray-900">Duration:</span> {viewingCourse?.actual_duration || courseTitle?.actual_duration || (lessonData.length > 0 ? "Self-paced" : "N/A")}</p>
                                <p><span className="font-semibold text-gray-900">Total Lessons:</span> {lessonData.length || viewingCourse?.total_lessons || courseTitle?.total_lessons || 0}</p>
                            </div>
                            {(viewingCourse?.thumbnail || courseTitle?.thumbnail) && (
                                <img
                                    src={resolveImageUrl(viewingCourse?.thumbnail || courseTitle?.thumbnail)}
                                    alt={viewingCourse?.title || courseTitle?.title}
                                    className="w-48 h-32 object-cover rounded-lg border shadow-sm"
                                />
                            )}
                        </div>
                    </div>

                    {/* Course Curriculum grouped by Modules */}
                    <div className="space-y-5 my-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg text-gray-800">Course Curriculum</h3>
                            <span className="text-xs text-gray-500 font-medium">
                                {sectionNames.length} Modules • {lessonData.length} Lessons
                            </span>
                        </div>

                        {lessonData.length === 0 ? (
                            <p className="text-gray-500 text-sm py-6 text-center border border-dashed rounded-xl">
                                No lessons added to this course yet.
                            </p>
                        ) : (
                            sectionNames.map((secName, sIdx) => {
                                const lessons = groupedLessons[secName];
                                return (
                                    <div key={secName} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                        <div className="bg-amber-50/70 px-4 py-2.5 border-b border-amber-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-md bg-amber-500 text-white font-bold flex items-center justify-center text-xs">
                                                    {sIdx + 1}
                                                </span>
                                                <h4 className="font-bold text-gray-800 text-sm">
                                                    {secName}
                                                </h4>
                                            </div>
                                            <span className="text-xs text-gray-500 font-medium">
                                                {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
                                            </span>
                                        </div>

                                        <div className="p-3 space-y-2">
                                            {lessons.map((item, lIdx) => {
                                                const isImage = !item.video_url;
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-amber-300 hover:bg-amber-50/10 transition gap-3"
                                                    >
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleLessonPreview(item)}
                                                                className={`w-9 h-9 rounded-full flex items-center justify-center transition flex-shrink-0 ${
                                                                    isImage
                                                                        ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                                                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                                                }`}
                                                                title={isImage ? "View Image / Article" : "Play Video"}
                                                            >
                                                                {isImage ? <ImageIcon size={16} /> : <Play size={14} className="ml-0.5" />}
                                                            </button>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="font-semibold text-sm text-gray-800 truncate">
                                                                        {sIdx + 1}.{lIdx + 1} {item.title}
                                                                    </span>
                                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                                                        isImage ? "bg-purple-50 text-purple-700 border border-purple-200" : "bg-blue-50 text-blue-700 border border-blue-200"
                                                                    }`}>
                                                                        {isImage ? "Article" : "Video"}
                                                                    </span>
                                                                    {Boolean(item.video_url && item.image_url) && (
                                                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                                                                            <ImageIcon size={10} /> + Graphic
                                                                        </span>
                                                                    )}
                                                                    {Boolean(item.is_free_preview) && (
                                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                                                                            Free Preview
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {item.description && (
                                                                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                                                        {item.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleLessonPreview(item)}
                                                            className="text-xs font-semibold text-amber-800 hover:bg-amber-100/60"
                                                        >
                                                            {isImage ? "View" : "Watch"}
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <DialogFooter className="border-t pt-4 mt-4">
                        <DialogClose asChild>
                            <Button type="button" className="bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] text-black font-semibold px-8 rounded-full">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* video play modal  */}
            {videoModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md px-4">
                    <div className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl relative">
                        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                            <div>
                                <h4 className="font-bold text-gray-800 text-lg">
                                    {selectedLesson?.title || "Video Lesson"}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    Module: {selectedLesson?.section_name || "General"}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setVideoModal(false);
                                    setVideoUrl(null);
                                }}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 transition"
                            >
                                ✕
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
                                    src={`${videoUrl}`}
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

                        {(selectedLesson?.image_url || selectedLesson?.description) && (
                            <div className="p-4 bg-white border-t space-y-3 max-h-72 overflow-y-auto">
                                {selectedLesson.image_url && (
                                    <div>
                                        <h5 className="font-semibold text-xs text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                                            <ImageIcon size={13} className="text-amber-600" /> Attached Reference Image / Graphic
                                        </h5>
                                        <div className="rounded-xl overflow-hidden border bg-gray-50 flex justify-center max-w-sm">
                                            <img
                                                src={resolveImageUrl(selectedLesson.image_url)}
                                                alt={selectedLesson.title}
                                                className="max-h-56 w-auto object-contain"
                                            />
                                        </div>
                                    </div>
                                )}
                                {selectedLesson.description && (
                                    <div>
                                        <h5 className="font-semibold text-xs text-gray-500 uppercase mb-1">Notes & Instructions</h5>
                                        <p className="text-sm text-gray-700 whitespace-pre-line">
                                            {selectedLesson.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* image / article preview modal */}
            {imageModal && selectedLesson && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md px-4">
                    <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl relative flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                                        Article Lesson
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium">
                                        Module: {selectedLesson.section_name || "General"}
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg mt-1">
                                    {selectedLesson.title}
                                </h4>
                            </div>
                            <button
                                onClick={() => setImageModal(false)}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                            {selectedLesson.image_url && (
                                <div className="rounded-xl overflow-hidden border bg-gray-50 flex justify-center">
                                    <img
                                        src={resolveImageUrl(selectedLesson.image_url)}
                                        alt={selectedLesson.title}
                                        className="max-h-80 w-auto object-contain"
                                    />
                                </div>
                            )}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <h5 className="font-semibold text-xs text-gray-500 uppercase mb-1">Content</h5>
                                <p className="text-sm text-gray-700 whitespace-pre-line">
                                    {selectedLesson.description || "No text content provided."}
                                </p>
                            </div>
                        </div>
                        <div className="p-3 border-t bg-gray-50 flex justify-end">
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

        </div>
    );
};

export default CourseTable;

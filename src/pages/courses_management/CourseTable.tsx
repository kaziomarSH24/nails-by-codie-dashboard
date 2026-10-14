import { useState } from "react";
import {
    Plus,
    Search,
    ChevronLeft,
    ChevronRight,
    Play,
    Image as ImageIcon,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from "../../components/ui/dialog";
import { Link } from "react-router-dom";
import { useAllCourseQuery, useDeleteCourseMutation, usePublishUnPublishCourseMutation } from "../../api/course-api/courseApi";
import type { CourseType } from "../../lib/type/courseType";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
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


    // ------------------------- ?DELETE COURSE ----------------------

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
    }



    // -------------------ALL COURSE ---------------------

    const [search, setSearch] = useState("");
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    type Course = {
        id: number;
        thumbnail: string;
        title: string;
        description: string;
        is_published: boolean;
        price: string;
        reward_points: string
    };

    const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 10;





    const courseData: CourseType[] = data?.data || [];

    // Filtered & Paginated data
    const filteredCourses = courseData.filter(course =>
        course.title.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    const startIndex = (currentPage - 1) * coursesPerPage;
    const paginatedCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
    const handlePrev = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

    // ====================== course details ============================

    const [courseDetailsModl, setCourseDetailsModal] = useState<boolean>(false);
    const [courseId, setCourseId] = useState<number | undefined>(undefined);

    const handleCourseDetails = async (id: number) => {
        setCourseDetailsModal(true)
        setCourseId(id);
    }

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
        if (item.lesson_type === "image" || (!item.video_url && item.image_url)) {
            setImageModal(true);
        } else if (item.video_url) {
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
            }

        } catch (error) {
            return errorMessage(error)
        }
    }




    if (isLoading) {
        return (
            <div className=" flex justify-center " >
                <Spinner />
            </div>
        )
    }





    return (
        <div className="bg-[#FFFFFF] shadow shadow-[#00000033] py-9 px-7 rounded-[14.13px] overflow-x-auto ">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="font-medium text-3xl">All Courses</h1>
                <Link to={`/dashboard/course-create`}>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-full text-black font-medium text-lg bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] hover:opacity-90 transition duration-200 shadow-sm">
                        <Plus size={22} strokeWidth={2.5} /> Create Course
                    </button>
                </Link>
            </div>

            {/* Search */}
            <div className="mt-6 mb-6 w-[80%] relative">
                <Search className="absolute left-3 top-[17px] h-4 w-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search Course by name"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1); // reset to first page on search
                    }}
                    className="w-full pl-10 pr-3 py-3.5 border border-[#B9B9B9] rounded-[5.95px] focus:ring-0 focus:outline-none text-sm"
                />
            </div>

            {/* Table */}
            <Card className=" overflow-x-auto " >
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="text-sm text-[#686868]">
                                <TableHead>Thumbnail</TableHead>
                                <TableHead>Course Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedCourses.length > 0 ? paginatedCourses.map(course => (
                                <TableRow key={course.id}>
                                    <TableCell>
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-16 h-10 object-cover rounded-md"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium  ">{course.title.slice(0, 30)}....</TableCell>
                                    <TableCell className="text-[#989898]">{course.description.slice(0, 30)}....</TableCell>
                                    <TableCell>
                                        <Badge className={course.is_published == true ? "bg-[#EAF6EC] text-[#238B39] px-4 py-1 rounded-[26px] text-sm" : "bg-[#F6F5EA] text-[#8B7B23] px-4 py-1 rounded-[26px] text-sm"}>
                                            {
                                                course.is_published == true ? "Publish" : "Unpublish"
                                            }
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link to={`/dashboard/add-leason/${course.id}`}>
                                            <Button
                                                className="rounded-[33px] px-3 py-1.5 bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] hover:opacity-90 transition duration-200 shadow-sm text-black"


                                            >
                                                Add Lesson
                                            </Button>
                                        </Link>
                                        {
                                            course?.is_published == true ? <> <Button
                                                onClick={() => handlePublishCourse(course?.id, 0)}
                                                className="rounded-[33px] px-3 py-1.5 bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] hover:opacity-90 transition duration-200 shadow-sm text-black">
                                                Unpublish
                                            </Button> </> : <> <Button
                                                onClick={() => handlePublishCourse(course?.id, 1)}
                                                className="rounded-[33px] px-3 py-1.5 bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] hover:opacity-90 transition duration-200 shadow-sm text-black"


                                            >

                                                Publish


                                            </Button>  </>
                                        }
                                        <Button
                                            className="border border-[#989898] px-2 py-1 bg-white"
                                            onClick={() => { setSelectedCourse(course); setOpenUpdateModal(true); }}
                                        >
                                            <FaEdit color="#B9B9B9" />
                                        </Button>
                                        <Button onClick={() => { handleDelete(course.id) }} className="border border-[#989898] px-2 py-1 bg-white">
                                            {
                                                <FaTrashAlt color="#B9B9B9" />
                                            }
                                        </Button>
                                        <Button onClick={() => { handleCourseDetails(course.id) }} className="border border-[#989898] px-2 py-1 bg-white">
                                            <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11 4.5C10.2044 4.5 9.44129 4.81607 8.87868 5.37868C8.31607 5.94129 8 6.70435 8 7.5C8 8.29565 8.31607 9.05871 8.87868 9.62132C9.44129 10.1839 10.2044 10.5 11 10.5C11.7956 10.5 12.5587 10.1839 13.1213 9.62132C13.6839 9.05871 14 8.29565 14 7.5C14 6.70435 13.6839 5.94129 13.1213 5.37868C12.5587 4.81607 11.7956 4.5 11 4.5ZM11 12.5C9.67392 12.5 8.40215 11.9732 7.46447 11.0355C6.52678 10.0979 6 8.82608 6 7.5C6 6.17392 6.52678 4.90215 7.46447 3.96447C8.40215 3.02678 9.67392 2.5 11 2.5C12.3261 2.5 13.5979 3.02678 14.5355 3.96447C15.4732 4.90215 16 6.17392 16 7.5C16 8.82608 15.4732 10.0979 14.5355 11.0355C13.5979 11.9732 12.3261 12.5 11 12.5ZM11 0C6 0 1.73 3.11 0 7.5C1.73 11.89 6 15 11 15C16 15 20.27 11.89 22 7.5C20.27 3.11 16 0 11 0Z" fill="#B9B9B9" />
                                            </svg>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-gray-500 py-6">
                                        No courses found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-end items-center mt-4 gap-2">
                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={handlePrev}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {pageNumbers.map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded-md text-sm font-medium border ${currentPage === page
                                ? "bg-[#FFD700] text-black border-[#FFD700]"
                                : "bg-white text-gray-600 border-[#B9B9B9] hover:bg-gray-100"
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                    <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={handleNext}>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}

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
                            {courseTitle?.title} — Curriculum & Details
                        </DialogTitle>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <div className="space-y-1.5 text-sm text-gray-700">
                                <p><span className="font-semibold text-gray-900">Instructor:</span> {courseTitle?.instructor}</p>
                                <p><span className="font-semibold text-gray-900">Price:</span> £{courseTitle?.price}</p>
                                <p><span className="font-semibold text-gray-900">Reward Points:</span> {courseTitle?.reward_points} pts</p>
                                <p><span className="font-semibold text-gray-900">Duration:</span> {courseTitle?.duration || "N/A"}</p>
                                <p><span className="font-semibold text-gray-900">Total Lessons:</span> {courseTitle?.total_lessons}</p>
                            </div>
                            {courseTitle?.thumbnail && (
                                <img
                                    src={courseTitle?.thumbnail}
                                    alt={courseTitle?.title}
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
                                                const isImage = item.lesson_type === "image" || Boolean(item.image_url && !item.video_url);
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
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
                                onClick={() => setVideoModal(false)}
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

                        {selectedLesson?.description && (
                            <div className="p-4 bg-white border-t">
                                <h5 className="font-semibold text-xs text-gray-500 uppercase mb-1">Notes</h5>
                                <p className="text-sm text-gray-700 whitespace-pre-line">
                                    {selectedLesson.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* image / article preview modal */}
            {imageModal && selectedLesson && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
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
                                        src={selectedLesson.image_url}
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

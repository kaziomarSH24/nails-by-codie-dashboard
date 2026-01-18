"use client";
import { useState } from "react";
import {
    Plus,
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Link } from "react-router-dom";
import { useAllCourseQuery, useDeleteCourseMutation } from "../../api/course-api/courseApi";
import type { CourseType } from "../../lib/type/courseType";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { errorMessage } from "../../lib/error/errorMsg";
import { deleteAlert } from "../../lib/alert/deleteAlert";
import { toast } from "sonner";
import { Spinner } from "../../components/ui/spinner";

const CourseTable = () => {

    const { data, isLoading, refetch } = useAllCourseQuery({});


    // ------------------------- ?DELETE COURSE ----------------------

    const [deleteCourse, { isLoading: deleteLoading }] = useDeleteCourseMutation();

    const handleDelete = async (id: number) => {
        try {
            const res = await deleteAlert();
            if (res.isConfirmed) {
                const res = await deleteCourse(id).unwrap();
                if (res) {
                    refetch();
                    console.log(res)
                    toast.success(res?.message);
                }
            }
        } catch (error) {
            console.log(error)
            return errorMessage(error);
        }
    }



    // -------------------ALL COURSE ---------------------

    const [search, setSearch] = useState("");
    const [openLessonModal, setOpenLessonModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    type Course = {
        id: number;
        thumbnail: string;
        title: string;
        description: string;
        status: string;
    };

    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 10;





    console.log("course data is ", data?.data);

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


    if (isLoading) {
        return (
            <div className=" flex justify-center " >
                <Spinner />
            </div>
        )
    }





    return (
        <div className="bg-[#FFFFFF] shadow shadow-[#00000033] py-9 px-7 rounded-[14.13px]">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="font-medium text-3xl">All Courses</h1>
                <Link to={`/dashboard/course-create`}>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-full text-black font-medium text-lg bg-gradient-to-b from-[#FFD700] to-[#E6BE00] hover:opacity-90 transition duration-200 shadow-sm">
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
            <Card>
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
                                    <TableCell className="font-medium">{course.title.slice(0, 30)}....</TableCell>
                                    <TableCell className="text-[#989898]">{course.description.slice(0, 30)}....</TableCell>
                                    <TableCell>
                                        <Badge className={course.is_published === 1 ? "bg-[#EAF6EC] text-[#238B39] px-4 py-1 rounded-[26px] text-sm" : "bg-[#F6F5EA] text-[#8B7B23] px-4 py-1 rounded-[26px] text-sm"}>
                                            {
                                                course.is_published === 1 ? "Publish" : "Unpublish"
                                            }
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link to={`/dashboard/add-leason/${course.id}`}>
                                            <Button
                                                className="rounded-[33px] px-3 py-1.5 bg-gradient-to-b from-[#FFD700] to-[#E6BE00] hover:opacity-90 transition duration-200 shadow-sm text-black"


                                            >
                                                Add Lesson
                                            </Button>
                                        </Link>
                                        <Button
                                            className="border border-[#989898] px-2 py-1 bg-white"
                                        // onClick={() => { setSelectedCourse(course); setOpenUpdateModal(true); }}
                                        >
                                            <FaEdit color="#B9B9B9" />
                                        </Button>
                                        <Button onClick={() => { handleDelete(course.id) }} className="border border-[#989898] px-2 py-1 bg-white">
                                            {
                                                deleteLoading ? <>
                                                    <div className=" flex justify-center " >
                                                        <Spinner />
                                                    </div>
                                                </> : <FaTrashAlt color="#B9B9B9" />
                                            }
                                        </Button>
                                        <Button className="border border-[#989898] px-2 py-1 bg-white">
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Update Course {selectedCourse ? `(${selectedCourse.title})` : ""}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 mt-3">
                        <Input defaultValue={selectedCourse?.title || ""} placeholder="Course Title" />
                        <Input defaultValue={selectedCourse?.description || ""} placeholder="Description" />
                        <Input type="file" />
                    </div>
                    <DialogFooter>
                        <Button className="bg-yellow-600 hover:bg-yellow-700" onClick={() => setOpenUpdateModal(false)}>
                            Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CourseTable;

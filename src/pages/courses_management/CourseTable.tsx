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

const CourseTable = () => {
    const [search, setSearch] = useState("");
    // const [openCourseModal, setOpenCourseModal] = useState(false);
    const [openLessonModal, setOpenLessonModal] = useState(false);
    console.log(openLessonModal)
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
    const coursesPerPage = 5;

    // Dummy course data
    const courses = [
        {
            id: 1,
            thumbnail: "https://via.placeholder.com/80x50.png?text=React",
            title: "React for Beginners",
            description: "Learn React.js with step-by-step examples.",
            status: "Published",
        },
        {
            id: 2,
            thumbnail: "https://via.placeholder.com/80x50.png?text=JS",
            title: "Advanced JavaScript",
            description: "Deep dive into JS concepts and ES6+ features.",
            status: "Draft",
        },
        {
            id: 3,
            thumbnail: "https://via.placeholder.com/80x50.png?text=Next",
            title: "Next.js Mastery",
            description: "Build full-stack apps using Next.js and modern tools.",
            status: "Published",
        },
        {
            id: 4,
            thumbnail: "https://via.placeholder.com/80x50.png?text=Node",
            title: "Node.js API Development",
            description: "Learn backend APIs using Node.js and Express.",
            status: "Draft",
        },
        {
            id: 5,
            thumbnail: "https://via.placeholder.com/80x50.png?text=MongoDB",
            title: "MongoDB for Beginners",
            description: "Master MongoDB database with real-world examples.",
            status: "Published",
        },
        {
            id: 6,
            thumbnail: "https://via.placeholder.com/80x50.png?text=Tailwind",
            title: "Tailwind CSS Basics",
            description: "Build modern UIs using Tailwind CSS.",
            status: "Draft",
        },
    ];

    // Filtered and paginated data
    const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    const startIndex = (currentPage - 1) * coursesPerPage;
    const paginatedCourses = filteredCourses.slice(
        startIndex,
        startIndex + coursesPerPage
    );

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className=" bg-[#FFFFFF] shadow shadow-[#00000033] py-9 px-7 rounded-[14.13px] ">
            {/* header  */}
            <div className=" flex justify-between items-center " >
                <h1 className=" font-medium text-3xl " >All Courses</h1>
                <Link to={`/dashboard/course-create`}>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-full text-black font-medium text-lg bg-gradient-to-b from-[#FFD700] to-[#E6BE00] hover:opacity-90 transition duration-200 shadow-sm">
                        <Plus size={22} strokeWidth={2.5} />
                        Create Course
                    </button>
                </Link>
            </div>
            {/* Header */}
            <div className=" mt-6 mb-6">
                <div className="relative w-[80%] ">
                    <Search className="absolute left-3 top-[17px] h-4 w-4  text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search Course by name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-3.5 border border-[#B9B9B9] rounded-[5.95px] focus:ring-0 focus:outline-none text-sm"
                    />
                </div>

            </div>

            {/* Table */}
            <Card className="">
                <CardContent className=" ">
                    <Table>
                        <TableHeader className=" " >
                            <TableRow className=" text-sm text-[#686868] " >
                                <TableHead>Thumbnail</TableHead>
                                <TableHead>Course Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className=" text-center ">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedCourses.length > 0 ? (
                                paginatedCourses.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell>
                                            <img
                                                src={"/images/product/product-2.svg"}
                                                alt={course.title}
                                                className="w-16 h-10 object-cover rounded-md"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {course.title}
                                        </TableCell>
                                        <TableCell className=" text-[#989898] " >{course.description}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    course.status === "Published"
                                                        ? "bg-[#EAF6EC] text-[#238B39]  px-4 py-1 rounded-[26px] text-sm "
                                                        : " bg-[#F6F5EA] text-[#8B7B23]  px-4 py-1 rounded-[26px] text-sm "
                                                }
                                            >
                                                {course.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">

                                            <Link to={`/dashboard/add-leason`}>
                                                <Button

                                                    className=" rounded-[33px] px-3 py-1.5  bg-gradient-to-b from-[#FFD700] to-[#E6BE00] hover:opacity-90 transition duration-200 shadow-sm text-black "
                                                    onClick={() => {
                                                        setSelectedCourse(course);
                                                        setOpenLessonModal(true);
                                                    }}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g clip-path="url(#clip0_0_724)">
                                                            <path d="M8 0C10.1217 0 12.1566 0.842855 13.6569 2.34315C15.1571 3.84344 16 5.87827 16 8C16 10.1217 15.1571 12.1566 13.6569 13.6569C12.1566 15.1571 10.1217 16 8 16C5.87827 16 3.84344 15.1571 2.34315 13.6569C0.842855 12.1566 0 10.1217 0 8C0 5.87827 0.842855 3.84344 2.34315 2.34315C3.84344 0.842855 5.87827 0 8 0ZM9.062 4.312C9.062 4.04678 8.95664 3.79243 8.76911 3.60489C8.58157 3.41736 8.32722 3.312 8.062 3.312C7.79678 3.312 7.54243 3.41736 7.35489 3.60489C7.16736 3.79243 7.062 4.04678 7.062 4.312V7.062H4.312C4.04678 7.062 3.79243 7.16736 3.60489 7.35489C3.41736 7.54243 3.312 7.79678 3.312 8.062C3.312 8.32722 3.41736 8.58157 3.60489 8.76911C3.79243 8.95664 4.04678 9.062 4.312 9.062H7.062V11.812C7.062 12.0772 7.16736 12.3316 7.35489 12.5191C7.54243 12.7066 7.79678 12.812 8.062 12.812C8.32722 12.812 8.58157 12.7066 8.76911 12.5191C8.95664 12.3316 9.062 12.0772 9.062 11.812V9.062H11.812C12.0772 9.062 12.3316 8.95664 12.5191 8.76911C12.7066 8.58157 12.812 8.32722 12.812 8.062C12.812 7.79678 12.7066 7.54243 12.5191 7.35489C12.3316 7.16736 12.0772 7.062 11.812 7.062H9.062V4.312Z" fill="black" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_0_724">
                                                                <rect width="16" height="16" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                    Add Lesson
                                                </Button>
                                            </Link>



                                            <Button

                                                className=" border border-[#989898] px-2 py-1 bg-white  "
                                                onClick={() => {
                                                    setSelectedCourse(course);
                                                    setOpenUpdateModal(true);
                                                }}
                                            >
                                                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M13.669 0.211155C13.836 0.226155 13.909 0.430155 13.789 0.549155L5.46902 8.86916C5.37503 8.9632 5.30773 9.08054 5.27401 9.20916L4.27401 13.0392C4.241 13.1657 4.24167 13.2987 4.27594 13.425C4.31022 13.5512 4.37691 13.6663 4.46941 13.7588C4.5619 13.8513 4.67697 13.918 4.80321 13.9522C4.92944 13.9865 5.06244 13.9872 5.18901 13.9542L9.01801 12.9542C9.14674 12.9202 9.26409 12.8525 9.35802 12.7582L17.796 4.32016C17.8224 4.29305 17.856 4.27408 17.8929 4.26549C17.9297 4.25689 17.9683 4.25904 18.0039 4.27166C18.0396 4.28429 18.0709 4.30687 18.0941 4.33673C18.1174 4.36659 18.1315 4.40248 18.135 4.44016C18.4863 7.78977 18.4661 11.168 18.075 14.5132C17.852 16.4182 16.321 17.9132 14.423 18.1262C10.9467 18.5113 7.43838 18.5113 3.96201 18.1262C2.06301 17.9132 0.532013 16.4182 0.309013 14.5132C-0.103004 10.9882 -0.103004 7.42716 0.309013 3.90216C0.532013 1.99616 2.06301 0.501155 3.96201 0.289155C7.18653 -0.0682721 10.4392 -0.0944087 13.669 0.211155Z" fill="#B9B9B9" />
                                                </svg>

                                            </Button>



                                            <Button

                                                className="border border-[#989898] px-2 py-1 bg-white "
                                            >
                                                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3 18C2.45 18 1.97934 17.8043 1.588 17.413C1.19667 17.0217 1.00067 16.5507 1 16V3C0.71667 3 0.479337 2.904 0.288004 2.712C0.0966702 2.52 0.000670115 2.28267 3.44827e-06 2C-0.000663218 1.71733 0.0953369 1.48 0.288004 1.288C0.48067 1.096 0.718003 1 1 1H5C5 0.716667 5.096 0.479333 5.288 0.288C5.48 0.0966668 5.71734 0.000666667 6 0H10C10.2833 0 10.521 0.0960001 10.713 0.288C10.905 0.48 11.0007 0.717333 11 1H15C15.2833 1 15.521 1.096 15.713 1.288C15.905 1.48 16.0007 1.71733 16 2C15.9993 2.28267 15.9033 2.52033 15.712 2.713C15.5207 2.90567 15.2833 3.00133 15 3V16C15 16.55 14.8043 17.021 14.413 17.413C14.0217 17.805 13.5507 18.0007 13 18H3ZM6 14C6.28334 14 6.521 13.904 6.713 13.712C6.905 13.52 7.00067 13.2827 7 13V6C7 5.71667 6.904 5.47933 6.712 5.288C6.52 5.09667 6.28267 5.00067 6 5C5.71734 4.99933 5.48 5.09533 5.288 5.288C5.096 5.48067 5 5.718 5 6V13C5 13.2833 5.096 13.521 5.288 13.713C5.48 13.905 5.71734 14.0007 6 14ZM10 14C10.2833 14 10.521 13.904 10.713 13.712C10.905 13.52 11.0007 13.2827 11 13V6C11 5.71667 10.904 5.47933 10.712 5.288C10.52 5.09667 10.2827 5.00067 10 5C9.71734 4.99933 9.48 5.09533 9.288 5.288C9.096 5.48067 9 5.718 9 6V13C9 13.2833 9.096 13.521 9.288 13.713C9.48 13.905 9.71734 14.0007 10 14Z" fill="#B9B9B9" />
                                                </svg>

                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center text-gray-500 py-6"
                                    >
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
                <div className="flex justify-end items-center mt-4 space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={handlePrev}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                    </Button>
                    <span className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={handleNext}
                    >
                        Next <ChevronRight className="w-4 h-4 ml-1" />
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
                        <Input
                            defaultValue={selectedCourse?.title || ""}
                            placeholder="Course Title"
                        />
                        <Input
                            defaultValue={selectedCourse?.description || ""}
                            placeholder="Description"
                        />
                        <Input type="file" />
                    </div>
                    <DialogFooter>
                        <Button
                            className="bg-yellow-600 hover:bg-yellow-700"
                            onClick={() => setOpenUpdateModal(false)}
                        >
                            Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CourseTable;

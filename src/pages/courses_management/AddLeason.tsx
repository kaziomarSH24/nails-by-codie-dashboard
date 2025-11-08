import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import CourseLesson from "./CourseLesson";

function AddLessonForm() {
    const [lessonTitle, setLessonTitle] = useState("");
    const [lessonDescription, setLessonDescription] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoLink, setVideoLink] = useState("");
    const [videoOption, setVideoOption] = useState<"file" | "link">("file");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setVideoFile(file);
    };

    const handleSubmit = () => {
        console.log({
            lessonTitle,
            lessonDescription,
            videoOption,
            videoFile,
            videoLink,
        });
    };

    console.log(handleSubmit)

    return (
        <>
            <div className="max-w-7xl p-9 rounded-[14px] mx-auto bg-white shadow shadow-[#00000033]">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Add Lessons to Acrylic Nail Art Masterclass
                </h2>

                {/* Lesson Title */}
                <div className="mb-4">
                    <label
                        htmlFor="lessonTitle"
                        className="block text-lg font-medium text-gray-700 mb-2"
                    >
                        Lesson Title
                    </label>
                    <Input
                        id="lessonTitle"
                        type="text"
                        placeholder="Enter Lesson Title"
                        value={lessonTitle}
                        onChange={(e) => setLessonTitle(e.target.value)}
                    />
                </div>

                {/* Lesson Description */}
                <div className="mb-4">
                    <label
                        htmlFor="lessonDescription"
                        className="block text-lg font-medium text-gray-700 mb-2"
                    >
                        Lesson Description
                    </label>
                    <Textarea
                        id="lessonDescription"
                        placeholder="Enter Lesson Description"
                        value={lessonDescription}
                        onChange={(e) => setLessonDescription(e.target.value)}
                    />
                </div>

                {/* Lesson Video */}
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                        Lesson Video
                    </label>

                    {/* Option Boxes */}
                    <div className="flex gap-6 mb-4">
                        {/* Upload Video */}
                        <div
                            onClick={() => setVideoOption("file")}
                            className={`flex flex-col items-center justify-center h-[100px] w-full rounded-md border cursor-pointer transition-all duration-200 ${videoOption === "file"
                                ? "bg-yellow-100 border-2 border-yellow-400 text-yellow-700 font-semibold"
                                : "bg-gray-50 border-gray-300 text-gray-500 hover:bg-yellow-50"
                                }`}
                        >
                            <svg
                                width="33"
                                height="33"
                                viewBox="0 0 33 33"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M16.125 0C16.3934 0.000167718 16.6583 0.0606308 16.9002 0.176923C17.1421 0.293214 17.3548 0.462363 17.5225 0.671875L24.6892 9.63021C24.845 9.81272 24.9626 10.0247 25.035 10.2535C25.1073 10.4823 25.1329 10.7234 25.1104 10.9623C25.0878 11.2012 25.0174 11.4332 24.9035 11.6444C24.7895 11.8556 24.6343 12.0418 24.447 12.1918C24.2597 12.3419 24.0442 12.4528 23.8132 12.518C23.5822 12.5832 23.3405 12.6013 23.1024 12.5712C22.8643 12.5412 22.6346 12.4636 22.4271 12.3431C22.2195 12.2226 22.0383 12.0617 21.8942 11.8698L17.9167 6.89792V19.7083C17.9167 20.1835 17.7279 20.6392 17.3919 20.9752C17.0559 21.3112 16.6002 21.5 16.125 21.5C15.6498 21.5 15.1941 21.3112 14.8581 20.9752C14.5221 20.6392 14.3333 20.1835 14.3333 19.7083V6.89792L10.3558 11.8716C10.2117 12.0635 10.0305 12.2244 9.8229 12.3449C9.61535 12.4654 9.3857 12.543 9.1476 12.573C8.90949 12.6031 8.66778 12.585 8.4368 12.5198C8.20583 12.4546 7.9903 12.3437 7.80301 12.1936C7.61573 12.0436 7.4605 11.8574 7.34654 11.6462C7.23259 11.435 7.16223 11.203 7.13964 10.9641C7.11705 10.7252 7.14269 10.4841 7.21505 10.2553C7.2874 10.0265 7.40499 9.81451 7.56083 9.632L14.7275 0.673667C14.8951 0.463826 15.1077 0.294337 15.3496 0.17773C15.5915 0.0611233 15.8565 0.000382703 16.125 0Z"
                                    fill="#989898"
                                />
                            </svg>
                            <span className="text-[#989898] text-sm  mt-2">Upload Video</span>
                        </div>

                        {/* Video Link */}
                        <div
                            onClick={() => setVideoOption("link")}
                            className={`flex flex-col items-center justify-center h-[100px] w-full rounded-md border cursor-pointer transition-all duration-200 ${videoOption === "link"
                                ? "bg-yellow-100 border-2 border-yellow-400 text-yellow-700 font-semibold"
                                : "bg-gray-50 border-gray-300 text-gray-500 hover:bg-blue-50"
                                }`}
                        >
                            <svg
                                width="34"
                                height="34"
                                viewBox="0 0 34 34"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M18.4687 5.92708L22.0521 2.34375C23.8437 0.552083 27.4271 0.552083 29.2187 2.34375L31.0104 4.13542C32.8021 5.92708 32.8021 9.51042 31.0104 11.3021L22.0521 20.2604C20.2604 22.0521 16.6771 22.0521 14.8854 20.2604M14.8854 27.4271L11.3021 31.0104C9.51042 32.8021 5.92708 32.8021 4.13542 31.0104L2.34375 29.2187C0.552083 27.4271 0.552083 23.8437 2.34375 22.0521L11.3021 13.0937C13.0937 11.3021 16.6771 11.3021 18.4687 13.0937"
                                    stroke="#989898"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="text-[#989898] mt-2 text-sm ">Video Link</span>
                        </div>
                    </div>

                    {/* Conditional Fields */}
                    {videoOption === "file" && (
                        <label
                            htmlFor="fileUpload"
                            className="w-full  h-40 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer transition hover:bg-gray-50"
                        >
                            <span>
                                <svg width="82" height="55" viewBox="0 0 82 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.4583 0C8.41939 0 5.50492 1.20721 3.35607 3.35607C1.20721 5.50492 0 8.41939 0 11.4583V42.7083C0 45.7473 1.20721 48.6617 3.35607 50.8106C5.50492 52.9594 8.41939 54.1667 11.4583 54.1667H46.875C49.9139 54.1667 52.8284 52.9594 54.9773 50.8106C57.1261 48.6617 58.3333 45.7473 58.3333 42.7083V36.0667L72.5792 48.7542C75.9333 51.7417 81.25 49.3583 81.25 44.8625V7.77083C81.25 3.27083 75.9333 0.891668 72.5792 3.87917L58.3333 16.5667V11.4583C58.3333 8.41939 57.1261 5.50492 54.9773 3.35607C52.8284 1.20721 49.9139 0 46.875 0H11.4583Z" fill="url(#paint0_linear_0_1960)" />
                                    <defs>
                                        <linearGradient id="paint0_linear_0_1960" x1="39.5019" y1="-21.0571" x2="35.2951" y2="76.0683" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#C9A227" />
                                            <stop offset="0.5" stop-color="#F2DA87" />
                                            <stop offset="1" stop-color="#C9A227" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                            </span>
                            <p className="text-[#686868] text-lg font-medium">
                                Click to upload video file
                            </p>
                            <p className="text-[#989898] text-sm mt-1">
                                Supported: MP4, MOV, AVI (Max: 500MB)
                            </p>
                            <input
                                id="fileUpload"
                                type="file"
                                accept="video/mp4,video/mov,video/avi"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    )}

                    {videoOption === "link" && (
                        <Input
                            type="text"
                            placeholder="Enter video link (e.g., Cloudinary URL)"
                            value={videoLink}
                            onChange={(e) => setVideoLink(e.target.value)}
                        />
                    )}
                </div>

                {/* Submit */}

                <div className=" mt-12 flex justify-end  " >
                    <Button

                        className=" rounded-[33px] px-3 py-1.5  bg-gradient-to-b from-[#FFD700] to-[#E6BE00] hover:opacity-90 transition duration-200 shadow-sm text-black "

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
                </div>

            </div>
            <div className=" max-w-7xl mx-auto mt-8 " >
                <CourseLesson></CourseLesson>
            </div>
        </>
    );
}

export default AddLessonForm;

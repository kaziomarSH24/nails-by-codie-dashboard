import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";

export default function AddNewCourse() {
    const [courseTitle, setCourseTitle] = useState("");
    const [description, setDescription] = useState("");
    const [instructor, setInstructor] = useState("");
    const [rewardPoint, setRewardPoint] = useState(100);
    const [price, setPrice] = useState(0);
    const [duration, setDuration] = useState("9:30 AM");
    const [thumbnail, setThumbnail] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setPreview(URL.createObjectURL(file)); // create image preview
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // handle course submission logic here
        console.log({
            courseTitle,
            description,
            instructor,
            rewardPoint,
            price,
            duration,
            thumbnail,
        });
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-9 bg-white shadow shadow-[#00000033] rounded-[14px]">
                <h2 className=" font-medium text-3xl mb-8 ">Add New Course</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label htmlFor="courseTitle text-lg font-medium ">Course Title</Label>
                        <Input
                            id="courseTitle"
                            value={courseTitle}
                            onChange={(e) => setCourseTitle(e.target.value)}
                            placeholder="Enter Course Title"
                            className="w-full mt-2"
                        />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter Course description"
                            rows={4}
                            className="w-full mt-2"
                        />
                    </div>

                    <div className="mb-4 flex justify-between gap-x-4 ">
                        <div className=" w-full " >
                            <Label htmlFor="instructor">Instructor*</Label>
                            <Input
                                id="instructor"
                                value={instructor}
                                onChange={(e) => setInstructor(e.target.value)}
                                placeholder="Enter Instructor Name"
                                className="w-full mt-2"
                            />
                        </div>
                        <div className="w-full ">
                            <Label htmlFor="rewardPoint">Reward Point</Label>
                            <Input
                                id="rewardPoint"
                                type="number"
                                value={rewardPoint}
                                onChange={(e) => setRewardPoint(e.target.value)}
                                className="w-full mt-2"
                            />
                        </div>
                    </div>

                    <div className="flex  gap-x-4 ">


                        <div className="w-full  ">
                            <Label htmlFor="price">Price*</Label>
                            <Input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="$0.00"
                                className="w-full mt-2"
                            />
                        </div>
                        <div className="mb-4 w-full ">
                            <Label htmlFor="duration">Duration</Label>
                            <Input
                                id="duration"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full mt-2"
                            />
                        </div>
                    </div>



                    <div className="mb-6">
                        <Label htmlFor="thumbnail">Course Thumbnail</Label>
                        <div className="flex justify-center mt-2">
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer p-4 border-2 border-dashed border-gray-300 rounded-md text-center text-gray-600 w-full"
                            >
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                {thumbnail ? (
                                    <span>{thumbnail.name}</span>
                                ) : (
                                    <>
                                        <span className=" flex justify-center " >
                                            <svg width="88" height="66" viewBox="0 0 88 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M46.875 65.625V46.875H59.375L43.75 28.125L28.125 46.875H40.625V65.625H25V65.4688C24.475 65.5 23.975 65.625 23.4375 65.625C17.2215 65.625 11.2601 63.1557 6.86469 58.7603C2.4693 54.3649 0 48.4035 0 42.1875C0 30.1625 9.09375 20.3625 20.7625 19.0188C21.7856 13.6706 24.6403 8.8461 28.8357 5.37504C33.0311 1.90398 38.3049 0.00333761 43.75 0C49.1959 0.00301039 54.4706 1.9034 58.667 5.37439C62.8635 8.84538 65.7194 13.6701 66.7438 19.0188C78.4125 20.3625 87.4938 30.1625 87.4938 42.1875C87.4938 48.4035 85.0245 54.3649 80.6291 58.7603C76.2337 63.1557 70.2723 65.625 64.0563 65.625C63.5313 65.625 63.025 65.5 62.4938 65.4688V65.625H46.875Z" fill="#989898" />
                                            </svg>

                                        </span>
                                        <span className=" text-lg font-medium text-[#686868] " >Click to upload or drag and drop</span>  <br />
                                        <span className=" text-sm text-[#989898] " >PNG,JPG,GIF up to 5MB</span>
                                    </>
                                )}
                            </label>
                        </div>

                        {preview && (
                            <div className="mt-4 flex justify-center">
                                <img
                                    src={preview}
                                    alt="Thumbnail Preview"
                                    className="w-48 h-32 object-cover rounded-md shadow-md border"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-x-5 ">
                        <button className="flex items-center gap-2 px-9 py-2.5 rounded-full text-black font-medium text-lg border border-[#B9B9B9] shadow-sm">
                            Cancel
                        </button>
                        <button className="flex items-center gap-2 px-9 py-2.5 rounded-full text-black font-medium text-lg bg-gradient-to-b from-[#FFD700] to-[#E6BE00] hover:opacity-90 transition duration-200 shadow-sm">

                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

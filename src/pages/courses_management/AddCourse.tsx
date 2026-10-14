import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "react-calendar/dist/Calendar.css";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import type { CourseFormData } from "../../lib/type/courseType";
import { errorMessage } from "../../lib/error/errorMsg";
import { useUploadCourseMutation } from "../../api/course-api/courseApi";
import { toast } from "sonner";
import { Spinner } from "../../components/ui/spinner";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";



export default function AddNewCourse() {


    // ------------------- COURSE UPLOAD ------------------

    const [uploadCourse, { isLoading }] = useUploadCourseMutation();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<CourseFormData>({
        defaultValues: {
            reward_points: 100,
            price: 0,
        },
    });

    const [preview, setPreview] = useState<string | null>(null);

    const thumbnailWatch = watch("thumbnail");

    // Preview image
    useEffect(() => {
        if (thumbnailWatch && thumbnailWatch.length > 0) {
            const file = thumbnailWatch[0];
            setPreview(URL.createObjectURL(file));
        }
    }, [thumbnailWatch]);

    const onSubmit = async (data: CourseFormData) => {
        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("instructor", data.instructor);
        formData.append("reward_points", String(data.reward_points));
        formData.append("price", String(data.price));
        formData.append("duration", data.duration || "");

        if (data.thumbnail && data.thumbnail[0]) {
            formData.append("thumbnail", data.thumbnail[0]);
        }

        try {
            const res = await uploadCourse(formData).unwrap();
            toast.success(res?.message || "Course uploaded successfully");
            reset();
            setPreview(null);
        } catch (error) {
            errorMessage(error);
        }
    };

    const navigate = useNavigate();

    return (
        <div>
            <div className=" flex items-center gap-x-2 " >
                <div onClick={() => { navigate("/dashboard/courses-management") }} className=" w-10 h-10 border-2 border-black flex justify-center  items-center rounded-full cursor-pointer  " >
                    <span> <IoMdArrowRoundBack size={25} /> </span>
                </div>
                <div>
                    <h1 className=" text-lg font-semibold " >
                        Back
                    </h1>
                </div>
            </div>
            <div className="max-w-4xl mx-auto p-9 bg-white shadow shadow-[#00000033] rounded-[14px]">
                <h2 className="font-medium text-3xl mb-8">Add New Course</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Course Title */}
                    <div className="mb-4">
                        <Label>Course Title *</Label>
                        <Input
                            {...register("title", { required: "Course title is required" })}
                            placeholder="Enter Course Title"
                            className="w-full mt-2"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <Label>Description *</Label>
                        <Textarea
                            {...register("description", {
                                required: "Description is required",
                                minLength: {
                                    value: 10,
                                    message: "Description must be at least 10 characters",
                                },
                            })}
                            placeholder="Enter Course description"
                            rows={4}
                            className="w-full mt-2"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Instructor */}
                    <div className="mb-4">
                        <Label>Instructor *</Label>
                        <Input
                            {...register("instructor", {
                                required: "Instructor name is required",
                            })}
                            placeholder="Enter Instructor Name"
                            className="w-full mt-2"
                        />
                        {errors.instructor && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.instructor.message}
                            </p>
                        )}
                    </div>

                    {/* Price & Reward Point */}
                    <div className="flex gap-x-4 mb-4">
                        <div className="w-full">
                            <Label>Price (£) *</Label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                {...register("price", {
                                    required: "Price is required",
                                    valueAsNumber: true,
                                    min: {
                                        value: 0,
                                        message: "Price must be 0 or greater",
                                    },
                                })}
                                placeholder="0.00"
                                className="w-full mt-2"
                            />
                            {errors.price && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.price.message}
                                </p>
                            )}
                        </div>

                        <div className="w-full">
                            <Label>Reward Point</Label>
                            <Input
                                type="number"
                                min="0"
                                {...register("reward_points", {
                                    valueAsNumber: true,
                                    min: {
                                        value: 0,
                                        message: "Reward point cannot be negative",
                                    },
                                })}
                                placeholder="100"
                                className="w-full mt-2"
                            />
                            {errors.reward_points && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.reward_points.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="mb-6">
                        <Label>Course Thumbnail *</Label>

                        <label className="cursor-pointer p-4 border-2 border-dashed border-gray-300 rounded-md text-center text-gray-600 w-full block mt-2">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                {...register("thumbnail", {
                                    required: "Thumbnail is required",
                                })}
                            />

                            <span className="text-lg font-medium text-[#686868]">
                                Click to upload or drag and drop
                            </span>
                            <br />
                            <span className="text-sm text-[#989898]">
                                PNG, JPG, GIF up to 5MB
                            </span>
                        </label>

                        {errors.thumbnail && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.thumbnail.message}
                            </p>
                        )}

                        {preview && (
                            <div className="mt-4 flex justify-center">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-48 h-32 object-cover rounded-md shadow-md border"
                                />
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-x-5">
                        <button
                            onClick={() => { navigate("/dashboard/courses-management") }}
                            type="button"
                            className="px-9 py-2.5 rounded-full border border-[#B9B9B9]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-9 py-2.5 rounded-full bg-gradient-to-b from-[#FFD700] to-[#E6BE00] hover:opacity-90"
                        >
                            {
                                isLoading ? <div className=" flex justify-center " >
                                    <Spinner />
                                </div> : "Save"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

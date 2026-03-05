import React, { useEffect, useState } from "react";
import { useCourseUpdateMutation } from "../../api/course-api/courseApi";
import { toast } from "sonner";
import { errorMessage } from "../../lib/error/errorMsg";
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";

// Define Course type
export interface Course {
    id: number;
    thumbnail: string;
    title: string;
    description: string;
    price: string;
    is_published: boolean;
    reward_points: string;
}

// Define props interface
interface CourseUpdateProps {
    selectedCourse: Course; // single course object
    setOpenUpdateModal: (open: boolean) => void;
}

const CourseUpdate = ({ selectedCourse, setOpenUpdateModal }: CourseUpdateProps) => {



    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [reward_points, setReward_points] = useState("");
    const [price, setPrice] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");

    // Mutation hook
    const [courseUpdate, { isLoading: updateLoading }] = useCourseUpdateMutation();

    // Initialize form with selected course data
    useEffect(() => {
        if (selectedCourse) {
            setTitle(selectedCourse.title || "");
            setDescription(selectedCourse.description || "");
            setPrice(selectedCourse.price || "");
            setReward_points(selectedCourse.reward_points || "");
            setImagePreview(selectedCourse.thumbnail || "");
            setImageFile(null); // reset selected file
        }
    }, [selectedCourse]);

    // Handle image change
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handle course update
    const handleUpdateCourse = async () => {
        if (!selectedCourse?.id) return;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("reward_points", reward_points); // append reward_points
        formData.append("_method", "PUT"); // For backend PUT via POST

        if (imageFile) {
            formData.append("thumbnail", imageFile);
        }

        try {
            const response = await courseUpdate({
                id: selectedCourse.id,
                formData,
            }).unwrap();

            toast.success(response?.message || "Course updated successfully");
            setOpenUpdateModal(false);
        } catch (error) {
            errorMessage(error);
        }
    };

    return (
        <div>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Update Course {selectedCourse ? `(${selectedCourse.title})` : ""}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {/* Title */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Title</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter course title"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Price</label>
                        <Input
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter course price"
                        />
                    </div>

                    {/* Reward Points */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Reward Points</label>
                        <Input
                            value={reward_points}
                            onChange={(e) => setReward_points(e.target.value)}
                            placeholder="Enter reward points"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Description</label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter course description"
                            rows={4}
                        />
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Thumbnail Preview</label>
                            <img
                                src={imagePreview}
                                alt="Course Thumbnail"
                                className="w-full h-40 object-cover rounded-md border"
                            />
                        </div>
                    )}

                    {/* Image Input */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Change Thumbnail</label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        className="bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87]"
                        onClick={handleUpdateCourse}
                        disabled={updateLoading}
                    >
                        {updateLoading ? (
                            <div className="flex justify-center">
                                <Spinner />
                            </div>
                        ) : (
                            "Update"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </div>
    );
};

export default CourseUpdate;

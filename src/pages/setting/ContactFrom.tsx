"use client";

import { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { useContactUploadMutation } from "../../api/contact-api/contactApi";
import { errorMessage } from "../../lib/error/errorMsg";
import { Spinner } from "../../components/ui/spinner";
import { toast } from "sonner";
interface ContactFormProps {
    setCreateModal: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ContactFrom({ setCreateModal }: ContactFormProps) {
    const [platformName, setPlatformName] = useState("");
    const [platformLink, setPlatformLink] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [contactUpload, { isLoading }] = useContactUploadMutation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setThumbnail(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("social_links[0][platform]", platformName);
        formData.append("social_links[0][url]", platformLink);

        if (thumbnail) {
            formData.append("social_links[0][icon]", thumbnail);
        }


        try {
            const res = await contactUpload(formData).unwrap();
            if (res) {
                setPlatformName("");
                setPlatformLink("");
                setThumbnail(null);
                toast.success(res?.message);
                setCreateModal(false)
            }
        } catch (error) {
            return errorMessage(error)
        }


    };

    return (
        <div>
            <h2 className="text-xl text-[#3A3734] font-medium mb-6 text-center">
                Add New Platform
            </h2>

            <form onSubmit={handleSubmit}>
                {/* Thumbnail */}
                <div className="mb-4">
                    <Label>Platform Icon</Label>

                    <label className="mt-2 relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 overflow-hidden">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Preview"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <>
                                <svg
                                    width="88"
                                    height="66"
                                    viewBox="0 0 88 66"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M46.875 65.625V46.875H59.375L43.75 28.125L28.125 46.875H40.625V65.625H25V65.4688C24.475 65.5 23.975 65.625 23.4375 65.625C17.2215 65.625 11.2601 63.1557 6.86469 58.7603C2.4693 54.3649 0 48.4035 0 42.1875C0 30.1625 9.09375 20.3625 20.7625 19.0188C21.7856 13.6706 24.6403 8.8461 28.8357 5.37504C33.0311 1.90398 38.3049 0.00333761 43.75 0C49.1959 0.00301039 54.4706 1.9034 58.667 5.37439C62.8635 8.84538 65.7194 13.6701 66.7438 19.0188C78.4125 20.3625 87.4938 30.1625 87.4938 42.1875C87.4938 48.4035 85.0245 54.3649 80.6291 58.7603C76.2337 63.1557 70.2723 65.625 64.0563 65.625C63.5313 65.625 63.025 65.5 62.4938 65.4688V65.625H46.875Z"
                                        fill="#B9B9B9"
                                    />
                                </svg>

                                <span className="mt-2 text-lg text-[#989898] font-medium">
                                    Click to upload or drag & drop
                                </span>
                                <span className="text-xs text-[#989898]">
                                    PNG, JPG, GIF up to 5MB
                                </span>
                            </>
                        )}

                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/gif"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>

                {/* Platform Name */}
                <div className="mb-4">
                    <Label>Name</Label>
                    <Input
                        placeholder="Enter Platform Name"
                        value={platformName}
                        required
                        onChange={(e) => setPlatformName(e.target.value)}
                    />
                </div>

                {/* Platform Link */}
                <div className="mb-6">
                    <Label>Platform Link / Number</Label>
                    <Input
                        type="url"
                        placeholder="Enter Platform link"
                        value={platformLink}
                        required
                        onChange={(e) => setPlatformLink(e.target.value)}
                    />
                </div>

                {/* Submit */}
                <button
                    disabled={isLoading}
                    className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] mt-14"
                >
                    {isLoading ? <div className="  text-black font-bold flex justify-center  " ><Spinner /></div> : "Save"}
                </button>
            </form>
        </div>
    );
}

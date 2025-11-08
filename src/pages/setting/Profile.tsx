
import React, { useState, type ChangeEvent } from "react";
import { FaUser, FaPhoneAlt, FaEnvelope, FaLock } from "react-icons/fa";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";


const Profile: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    return (
        <div className=" max-w-7xl mx-auto mt-12 " >
            <h1 className="text-3xl font-medium  mb-6 " >Profile Information</h1>
            <div className="  bg-white p-8 border border-[#E7E7E7] rounded-[23.28px]  ">
                <div className="">
                    {/* Upload Image Section */}
                    <div className="flex flex-col items-center mb-6">
                        <label
                            htmlFor="photo"
                            className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg flex justify-center items-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                        >
                            {image ? (
                                <img
                                    src={image}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="gray"
                                    className="w-8 h-8"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-9-13.5v12m0 0l-3.75-3.75M12 15l3.75-3.75"
                                    />
                                </svg>
                            )}
                        </label>

                        <input
                            id="photo"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />

                        <p className=" text-2xl font-medium text-[#121221] mt-4 ">
                            Upload your photo
                        </p>
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-4 mt-14">
                        <div className="relative ">
                            <FaUser className="absolute top-3 left-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-[100%]  pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-gray-400"
                            />
                        </div>

                        <div className="relative w-full">
                            <FaPhoneAlt className="absolute top-3 left-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Contact number"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-gray-400"
                            />
                        </div>

                        <div className="relative">
                            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:ring-gray-400"
                            />
                        </div>
                    </div>
                    {/* Buttons */}
                    <div className="mt-8 space-y-3">
                        <button
                            className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] transition-colors duration-200 shadow-md mt-14   "
                        >
                            Save changes
                        </button>

                        {/* ShadCN Modal Trigger */}
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <button className="w-full bg-[#E9E9E9] text-[#1E1E1E] font-bold py-3 rounded-md transition">
                                    Update password from here
                                </button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="font-bold text-3xl text-[#10101E] ">
                                        Update Password
                                    </DialogTitle>

                                </DialogHeader>

                                <div className="space-y-4 mt-3">
                                    {/* Current Password */}
                                    <div className="relative">
                                        <FaLock className="absolute top-3 left-3 text-gray-400" />
                                        <Input
                                            type={showCurrent ? "text" : "password"}
                                            placeholder="Current Password"
                                            className="pl-10 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrent(!showCurrent)}
                                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                                        >
                                            {showCurrent ? (
                                                <IoEyeOffOutline size={18} />
                                            ) : (
                                                <IoEyeOutline size={18} />
                                            )}
                                        </button>
                                    </div>

                                    {/* New Password */}
                                    <div className="relative">
                                        <FaLock className="absolute top-3 left-3 text-gray-400" />
                                        <Input
                                            type={showNew ? "text" : "password"}
                                            placeholder="New Password"
                                            className="pl-10 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNew(!showNew)}
                                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                                        >
                                            {showNew ? (
                                                <IoEyeOffOutline size={18} />
                                            ) : (
                                                <IoEyeOutline size={18} />
                                            )}
                                        </button>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="relative">
                                        <FaLock className="absolute top-3 left-3 text-gray-400" />
                                        <Input
                                            type={showConfirm ? "text" : "password"}
                                            placeholder="Confirm New Password"
                                            className="pl-10 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirm ? (
                                                <IoEyeOffOutline size={18} />
                                            ) : (
                                                <IoEyeOutline size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <DialogFooter className="mt-5">
                                    <Button
                                        onClick={() => setOpen(false)}
                                        className="w-full py-3 rounded-lg text-center text-[#3A3734] font-bold bg-gradient-to-b from-[#f9e07f] to-[#d4af37] hover:opacity-90 transition duration-200 shadow-md"
                                    >
                                        Save Password
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

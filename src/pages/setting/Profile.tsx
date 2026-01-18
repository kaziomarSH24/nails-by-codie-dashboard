import React, { useEffect, useState, type ChangeEvent } from "react";
import { FaUser, FaPhoneAlt, FaEnvelope, FaLock } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import {
    usePasswordUpdateMutation,
    useProfileQuery,
    useProfileUpdateMutation,
} from "../../api/auth/authApi";
import { useForm } from "react-hook-form";
import { errorMessage } from "../../lib/error/errorMsg";
import { toast } from "sonner";
import { Spinner } from "../../components/ui/spinner";

/* -------------------- TYPES -------------------- */
type PasswordForm = {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
};

const Profile: React.FC = () => {
    /* -------------------- PROFILE -------------------- */
    const { data, isLoading } = useProfileQuery({});
    const profile = data?.data;

    const [profileUpdate, { isLoading: updating }] =
        useProfileUpdateMutation();

    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [userName, setUserName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    /* -------------------- PASSWORD MODAL -------------------- */
    const [open, setOpen] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [passwordUpdate, { isLoading: passwordLoading }] =
        usePasswordUpdateMutation();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<PasswordForm>();

    /* -------------------- SET DEFAULT PROFILE DATA -------------------- */
    useEffect(() => {
        if (profile) {
            setUserName(profile.name ?? "");
            setPhone(profile.phone ?? "");
            setEmail(profile.email ?? "");
            setImage(profile.avatar ?? null);
        }
    }, [profile]);

    /* -------------------- IMAGE HANDLER -------------------- */
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImage(URL.createObjectURL(file));
        }
    };

    /* -------------------- PROFILE UPDATE -------------------- */
    const handleProfileUpdate = async () => {
        const formData = new FormData();
        formData.append("name", userName);
        formData.append("phone", phone);

        if (imageFile) {
            formData.append("avatar", imageFile);
        }

        try {
            const res = await profileUpdate(formData).unwrap();
            toast.success(res?.message || "Profile updated successfully");
        } catch (error) {
            errorMessage(error);
        }
    };

    /* -------------------- PASSWORD UPDATE -------------------- */
    const onPasswordSubmit = async (values: PasswordForm) => {
        const payload = {
            current_password: values.current_password,
            new_password: values.new_password,
            new_password_confirmation: values.new_password_confirmation,
        };

        try {

            const res = await passwordUpdate(payload).unwrap();
            toast.success(res?.message || "Password updated");
            reset();
            setOpen(false);
        } catch (error) {
            errorMessage(error);
        }
    };

    if (isLoading) {
        return (
            <div className=" flex justify-center " >
                <Spinner />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto mt-12">
            <h1 className="text-3xl font-medium mb-6">Profile Information</h1>

            <div className="bg-white p-8 border rounded-[23.28px]">
                {/* -------------------- IMAGE UPLOAD -------------------- */}
                <div className="flex flex-col items-center mb-6">
                    <label
                        htmlFor="photo"
                        className="w-28 h-28 border-2 border-dashed rounded-lg flex justify-center items-center cursor-pointer bg-gray-50"
                    >
                        {image ? (
                            <img
                                src={image}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <span className="text-gray-400">Upload</span>
                        )}
                    </label>

                    <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />

                    <p className="text-xl font-medium mt-4">Upload your photo</p>
                </div>

                {/* -------------------- PROFILE INPUTS -------------------- */}
                <div className="space-y-4 mt-14">
                    <div className="relative">
                        <FaUser className="absolute top-3 left-3 text-gray-400" />
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Full Name"
                            className="w-full pl-10 py-2 border rounded-md"
                        />
                    </div>

                    <div className="relative">
                        <FaPhoneAlt className="absolute top-3 left-3 text-gray-400" />
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Contact number"
                            className="w-full pl-10 py-2 border rounded-md"
                        />
                    </div>

                    <div className="relative">
                        <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full pl-10 py-2 border rounded-md bg-gray-100"
                        />
                    </div>
                </div>

                {/* -------------------- ACTION BUTTONS -------------------- */}
                <div className="mt-8 space-y-3">
                    <button
                        onClick={handleProfileUpdate}
                        disabled={updating}
                        className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87]"
                    >
                        {updating ? <div className=" flex justify-center " > <Spinner /> </div> : "Save changes"}
                    </button>

                    {/* -------------------- PASSWORD MODAL -------------------- */}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <button className="w-full bg-[#E9E9E9] font-bold py-3 rounded-md">
                                Update password from here
                            </button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">
                                    Update Password
                                </DialogTitle>
                            </DialogHeader>

                            <form
                                onSubmit={handleSubmit(onPasswordSubmit)}
                                className="space-y-4"
                            >
                                {/* CURRENT PASSWORD */}
                                <div className="relative">
                                    <FaLock className="absolute top-3 left-3 text-gray-400" />
                                    <Input
                                        type={showCurrent ? "text" : "password"}
                                        placeholder="Current Password"
                                        className="pl-10 pr-10"
                                        {...register("current_password", {
                                            required: "Current password is required",
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrent(!showCurrent)}
                                        className="absolute top-3 right-3"
                                    >
                                        {showCurrent ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                    </button>
                                    {errors.current_password && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.current_password.message}
                                        </p>
                                    )}
                                </div>

                                {/* NEW PASSWORD */}
                                <div className="relative">
                                    <FaLock className="absolute top-3 left-3 text-gray-400" />
                                    <Input
                                        type={showNew ? "text" : "password"}
                                        placeholder="New Password"
                                        className="pl-10 pr-10"
                                        {...register("new_password", {
                                            required: "New password is required",
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters",
                                            },
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew(!showNew)}
                                        className="absolute top-3 right-3"
                                    >
                                        {showNew ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                    </button>
                                    {errors.new_password && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.new_password.message}
                                        </p>
                                    )}
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div className="relative">
                                    <FaLock className="absolute top-3 left-3 text-gray-400" />
                                    <Input
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Confirm New Password"
                                        className="pl-10 pr-10"
                                        {...register("new_password_confirmation", {
                                            required: "Confirm password is required",
                                            validate: (value) =>
                                                value === watch("new_password") ||
                                                "Passwords do not match",
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute top-3 right-3"
                                    >
                                        {showConfirm ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                    </button>
                                    {errors.new_password_confirmation && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.new_password_confirmation.message}
                                        </p>
                                    )}
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={passwordLoading}
                                        className="bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] w-full "
                                    >
                                        {passwordLoading ? <div className=" " >
                                            <Spinner />
                                        </div> : "Save Password"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Profile;

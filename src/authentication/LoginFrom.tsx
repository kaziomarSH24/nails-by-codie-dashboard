import { useEffect, useState } from "react";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../api/auth/authApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { toast } from "sonner";
import { Spinner } from "../components/ui/spinner";
import { useForm } from "react-hook-form";

type LoginFormData = {
    email: string;
    password: string;
};

const LoginFrom = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        try {
            const res = await login(data).unwrap();
            reset();
            // example: save token
            localStorage.setItem("token", res.data.access_token);

            toast.success(res.message);
            navigate("/dashboard");
        } catch (err) {
            const error = err as FetchBaseQueryError & {
                data?: { message?: string };
            };

            toast.error(error.data?.message || "Something went wrong ❌");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            window.location.href = "/dashboard"
        }
    }, [])

    return (
        <div className="max-w-2xl mx-auto rounded-3xl shadow shadow-[#00000033] mt-28 pt-20 pb-36">
            <img
                src="/images/logo/auth-logo.svg"
                className="w-[220px] h-[90px] block mx-auto"
            />

            <div className="mt-20">
                <h1 className="text-center text-[#1E1E1E] text-4xl font-semibold">
                    Welcome back!
                </h1>
                <p className="text-[#1E1E1E] text-lg text-center">
                    Please enter email & password to continue
                </p>
            </div>

            <div className="w-[438px] mx-auto mt-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="text-[#989898] text-sm">Email*</label>
                        <input
                            type="email"
                            placeholder="william047@gmail.com"
                            className="w-full px-4 py-3 border border-[#D7D7D7] rounded-lg text-sm mt-2"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: "Invalid email address",
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="relative mb-10">
                        <label className="text-[#989898] text-sm">Password*</label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 border border-[#D7D7D7] rounded-lg text-sm mt-2"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                        />

                        <button
                            type="button"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="absolute right-3 top-[2.8rem] text-gray-400"
                        >
                            {passwordVisible ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                        </button>

                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex justify-between">
                        <div className="flex items-center gap-x-1">
                            <input type="checkbox" />
                            <label className="text-sm text-[#989898]">
                                Remember password
                            </label>
                        </div>
                        <Link
                            to="/email-verify"
                            className="text-xs font-medium bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] text-transparent bg-clip-text"
                        >
                            Forget Password?
                        </Link>
                    </div>

                    {/* Submit */}
                    <button
                        disabled={isLoading}
                        className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] mt-14"
                    >
                        {isLoading ? <div className="  text-black font-bold flex justify-center  " ><Spinner /></div> : "Log in"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginFrom;

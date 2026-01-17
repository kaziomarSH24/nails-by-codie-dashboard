"use client";
import React, { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useOtpVerifyMutation, useResendOtpMutation } from "../api/auth/authApi";
import { toast } from "sonner";
import { errorMessage } from "../lib/error/errorMsg";
import { Spinner } from "../components/ui/spinner";

const OtpVerify = () => {
    const [searchParams] = useSearchParams();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return; // allow only digits
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto move to next input
        if (value && index < 4) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    }



    const email: string | null = searchParams.get("email");
    console.log(email)

    const navigate = useNavigate();

    const [otpVerify, { isLoading }] = useOtpVerifyMutation();

    const [resendOtp] = useResendOtpMutation();

    const handleResendOtp = async () => {
        try {
            const res = await resendOtp(email).unwrap();
            if (res) {
                toast.success(res?.message);
            }
        } catch (error) {
            return errorMessage(error);
        }
    }








    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join("");
        // console.log("Entered OTP:", code);
        // alert(`Your entered OTP is: ${code}`);
        // navigate("/new-password-set");
        // const formData = {
        //     email: email,
        //     otp: code
        // }
        const formData = new FormData();
        formData.append("otp", code);
        if (email) {
            formData.append("email", email);
        }
        try {
            const res = await otpVerify(formData).unwrap();
            if (res) {
                toast.success(res?.message)
            }
        } catch (error) {
            return errorMessage(error);
        }




    };







    return (
        <div className="max-w-2xl mx-auto rounded-3xl shadow shadow-[#00000033] mt-28 pt-20 pb-36 bg-white">
            {/* Logo */}
            <img
                src="/images/logo/auth-logo.svg"
                alt="Logo"
                className="w-[220px] h-[90px] block mx-auto"
            />

            {/* Title & Description */}
            <div className="mt-20 text-center">
                <h1 className="text-[#1E1E1E] text-4xl font-semibold">
                    OTP Verification
                </h1>
                <p className="text-[#6D6D6D] text-lg mt-2">
                    We have sent a verification code to william***@gmail.com
                </p>
            </div>

            {/* OTP Form */}
            <div className="w-[438px] mx-auto mt-10">
                <form onSubmit={handleSubmit} className="">
                    {/* OTP Inputs */}
                    <div className="flex justify-between gap-4">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => { inputsRef.current[index] = el }}
                                className="w-16 h-16 border border-[#D7D7D7] rounded-xl text-center text-2xl font-semibold text-[#1E1E1E]
                           focus:outline-none focus:ring-2 focus:ring-[#91741A] transition-all duration-150"
                            />
                        ))}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 mt-16 rounded-lg font-semibold text-white
                       bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87]
                       shadow-md transition-all duration-300 "
                    >
                        {
                            isLoading ? <div className=" flex justify-center " >
                                <Spinner />
                            </div> : "Verify"
                        }
                    </button>

                    {/* Resend OTP */}
                    <h1 className="flex justify-end text-sm text-[#6D6D6D] mt-5 ">
                        Didn’t receive the code?{" "}
                        <button
                            type="button"
                            onClick={() => handleResendOtp()}
                            className="text-[#91741A] font-medium hover:underline"
                        >
                            Resend
                        </button>
                    </h1>
                </form>
            </div>
        </div>
    );
};

export default OtpVerify;

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEmailVerifyMutation } from "../api/auth/authApi";
import { errorMessage } from "../lib/error/errorMsg";
import { toast } from "sonner";
import { Spinner } from "../components/ui/spinner";

type EmailVerifyFormData = {
    email: string;
};

const EmailVerifyFrom = () => {
    const navigate = useNavigate();

    const {
        register,
        reset,
        handleSubmit, formState: { errors },
    } = useForm<EmailVerifyFormData>();

    const [emailVerify, { isLoading }] = useEmailVerifyMutation();

    const onSubmit = async (data: EmailVerifyFormData) => {
        try {


            const res = await emailVerify(data).unwrap();

            if (res) {
                toast.success(res?.message);
                reset();
                navigate(`/otp-verify?email=${data?.email}`)
            }

        } catch (err) {
            return errorMessage(err);
        }

    };

    return (
        <div className="max-w-2xl mx-auto rounded-3xl shadow shadow-[#00000033] mt-28 pt-20 pb-36">
            <img
                src="/images/logo/auth-logo.svg"
                className="w-[220px] h-[90px] block mx-auto"
            />

            <div className="mt-20">
                <h1 className="text-center text-[#1E1E1E] text-4xl font-semibold">
                    Forgot password
                </h1>
                <p className="text-[#6D6D6D] text-lg text-center">
                    We will send a verification code to your email
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
                            className="w-full px-4 py-3 border border-[#D7D7D7] rounded-[8px] text-sm mt-2.5"
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

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] mt-14"
                    >
                        {
                            isLoading ? <div className=" flex justify-center " >
                                <Spinner />
                            </div> : "Submit"
                        }
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmailVerifyFrom;

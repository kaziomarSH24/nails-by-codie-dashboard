import { useState } from "react";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const NewPasswordSet = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const navigate = useNavigate();
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        navigate("/dashboard");

        // 🔒 Add your password reset logic here
    };

    return (
        <div className="max-w-2xl mx-auto rounded-3xl shadow shadow-[#00000033] mt-28 pt-20 pb-36">
            <img
                src="/images/logo/auth-logo.svg"
                alt="Logo"
                className="w-[220px] h-[90px] block mx-auto"
            />

            <div className="mt-20">
                <h1 className="text-center text-[#1E1E1E] text-4xl font-semibold">
                    Create New Password
                </h1>
            </div>

            <div className="w-[438px] mx-auto mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* New Password */}
                    <div className="relative">
                        <label className="text-[#989898] text-sm">New Password</label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter new password"
                            required
                            className="w-full px-4 py-3 border border-[#D7D7D7] rounded-lg text-sm placeholder:text-gray-400 text-[#989898] focus:outline-0 focus:ring-0 mt-2"
                        />
                        <button
                            type="button"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            aria-label={passwordVisible ? "Hide password" : "Show password"}
                            className="absolute right-3 top-[2.8rem] text-gray-400 hover:text-gray-600 transition"
                        >
                            {passwordVisible ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <label className="text-[#989898] text-sm">Confirm Password</label>
                        <input
                            type={confirmPasswordVisible ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter new password"
                            required
                            className="w-full px-4 py-3 border border-[#D7D7D7] rounded-lg text-sm placeholder:text-gray-400 text-[#989898] focus:outline-0 focus:ring-0 mt-2"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setConfirmPasswordVisible(!confirmPasswordVisible)
                            }
                            aria-label={
                                confirmPasswordVisible ? "Hide password" : "Show password"
                            }
                            className="absolute right-3 top-[2.8rem] text-gray-400 hover:text-gray-600 transition"
                        >
                            {confirmPasswordVisible ? (
                                <IoEyeOff size={18} />
                            ) : (
                                <IoEye size={18} />
                            )}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] transition-colors duration-200 shadow-md mt-14"
                        >
                            Done
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewPasswordSet;

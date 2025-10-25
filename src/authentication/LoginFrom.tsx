
import React, { useState } from 'react'
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';

const LoginFrom = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const togglePassword = () => {
        setPasswordVisible(!passwordVisible);
    };
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login Data:", formData);
        navigate("/dashboard")
        // Add your login logic here (e.g., API call)
    };
    return (
        <div className=' max-w-2xl mx-auto rounded-3xl shadow shadow-[#00000033] mt-28 pt-20  pb-36   '  >
            <img src='/images/logo/auth-logo.svg' className=' w-[220px] h-[90px]  block mx-auto ' />
            <div className=' mt-20  ' >
                <h1 className=' text-center text-[#1E1E1E] text-4xl font-semibold   ' >Welcome back!</h1>
                <p className=' text-[#1E1E1E] text-lg text-center  ' >Please enter email & password to continue</p>
            </div>
            <div className=' w-[438px] mx-auto mt-4  ' >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div className="relative">
                        <label className=' text-[#989898] text-sm ' htmlFor="email">Email*</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="william047@gmail.com"
                            required
                            className="w-full px-4 py-3 border border-[#D7D7D7] text-[#989898] rounded-[8px] text-sm focus:outline-none focus:ring-0  mt-2.5 "
                        />
                    </div>

                    {/* Password Field */}
                    <div className="relative mb-14   ">
                        <label className=' text-[#989898] text-sm '>Password*</label>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full px-4 py-3 border border-[#D7D7D7] rounded-lg  text-sm placeholder:text-gray-400 text-[#989898]  focus:outline-0 focus:ring-0 mt-2"
                        />
                        <button
                            type="button"
                            onClick={togglePassword}
                            aria-label={passwordVisible ? "Hide password" : "Show password"}
                            className="absolute right-3 top-[2.8rem] text-gray-400 hover:text-gray-600 transition"
                        >
                            {passwordVisible ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                        </button>
                    </div>
                    <div className=' flex justify-between  ' >
                        <div className=' flex items-center gap-x-1  ' >
                            <input className=' text-[#989898] ' type="checkbox" />
                            <label className=' text-sm font-medium text-[#989898] ' htmlFor="">Remember password</label>
                        </div>
                        <div>
                            <Link className=' text-xs font-medium bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] text-transparent bg-clip-text ' to={"/email-verify"}>Forget Password?</Link>
                        </div>
                    </div>

                    {/* Login Button */}
                    <div className='  ' >
                        <button
                            className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] transition-colors duration-200 shadow-md mt-14   "
                        >
                            Log in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginFrom
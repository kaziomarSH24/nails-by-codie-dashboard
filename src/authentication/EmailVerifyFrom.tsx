
import { useNavigate } from 'react-router-dom';



const EmailVerifyFrom = () => {
    const navigate = useNavigate();



    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        navigate("/otp-verify")
        // Add your login logic here (e.g., API call)
    };
    return (
        <div className=' max-w-2xl mx-auto rounded-3xl shadow shadow-[#00000033] mt-28 pt-20  pb-36   '  >
            <img src='/images/logo/auth-logo.svg' className=' w-[220px] h-[90px]  block mx-auto ' />
            <div className=' mt-20  ' >
                <h1 className=' text-center text-[#1E1E1E] text-4xl font-semibold   ' >Forgot password</h1>
                <p className=' text-[#6D6D6D] text-lg text-center  ' >We will sent a verification code to william***@gmail.com</p>
            </div>
            <div className=' w-[438px] mx-auto mt-4  ' >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div className="relative">
                        <label className=' text-[#989898] text-sm ' htmlFor="email">Email*</label>
                        <input
                            type="email"
                            name="email"
                            // value={formData.email}
                            // onChange={handleChange}
                            placeholder="william047@gmail.com"
                            required
                            className="w-full px-4 py-3 border border-[#D7D7D7] text-[#989898] rounded-[8px] text-sm focus:outline-none focus:ring-0  mt-2.5 "
                        />
                    </div>

                    {/* Login Button */}
                    <div className='  ' >
                        <button
                            className="w-full py-3 rounded-lg text-white font-bold bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] transition-colors duration-200 shadow-md mt-14   "
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EmailVerifyFrom
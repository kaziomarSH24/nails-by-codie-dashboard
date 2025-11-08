
import { Bell } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const Navbar = () => {
    const location = useLocation();
    const pathName = location.pathname;

    return (
        <div className=' flex items-center justify-between  w-full py-3 ' >
            <div>

                {
                    pathName == "/dashboard" && <>
                        <div>
                            <h1 className=" text-textColor text-3xl font-medium  ">Dashboard Overview</h1>
                            <p className=' text-textColor text-xl mt-1 ' >
                                Welcome back! Here's what's happening with your NBC platform today.
                            </p>

                        </div>


                    </>
                }

                {
                    pathName == "/dashboard/product-management" && <>
                        <div>
                            <h1 className=" text-textColor text-3xl font-medium  ">Products Management</h1>
                            <p className=' text-textColor text-xl mt-1 ' >
                                Manage and monitor all products.
                            </p>

                        </div>


                    </>
                }


                {
                    pathName == "/dashboard/courses-management" && <>
                        <div>
                            <h1 className=" text-textColor text-3xl font-medium  ">Course Management</h1>
                            <p className=' text-textColor text-xl mt-1 ' >
                                Manage and monitor all Courses
                            </p>

                        </div>


                    </>
                }


                {
                    pathName == "/dashboard/user-management" && <>
                        <div>
                            <h1 className=" text-textColor text-3xl font-medium  ">User Management</h1>
                            <p className=' text-textColor text-xl mt-1 ' >
                                Manage and monitor all Users
                            </p>

                        </div>


                    </>
                }


                {
                    pathName == "/dashboard/stock-management" && <>
                        <div>
                            <h1 className=" text-textColor text-3xl font-medium  ">Stock Management</h1>
                            <p className=' text-textColor text-xl mt-1 ' >
                                Manage and monitor all Users
                            </p>

                        </div>


                    </>
                }


                {
                    pathName == "/dashboard/income-tracker" && <>
                        <div>
                            <h1 className=" text-textColor text-3xl font-medium  ">Income Tracker</h1>
                            <p className=' text-textColor text-xl mt-1 ' >
                                Manage and monitor all Users stock
                            </p>

                        </div>


                    </>
                }


                {
                    pathName == "/dashboard/rewards-system" && <>
                        <div>
                            <h1 className=" text-textColor text-3xl font-medium  ">Rewards System</h1>
                            <p className=' text-textColor text-xl mt-1 ' >
                                Manage and monitor all Users stock
                            </p>

                        </div>


                    </>
                }
                {
                    pathName == "/dashboard/settings/profile" && <>
                        <div>
                            <h1 className=" text-textColor text-3xl font-medium  ">Settings</h1>
                            <p className=' text-textColor text-xl mt-1 ' >
                                Manage and monitor all Users stock
                            </p>

                        </div>


                    </>
                }


                {
                    pathName == "/dashboard/settings/term-condiction" && <>
                        <div>
                            <h1 className=" text-textColor text-3xl font-medium  ">Settings</h1>
                            <p className=' text-textColor text-xl mt-1 ' >
                                Manage and monitor all Users stock
                            </p>

                        </div>


                    </>
                }
                {
                    pathName == "/dashboard/settings/faq" && <>
                        <div>
                            <h1 className=" text-textColor text-3xl font-medium  ">Settings</h1>
                            <p className=' text-textColor text-xl mt-1 ' >
                                Manage and monitor all Users stock
                            </p>

                        </div>


                    </>
                }


























            </div>

            <div className="flex items-center gap-4">
                {/* Notification Icon */}
                <button className="p-2 rounded relative">
                    <Bell />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300">
                    <img
                        src="/images/user/avatar.jpg"
                        alt="User"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    )
}

export default Navbar
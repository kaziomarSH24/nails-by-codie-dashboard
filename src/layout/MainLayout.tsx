import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
    // Menu,
    // X,

    Settings,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import Navbar from "../components/navbar/Navbar";

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const location = useLocation();
    const pathName = location.pathname;
    const handleLogout = () => {
        window.location.href = "/"
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 bottom-0 h-screen px-7 text-[#989898] transition-all duration-300 overflow-y-auto border-r border-gray-300 ${sidebarOpen ? "w-[350px]" : "w-[100px]"
                    }`}
            >
                {/* Logo + Toggle */}
                <div className="flex items-center justify-between p-4 mt-4">
                    <span className={`${sidebarOpen ? "block" : "hidden"}`}>
                        <img src="/images/logo/logo.svg" alt="Logo" />
                    </span>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-700 p-1 rounded 
                        "
                    >
                        {/* {sidebarOpen ? <X size={20} /> : <Menu size={20} />} */}
                    </button>
                </div>

                {/* Menu */}
                <nav className="mt-6">
                    <ul className="space-y-2 text-lg font-medium  text-[#989898] ">
                        {/* Dashboard */}
                        <li>
                            <NavLink
                                to="/dashboard"
                                className={`flex items-center gap-7 ${pathName == "/dashboard" ? " bg-[#E9E9E9] " : ""}  px-4 py-3 rounded-[44px] transition `}
                            >
                                {
                                    pathName == "/dashboard" ? <>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 6V0H18V6H10ZM0 10V0H8V10H0ZM10 18V8H18V18H10ZM0 18V12H8V18H0Z" fill="url(#paint0_linear_668_2879)" />
                                            <defs>
                                                <linearGradient id="paint0_linear_668_2879" x1="8.4375" y1="-3.41379" x2="11.6777" y2="22.8596" gradientUnits="userSpaceOnUse">
                                                    <stop stop-color="#F2DA87" />
                                                    <stop offset="0.5" stop-color="#91741A" />
                                                    <stop offset="1" stop-color="#F2DA87" />
                                                </linearGradient>
                                            </defs>
                                        </svg>

                                    </> : <><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 6V0H18V6H10ZM0 10V0H8V10H0ZM10 18V8H18V18H10ZM0 18V12H8V18H0Z" fill="#989898" />
                                    </svg>
                                    </>
                                }
                                {sidebarOpen && <span className={`${pathName === "/dashboard"
                                    ? "bg-[#E9E9E9] text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text"
                                    : ""
                                    }`} > Dashboard</span>}
                            </NavLink>
                        </li>

                        {/* Product Management */}
                        <li>
                            <NavLink
                                to="/dashboard/product-management"
                                className={`flex items-center gap-7 ${pathName == "/dashboard/product-management" ? " bg-[#E9E9E9] " : ""}  px-4 py-3 rounded-[44px] transition `}
                            >
                                {
                                    pathName == "/dashboard/product-management" ? <>
                                        <span>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.5777 2.43152L13.5777 1.38197C11.8221 0.46066 10.9443 0 10 0C9.05572 0 8.17792 0.46066 6.42231 1.38197L6.10059 1.5508L15.0236 6.64967L19.0403 4.64132C18.3941 3.90949 17.3515 3.36234 15.5777 2.43152Z" fill="url(#paint0_linear_675_946)" />
                                                <path d="M19.7484 5.96436L15.75 7.96354V11C15.75 11.4142 15.4142 11.75 15 11.75C14.5858 11.75 14.25 11.4142 14.25 11V8.71352L10.75 10.4635V19.904C11.4679 19.7252 12.2848 19.2965 13.5777 18.618L15.5777 17.5685C17.7294 16.4393 18.8052 15.8748 19.4026 14.8603C20 13.8458 20 12.5833 20 10.0585V9.94151C20 8.04891 20 6.86559 19.7484 5.96436Z" fill="url(#paint1_linear_675_946)" />
                                                <path d="M9.25 19.904V10.4635L0.25164 5.96436C8.9407e-08 6.86559 0 8.04891 0 9.94151V10.0585C0 12.5833 -5.96046e-08 13.8458 0.5974 14.8603C1.19479 15.8748 2.27062 16.4393 4.42228 17.5685L6.42229 18.618C7.71524 19.2965 8.5321 19.7252 9.25 19.904Z" fill="url(#paint2_linear_675_946)" />
                                                <path d="M0.959717 4.64128L10 9.16146L13.4112 7.45586L4.52459 2.37781L4.42232 2.43148C2.64858 3.3623 1.60593 3.90945 0.959717 4.64128Z" fill="url(#paint3_linear_675_946)" />
                                                <defs>
                                                    <linearGradient id="paint0_linear_675_946" x1="12.1661" y1="-1.26114" x2="12.7881" y2="8.55314" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#F2DA87" />
                                                        <stop offset="0.5" stop-color="#91741A" />
                                                        <stop offset="1" stop-color="#F2DA87" />
                                                    </linearGradient>
                                                    <linearGradient id="paint1_linear_675_946" x1="15.0859" y1="3.32063" x2="18.7968" y2="23.2872" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#F2DA87" />
                                                        <stop offset="0.5" stop-color="#91741A" />
                                                        <stop offset="1" stop-color="#F2DA87" />
                                                    </linearGradient>
                                                    <linearGradient id="paint2_linear_675_946" x1="4.33594" y1="3.32063" x2="8.04676" y2="23.2872" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#F2DA87" />
                                                        <stop offset="0.5" stop-color="#91741A" />
                                                        <stop offset="1" stop-color="#F2DA87" />
                                                    </linearGradient>
                                                    <linearGradient id="paint3_linear_675_946" x1="6.79636" y1="1.09125" x2="7.46873" y2="11.0983" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#F2DA87" />
                                                        <stop offset="0.5" stop-color="#91741A" />
                                                        <stop offset="1" stop-color="#F2DA87" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>

                                        </span>

                                    </> : <>
                                        <span>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17.5777 4.43152L15.5777 3.38197C13.8221 2.46066 12.9443 2 12 2C11.0557 2 10.1779 2.46066 8.42231 3.38197L8.10059 3.5508L17.0236 8.64967L21.0403 6.64132C20.3941 5.90949 19.3515 5.36234 17.5777 4.43152Z" fill="#989898" />
                                                <path d="M21.7484 7.96436L17.75 9.96354V13C17.75 13.4142 17.4142 13.75 17 13.75C16.5858 13.75 16.25 13.4142 16.25 13V10.7135L12.75 12.4635V21.904C13.4679 21.7252 14.2848 21.2965 15.5777 20.618L17.5777 19.5685C19.7294 18.4393 20.8052 17.8748 21.4026 16.8603C22 15.8458 22 14.5833 22 12.0585V11.9415C22 10.0489 22 8.86559 21.7484 7.96436Z" fill="#989898" />
                                                <path d="M11.25 21.904V12.4635L2.25164 7.96436C2 8.86559 2 10.0489 2 11.9415V12.0585C2 14.5833 2 15.8458 2.5974 16.8603C3.19479 17.8748 4.27062 18.4393 6.42228 19.5685L8.42229 20.618C9.71524 21.2965 10.5321 21.7252 11.25 21.904Z" fill="#989898" />
                                                <path d="M2.95972 6.64131L12 11.1615L15.4112 9.45589L6.52459 4.37784L6.42232 4.43151C4.64858 5.36233 3.60593 5.90948 2.95972 6.64131Z" fill="#989898" />
                                            </svg>

                                        </span>
                                    </>
                                }
                                {sidebarOpen && <span className={`${pathName === "/dashboard/product-management"
                                    ? "bg-[#E9E9E9] text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text"
                                    : ""
                                    }`} > Products Management</span>}
                            </NavLink>
                        </li>





                        {/* Courses Management */}
                        <li>
                            <NavLink
                                to="/dashboard/courses-management"
                                className={`flex items-center gap-7 ${(pathName === "/dashboard/courses-management" || pathName === "/dashboard/course-create" || pathName === "/dashboard/add-leason")
                                    ? "bg-[#E9E9E9]" : ""}   px-4 py-3 rounded-[44px] transition`}
                            >
                                {pathName === "/dashboard/courses-management" || pathName === "/dashboard/course-create" || pathName === "/dashboard/add-leason" ? (
                                    <span>
                                        {/* Active SVG */}
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15.5777 2.43152L13.5777 1.38197C11.8221 0.46066 10.9443 0 10 0C9.05572 0 8.17792 0.46066 6.42231 1.38197L6.10059 1.5508L15.0236 6.64967L19.0403 4.64132C18.3941 3.90949 17.3515 3.36234 15.5777 2.43152Z" fill="url(#paint0_linear_675_946)" />
                                            <path d="M19.7484 5.96436L15.75 7.96354V11C15.75 11.4142 15.4142 11.75 15 11.75C14.5858 11.75 14.25 11.4142 14.25 11V8.71352L10.75 10.4635V19.904C11.4679 19.7252 12.2848 19.2965 13.5777 18.618L15.5777 17.5685C17.7294 16.4393 18.8052 15.8748 19.4026 14.8603C20 13.8458 20 12.5833 20 10.0585V9.94151C20 8.04891 20 6.86559 19.7484 5.96436Z" fill="url(#paint1_linear_675_946)" />
                                            <path d="M9.25 19.904V10.4635L0.25164 5.96436C8.9407e-08 6.86559 0 8.04891 0 9.94151V10.0585C0 12.5833 -5.96046e-08 13.8458 0.5974 14.8603C1.19479 15.8748 2.27062 16.4393 4.42228 17.5685L6.42229 18.618C7.71524 19.2965 8.5321 19.7252 9.25 19.904Z" fill="url(#paint2_linear_675_946)" />
                                            <path d="M0.959717 4.64128L10 9.16146L13.4112 7.45586L4.52459 2.37781L4.42232 2.43148C2.64858 3.3623 1.60593 3.90945 0.959717 4.64128Z" fill="url(#paint3_linear_675_946)" />
                                            <defs>
                                                <linearGradient id="paint0_linear_675_946" x1="12.1661" y1="-1.26114" x2="12.7881" y2="8.55314" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#F2DA87" />
                                                    <stop offset="0.5" stopColor="#91741A" />
                                                    <stop offset="1" stopColor="#F2DA87" />
                                                </linearGradient>
                                                <linearGradient id="paint1_linear_675_946" x1="15.0859" y1="3.32063" x2="18.7968" y2="23.2872" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#F2DA87" />
                                                    <stop offset="0.5" stopColor="#91741A" />
                                                    <stop offset="1" stopColor="#F2DA87" />
                                                </linearGradient>
                                                <linearGradient id="paint2_linear_675_946" x1="4.33594" y1="3.32063" x2="8.04676" y2="23.2872" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#F2DA87" />
                                                    <stop offset="0.5" stopColor="#91741A" />
                                                    <stop offset="1" stopColor="#F2DA87" />
                                                </linearGradient>
                                                <linearGradient id="paint3_linear_675_946" x1="6.79636" y1="1.09125" x2="7.46873" y2="11.0983" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#F2DA87" />
                                                    <stop offset="0.5" stopColor="#91741A" />
                                                    <stop offset="1" stopColor="#F2DA87" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </span>
                                ) : (
                                    <span>
                                        {/* Inactive SVG */}
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.5777 4.43152L15.5777 3.38197C13.8221 2.46066 12.9443 2 12 2C11.0557 2 10.1779 2.46066 8.42231 3.38197L8.10059 3.5508L17.0236 8.64967L21.0403 6.64132C20.3941 5.90949 19.3515 5.36234 17.5777 4.43152Z" fill="#989898" />
                                            <path d="M21.7484 7.96436L17.75 9.96354V13C17.75 13.4142 17.4142 13.75 17 13.75C16.5858 13.75 16.25 13.4142 16.25 13V10.7135L12.75 12.4635V21.904C13.4679 21.7252 14.2848 21.2965 15.5777 20.618L17.5777 19.5685C19.7294 18.4393 20.8052 17.8748 21.4026 16.8603C22 15.8458 22 14.5833 22 12.0585V11.9415C22 10.0489 22 8.86559 21.7484 7.96436Z" fill="#989898" />
                                            <path d="M11.25 21.904V12.4635L2.25164 7.96436C2 8.86559 2 10.0489 2 11.9415V12.0585C2 14.5833 2 15.8458 2.5974 16.8603C3.19479 17.8748 4.27062 18.4393 6.42228 19.5685L8.42229 20.618C9.71524 21.2965 10.5321 21.7252 11.25 21.904Z" fill="#989898" />
                                            <path d="M2.95972 6.64131L12 11.1615L15.4112 9.45589L6.52459 4.37784L6.42232 4.43151C4.64858 5.36233 3.60593 5.90948 2.95972 6.64131Z" fill="#989898" />
                                        </svg>
                                    </span>
                                )}

                                {sidebarOpen && (
                                    <span
                                        className={`${pathName === "/dashboard/courses-management" ||
                                            pathName === "/dashboard/course-create" || pathName === "/dashboard/add-leason"
                                            ? "text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text"
                                            : ""
                                            }`}
                                    >
                                        Courses Management
                                    </span>
                                )}
                            </NavLink>
                        </li>




                        {/* user Management*/}
                        <li>
                            <NavLink
                                to="/dashboard/user-management"
                                className={`flex items-center gap-7 ${pathName == "/dashboard/user-management" ? " bg-[#E9E9E9] " : ""}  px-4 py-3 rounded-[44px] transition `}
                            >
                                {
                                    pathName == "/dashboard/user-management" ? <>
                                        <span>

                                            <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14 13V15H0V13C0 13 0 9.00004 7 9.00004C14 9.00004 14 13 14 13ZM10.5 3.50004C10.5 2.8078 10.2947 2.13111 9.91014 1.55554C9.52556 0.979969 8.97893 0.531365 8.33939 0.266459C7.69985 0.0015519 6.99612 -0.0677598 6.31718 0.0672885C5.63825 0.202337 5.01461 0.53568 4.52513 1.02516C4.03564 1.51465 3.7023 2.13829 3.56725 2.81722C3.4322 3.49615 3.50152 4.19989 3.76642 4.83943C4.03133 5.47897 4.47993 6.0256 5.0555 6.41018C5.63108 6.79477 6.30777 7.00004 7 7.00004C7.92826 7.00004 8.8185 6.63129 9.47487 5.97491C10.1313 5.31853 10.5 4.42829 10.5 3.50004ZM13.94 9.00004C14.5547 9.47578 15.0578 10.0805 15.4137 10.7715C15.7696 11.4626 15.9697 12.2233 16 13V15H20V13C20 13 20 9.37004 13.94 9.00004ZM13 3.67965e-05C12.3118 -0.00316434 11.6388 0.202568 11.07 0.590037C11.6774 1.43877 12.0041 2.45632 12.0041 3.50004C12.0041 4.54375 11.6774 5.5613 11.07 6.41004C11.6388 6.79751 12.3118 7.00324 13 7.00004C13.9283 7.00004 14.8185 6.63129 15.4749 5.97491C16.1313 5.31853 16.5 4.42829 16.5 3.50004C16.5 2.57178 16.1313 1.68154 15.4749 1.02516C14.8185 0.368786 13.9283 3.67965e-05 13 3.67965e-05Z" fill="url(#paint0_linear_786_2588)" />
                                                <defs>
                                                    <linearGradient id="paint0_linear_786_2588" x1="9.375" y1="-2.84483" x2="11.4135" y2="19.1942" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#F2DA87" />
                                                        <stop offset="0.5" stop-color="#91741A" />
                                                        <stop offset="1" stop-color="#F2DA87" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>


                                        </span>

                                    </> : <>
                                        <span>
                                            <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14 13V15H0V13C0 13 0 9.00004 7 9.00004C14 9.00004 14 13 14 13ZM10.5 3.50004C10.5 2.8078 10.2947 2.13111 9.91014 1.55554C9.52556 0.979969 8.97893 0.531365 8.33939 0.266459C7.69985 0.0015519 6.99612 -0.0677598 6.31718 0.0672885C5.63825 0.202337 5.01461 0.53568 4.52513 1.02516C4.03564 1.51465 3.7023 2.13829 3.56725 2.81722C3.4322 3.49615 3.50152 4.19989 3.76642 4.83943C4.03133 5.47897 4.47993 6.0256 5.0555 6.41018C5.63108 6.79477 6.30777 7.00004 7 7.00004C7.92826 7.00004 8.8185 6.63129 9.47487 5.97491C10.1313 5.31853 10.5 4.42829 10.5 3.50004ZM13.94 9.00004C14.5547 9.47578 15.0578 10.0805 15.4137 10.7715C15.7696 11.4626 15.9697 12.2233 16 13V15H20V13C20 13 20 9.37004 13.94 9.00004ZM13 3.67965e-05C12.3118 -0.00316434 11.6388 0.202568 11.07 0.590037C11.6774 1.43877 12.0041 2.45632 12.0041 3.50004C12.0041 4.54375 11.6774 5.5613 11.07 6.41004C11.6388 6.79751 12.3118 7.00324 13 7.00004C13.9283 7.00004 14.8185 6.63129 15.4749 5.97491C16.1313 5.31853 16.5 4.42829 16.5 3.50004C16.5 2.57178 16.1313 1.68154 15.4749 1.02516C14.8185 0.368786 13.9283 3.67965e-05 13 3.67965e-05Z" fill="#989898" />
                                            </svg>


                                        </span>
                                    </>
                                }
                                {sidebarOpen && <span className={`${pathName === "/dashboard/user-management"
                                    ? "bg-[#E9E9E9] text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text"
                                    : ""
                                    }`} > Users Management</span>}
                            </NavLink>
                        </li>




                        {/* Stock Management*/}
                        <li>
                            <NavLink
                                to="/dashboard/stock-management"
                                className={`flex items-center gap-7 ${pathName == "/dashboard/stock-management" ? " bg-[#E9E9E9] " : ""}  px-4 py-3 rounded-[44px] transition `}
                            >
                                {
                                    pathName == "/dashboard/stock-management" ? <>
                                        <span>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.5777 2.43152L13.5777 1.38197C11.8221 0.46066 10.9443 0 10 0C9.05572 0 8.17792 0.46066 6.42231 1.38197L6.10059 1.5508L15.0236 6.64967L19.0403 4.64132C18.3941 3.90949 17.3515 3.36234 15.5777 2.43152Z" fill="url(#paint0_linear_675_946)" />
                                                <path d="M19.7484 5.96436L15.75 7.96354V11C15.75 11.4142 15.4142 11.75 15 11.75C14.5858 11.75 14.25 11.4142 14.25 11V8.71352L10.75 10.4635V19.904C11.4679 19.7252 12.2848 19.2965 13.5777 18.618L15.5777 17.5685C17.7294 16.4393 18.8052 15.8748 19.4026 14.8603C20 13.8458 20 12.5833 20 10.0585V9.94151C20 8.04891 20 6.86559 19.7484 5.96436Z" fill="url(#paint1_linear_675_946)" />
                                                <path d="M9.25 19.904V10.4635L0.25164 5.96436C8.9407e-08 6.86559 0 8.04891 0 9.94151V10.0585C0 12.5833 -5.96046e-08 13.8458 0.5974 14.8603C1.19479 15.8748 2.27062 16.4393 4.42228 17.5685L6.42229 18.618C7.71524 19.2965 8.5321 19.7252 9.25 19.904Z" fill="url(#paint2_linear_675_946)" />
                                                <path d="M0.959717 4.64128L10 9.16146L13.4112 7.45586L4.52459 2.37781L4.42232 2.43148C2.64858 3.3623 1.60593 3.90945 0.959717 4.64128Z" fill="url(#paint3_linear_675_946)" />
                                                <defs>
                                                    <linearGradient id="paint0_linear_675_946" x1="12.1661" y1="-1.26114" x2="12.7881" y2="8.55314" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#F2DA87" />
                                                        <stop offset="0.5" stop-color="#91741A" />
                                                        <stop offset="1" stop-color="#F2DA87" />
                                                    </linearGradient>
                                                    <linearGradient id="paint1_linear_675_946" x1="15.0859" y1="3.32063" x2="18.7968" y2="23.2872" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#F2DA87" />
                                                        <stop offset="0.5" stop-color="#91741A" />
                                                        <stop offset="1" stop-color="#F2DA87" />
                                                    </linearGradient>
                                                    <linearGradient id="paint2_linear_675_946" x1="4.33594" y1="3.32063" x2="8.04676" y2="23.2872" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#F2DA87" />
                                                        <stop offset="0.5" stop-color="#91741A" />
                                                        <stop offset="1" stop-color="#F2DA87" />
                                                    </linearGradient>
                                                    <linearGradient id="paint3_linear_675_946" x1="6.79636" y1="1.09125" x2="7.46873" y2="11.0983" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#F2DA87" />
                                                        <stop offset="0.5" stop-color="#91741A" />
                                                        <stop offset="1" stop-color="#F2DA87" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>

                                        </span>

                                    </> : <>
                                        <span>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.01982 1.1618C9.23554 0.946067 9.58534 0.946067 9.80106 1.1618L11.7846 3.14532L13.7628 1.16711C13.9785 0.951376 14.3283 0.951376 14.544 1.16711C14.7598 1.38285 14.7598 1.73262 14.544 1.94835L12.5658 3.92657L14.4885 5.84927C14.7042 6.06499 14.7042 6.41478 14.4885 6.63051C14.2728 6.84623 13.923 6.84623 13.7073 6.63051L11.7846 4.7078L9.85658 6.63581C9.64086 6.85153 9.29112 6.85153 9.07534 6.63581C8.85962 6.42009 8.85962 6.07029 9.07534 5.85457L11.0033 3.92657L9.01982 1.94304C8.8041 1.72731 8.8041 1.37753 9.01982 1.1618Z" fill="#989898" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.7691 6.88185C11.8824 6.84407 12.005 6.84407 12.1184 6.88185L20.2822 9.60264C20.3919 9.63419 20.4917 9.69965 20.5653 9.79406L22.7767 12.6325C22.8869 12.774 22.9216 12.9602 22.8697 13.1319C22.8342 13.2494 22.7611 13.3501 22.664 13.4202L14.157 16.2535L12.3795 13.9719C12.2747 13.8375 12.1137 13.7588 11.9432 13.759C11.7728 13.7592 11.6119 13.838 11.5074 13.9726L9.73946 16.2498L1.20806 13.404C1.12156 13.335 1.05653 13.2407 1.02365 13.1319C0.971736 12.9602 1.00641 12.774 1.11665 12.6325L3.28828 9.8451C3.35472 9.73666 3.45817 9.65164 3.58475 9.60949L11.7691 6.88185ZM18.3808 10.1336L11.9459 12.2781L5.50885 10.1328L11.9437 7.98825L18.3808 10.1336Z" fill="#989898" />
                                                <path d="M14.1357 17.4248L20.6802 15.2451L20.6799 18.8755C20.6799 19.5888 20.2234 20.222 19.5467 20.4476L12.4962 22.7978V15.9191L13.5254 17.2402C13.6692 17.4248 13.9137 17.4987 14.1357 17.4248Z" fill="#989898" />
                                                <path d="M11.3913 15.9236V22.7979L4.34072 20.4477C3.66401 20.2221 3.20756 19.5889 3.20751 18.8756L3.20728 15.2354L9.76109 17.4215C9.98349 17.4957 10.2285 17.4214 10.3722 17.2363L11.3913 15.9236Z" fill="#989898" />
                                            </svg>


                                        </span>
                                    </>
                                }
                                {sidebarOpen && <span className={`${pathName === "/dashboard/stock-management"
                                    ? "bg-[#E9E9E9] text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text"
                                    : ""
                                    }`} > Stock Management</span>}
                            </NavLink>
                        </li>



                        {/* Income Tracker*/}
                        <li>
                            <NavLink
                                to="/dashboard/income-tracker"
                                className={`flex items-center gap-7 ${pathName == "/dashboard/income-tracker" ? " bg-[#E9E9E9] " : ""}  px-4 py-3 rounded-[44px] transition `}
                            >
                                {
                                    pathName == "/dashboard/income-tracker" ? <>
                                        <span>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.5777 2.43152L13.5777 1.38197C11.8221 0.46066 10.9443 0 10 0C9.05572 0 8.17792 0.46066 6.42231 1.38197L6.10059 1.5508L15.0236 6.64967L19.0403 4.64132C18.3941 3.90949 17.3515 3.36234 15.5777 2.43152Z" fill="url(#paint0_linear_675_946)" />
                                                <path d="M19.7484 5.96436L15.75 7.96354V11C15.75 11.4142 15.4142 11.75 15 11.75C14.5858 11.75 14.25 11.4142 14.25 11V8.71352L10.75 10.4635V19.904C11.4679 19.7252 12.2848 19.2965 13.5777 18.618L15.5777 17.5685C17.7294 16.4393 18.8052 15.8748 19.4026 14.8603C20 13.8458 20 12.5833 20 10.0585V9.94151C20 8.04891 20 6.86559 19.7484 5.96436Z" fill="url(#paint1_linear_675_946)" />
                                                <path d="M9.25 19.904V10.4635L0.25164 5.96436C8.9407e-08 6.86559 0 8.04891 0 9.94151V10.0585C0 12.5833 -5.96046e-08 13.8458 0.5974 14.8603C1.19479 15.8748 2.27062 16.4393 4.42228 17.5685L6.42229 18.618C7.71524 19.2965 8.5321 19.7252 9.25 19.904Z" fill="url(#paint2_linear_675_946)" />
                                                <path d="M0.959717 4.64128L10 9.16146L13.4112 7.45586L4.52459 2.37781L4.42232 2.43148C2.64858 3.3623 1.60593 3.90945 0.959717 4.64128Z" fill="url(#paint3_linear_675_946)" />
                                                <defs>
                                                    <linearGradient id="paint0_linear_675_946" x1="12.1661" y1="-1.26114" x2="12.7881" y2="8.55314" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#F2DA87" />
                                                        <stop offset="0.5" stop-color="#91741A" />
                                                        <stop offset="1" stop-color="#F2DA87" />
                                                    </linearGradient>
                                                    <linearGradient id="paint1_linear_675_946" x1="15.0859" y1="3.32063" x2="18.7968" y2="23.2872" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#F2DA87" />
                                                        <stop offset="0.5" stop-color="#91741A" />
                                                        <stop offset="1" stop-color="#F2DA87" />
                                                    </linearGradient>
                                                    <linearGradient id="paint2_linear_675_946" x1="4.33594" y1="3.32063" x2="8.04676" y2="23.2872" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#F2DA87" />
                                                        <stop offset="0.5" stop-color="#91741A" />
                                                        <stop offset="1" stop-color="#F2DA87" />
                                                    </linearGradient>
                                                    <linearGradient id="paint3_linear_675_946" x1="6.79636" y1="1.09125" x2="7.46873" y2="11.0983" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#F2DA87" />
                                                        <stop offset="0.5" stop-color="#91741A" />
                                                        <stop offset="1" stop-color="#F2DA87" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>

                                        </span>

                                    </> : <>
                                        <span>

                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.25 7.84717C10.314 8.10317 9.75 8.82217 9.75 9.50017C9.75 10.1782 10.314 10.8972 11.25 11.1522V7.84717ZM12.75 12.8482V16.1522C13.686 15.8972 14.25 15.1782 14.25 14.5002C14.25 13.8222 13.686 13.1032 12.75 12.8482Z" fill="#989898" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12ZM12 5.25C12.1989 5.25 12.3897 5.32902 12.5303 5.46967C12.671 5.61032 12.75 5.80109 12.75 6V6.317C14.38 6.609 15.75 7.834 15.75 9.5C15.75 9.69891 15.671 9.88968 15.5303 10.0303C15.3897 10.171 15.1989 10.25 15 10.25C14.8011 10.25 14.6103 10.171 14.4697 10.0303C14.329 9.88968 14.25 9.69891 14.25 9.5C14.25 8.822 13.686 8.103 12.75 7.847V11.317C14.38 11.609 15.75 12.834 15.75 14.5C15.75 16.166 14.38 17.391 12.75 17.683V18C12.75 18.1989 12.671 18.3897 12.5303 18.5303C12.3897 18.671 12.1989 18.75 12 18.75C11.8011 18.75 11.6103 18.671 11.4697 18.5303C11.329 18.3897 11.25 18.1989 11.25 18V17.683C9.62 17.391 8.25 16.166 8.25 14.5C8.25 14.3011 8.32902 14.1103 8.46967 13.9697C8.61032 13.829 8.80109 13.75 9 13.75C9.19891 13.75 9.38968 13.829 9.53033 13.9697C9.67098 14.1103 9.75 14.3011 9.75 14.5C9.75 15.178 10.314 15.897 11.25 16.152V12.683C9.62 12.391 8.25 11.166 8.25 9.5C8.25 7.834 9.62 6.609 11.25 6.317V6C11.25 5.80109 11.329 5.61032 11.4697 5.46967C11.6103 5.32902 11.8011 5.25 12 5.25Z" fill="#989898" />
                                            </svg>



                                        </span>
                                    </>
                                }
                                {sidebarOpen && <span className={`${pathName === "/dashboard/income-tracker"
                                    ? "bg-[#E9E9E9] text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text"
                                    : ""
                                    }`} > Income Tracker</span>}
                            </NavLink>
                        </li>




                        {/* Notification*/}
                        {/* <li>
                            <NavLink
                                to="/dashboard/notification"
                                className={`flex items-center gap-7 ${pathName == "/dashboard/notification" ? " bg-[#E9E9E9] " : ""}  px-4 py-3 rounded-[44px] transition `}
                            >
                                {
                                    pathName == "/dashboard/notification" ? <>
                                        <span>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15.5777 2.43152L13.5777 1.38197C11.8221 0.46066 10.9443 0 10 0C9.05572 0 8.17792 0.46066 6.42231 1.38197L6.10059 1.5508L15.0236 6.64967L19.0403 4.64132C18.3941 3.90949 17.3515 3.36234 15.5777 2.43152Z" fill="url(#paint0_linear_675_946)" />
                                                <path d="M19.7484 5.96436L15.75 7.96354V11C15.75 11.4142 15.4142 11.75 15 11.75C14.5858 11.75 14.25 11.4142 14.25 11V8.71352L10.75 10.4635V19.904C11.4679 19.7252 12.2848 19.2965 13.5777 18.618L15.5777 17.5685C17.7294 16.4393 18.8052 15.8748 19.4026 14.8603C20 13.8458 20 12.5833 20 10.0585V9.94151C20 8.04891 20 6.86559 19.7484 5.96436Z" fill="url(#paint1_linear_675_946)" />
                                                <path d="M9.25 19.904V10.4635L0.25164 5.96436C8.9407e-08 6.86559 0 8.04891 0 9.94151V10.0585C0 12.5833 -5.96046e-08 13.8458 0.5974 14.8603C1.19479 15.8748 2.27062 16.4393 4.42228 17.5685L6.42229 18.618C7.71524 19.2965 8.5321 19.7252 9.25 19.904Z" fill="url(#paint2_linear_675_946)" />
                                                <path d="M0.959717 4.64128L10 9.16146L13.4112 7.45586L4.52459 2.37781L4.42232 2.43148C2.64858 3.3623 1.60593 3.90945 0.959717 4.64128Z" fill="url(#paint3_linear_675_946)" />
                                                <defs>
                                                    <linearGradient id="paint0_linear_675_946" x1="12.1661" y1="-1.26114" x2="12.7881" y2="8.55314" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#F2DA87" />
                                                        <stop offset="0.5" stop-color="#91741A" />
                                                        <stop offset="1" stop-color="#F2DA87" />
                                                    </linearGradient>
                                                    <linearGradient id="paint1_linear_675_946" x1="15.0859" y1="3.32063" x2="18.7968" y2="23.2872" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#F2DA87" />
                                                        <stop offset="0.5" stop-color="#91741A" />
                                                        <stop offset="1" stop-color="#F2DA87" />
                                                    </linearGradient>
                                                    <linearGradient id="paint2_linear_675_946" x1="4.33594" y1="3.32063" x2="8.04676" y2="23.2872" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#F2DA87" />
                                                        <stop offset="0.5" stop-color="#91741A" />
                                                        <stop offset="1" stop-color="#F2DA87" />
                                                    </linearGradient>
                                                    <linearGradient id="paint3_linear_675_946" x1="6.79636" y1="1.09125" x2="7.46873" y2="11.0983" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#F2DA87" />
                                                        <stop offset="0.5" stop-color="#91741A" />
                                                        <stop offset="1" stop-color="#F2DA87" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>

                                        </span>

                                    </> : <>
                                        <span>

                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2C10.1435 2 8.363 2.7375 7.05025 4.05025C5.73749 5.36301 4.99999 7.14349 4.99999 9V12.528C5.00014 12.6831 4.96419 12.8362 4.89499 12.975L3.17799 16.408C3.09412 16.5757 3.05451 16.7621 3.06294 16.9494C3.07137 17.1368 3.12754 17.3188 3.22614 17.4783C3.32473 17.6379 3.46246 17.7695 3.62626 17.8608C3.79005 17.9521 3.97447 18 4.16199 18H19.838C20.0255 18 20.2099 17.9521 20.3737 17.8608C20.5375 17.7695 20.6753 17.6379 20.7739 17.4783C20.8724 17.3188 20.9286 17.1368 20.9371 16.9494C20.9455 16.7621 20.9059 16.5757 20.822 16.408L19.106 12.975C19.0365 12.8362 19.0002 12.6832 19 12.528V9C19 7.14349 18.2625 5.36301 16.9497 4.05025C15.637 2.7375 13.8565 2 12 2ZM12 21C11.3793 21.0003 10.7739 20.8082 10.267 20.4499C9.76016 20.0917 9.37688 19.5852 9.16999 19H14.83C14.6231 19.5852 14.2398 20.0917 13.733 20.4499C13.2261 20.8082 12.6206 21.0003 12 21Z" fill="#989898" />
                                            </svg>




                                        </span>
                                    </>
                                }
                                {sidebarOpen && <span className={`${pathName === "/dashboard/notification"
                                    ? "bg-[#E9E9E9] text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text"
                                    : ""
                                    }`} >Notification</span>}
                            </NavLink>
                        </li> */}


                        {/* Rewards System*/}
                        <li>
                            <NavLink
                                to="/dashboard/rewards-system"
                                className={`flex items-center gap-7 ${pathName == "/dashboard/rewards-system" ? " bg-[#E9E9E9] " : ""}  px-4 py-3 rounded-[44px] transition `}
                            >
                                {
                                    pathName == "/dashboard/rewards-system" ? <>
                                        <span>
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 8C9.55 8 10.021 7.80433 10.413 7.413C10.805 7.02167 11.0007 6.55067 11 6C10.9993 5.44933 10.8037 4.97867 10.413 4.588C10.0223 4.19733 9.55133 4.00133 9 4C8.44867 3.99867 7.978 4.19467 7.588 4.588C7.198 4.98133 7.002 5.452 7 6C6.998 6.548 7.194 7.019 7.588 7.413C7.982 7.807 8.45267 8.00267 9 8ZM4 7.8V4H2V5C2 5.63333 2.18333 6.20433 2.55 6.713C2.91667 7.22167 3.4 7.584 4 7.8ZM14 7.8C14.6 7.58333 15.0833 7.22067 15.45 6.712C15.8167 6.20333 16 5.63267 16 5V4H14V7.8ZM8 16V12.9C7.18333 12.7167 6.45433 12.371 5.813 11.863C5.17167 11.355 4.70067 10.7173 4.4 9.95C3.15 9.8 2.10433 9.25433 1.263 8.313C0.421667 7.37167 0.000666667 6.26733 0 5V4C0 3.45 0.196 2.97933 0.588 2.588C0.98 2.19667 1.45067 2.00067 2 2H4C4 1.45 4.196 0.979333 4.588 0.588C4.98 0.196667 5.45067 0.000666667 6 0H12C12.55 0 13.021 0.196 13.413 0.588C13.805 0.98 14.0007 1.45067 14 2H16C16.55 2 17.021 2.196 17.413 2.588C17.805 2.98 18.0007 3.45067 18 4V5C18 6.26667 17.579 7.371 16.737 8.313C15.895 9.255 14.8493 9.80067 13.6 9.95C13.3 10.7167 12.8293 11.3543 12.188 11.863C11.5467 12.3717 10.8173 12.7173 10 12.9V16H13C13.2833 16 13.521 16.096 13.713 16.288C13.905 16.48 14.0007 16.7173 14 17C13.9993 17.2827 13.9033 17.5203 13.712 17.713C13.5207 17.9057 13.2833 18.0013 13 18H5C4.71667 18 4.47933 17.904 4.288 17.712C4.09667 17.52 4.00067 17.2827 4 17C3.99933 16.7173 4.09533 16.48 4.288 16.288C4.48067 16.096 4.718 16 5 16H8Z" fill="url(#paint0_linear_50_2273)" />
                                                <defs>
                                                    <linearGradient id="paint0_linear_50_2273" x1="8.4375" y1="-3.4138" x2="11.6777" y2="22.8596" gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#F2DA87" />
                                                        <stop offset="0.5" stop-color="#91741A" />
                                                        <stop offset="1" stop-color="#F2DA87" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>


                                        </span>

                                    </> : <>
                                        <span>

                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 8C9.55 8 10.021 7.80433 10.413 7.413C10.805 7.02167 11.0007 6.55067 11 6C10.9993 5.44933 10.8037 4.97867 10.413 4.588C10.0223 4.19733 9.55133 4.00133 9 4C8.44867 3.99867 7.978 4.19467 7.588 4.588C7.198 4.98133 7.002 5.452 7 6C6.998 6.548 7.194 7.019 7.588 7.413C7.982 7.807 8.45267 8.00267 9 8ZM4 7.8V4H2V5C2 5.63333 2.18333 6.20433 2.55 6.713C2.91667 7.22167 3.4 7.584 4 7.8ZM14 7.8C14.6 7.58333 15.0833 7.22067 15.45 6.712C15.8167 6.20333 16 5.63267 16 5V4H14V7.8ZM8 16V12.9C7.18333 12.7167 6.45433 12.371 5.813 11.863C5.17167 11.355 4.70067 10.7173 4.4 9.95C3.15 9.8 2.10433 9.25433 1.263 8.313C0.421667 7.37167 0.000666667 6.26733 0 5V4C0 3.45 0.196 2.97933 0.588 2.588C0.98 2.19667 1.45067 2.00067 2 2H4C4 1.45 4.196 0.979333 4.588 0.588C4.98 0.196667 5.45067 0.000666667 6 0H12C12.55 0 13.021 0.196 13.413 0.588C13.805 0.98 14.0007 1.45067 14 2H16C16.55 2 17.021 2.196 17.413 2.588C17.805 2.98 18.0007 3.45067 18 4V5C18 6.26667 17.579 7.371 16.737 8.313C15.895 9.255 14.8493 9.80067 13.6 9.95C13.3 10.7167 12.8293 11.3543 12.188 11.863C11.5467 12.3717 10.8173 12.7173 10 12.9V16H13C13.2833 16 13.521 16.096 13.713 16.288C13.905 16.48 14.0007 16.7173 14 17C13.9993 17.2827 13.9033 17.5203 13.712 17.713C13.5207 17.9057 13.2833 18.0013 13 18H5C4.71667 18 4.47933 17.904 4.288 17.712C4.09667 17.52 4.00067 17.2827 4 17C3.99933 16.7173 4.09533 16.48 4.288 16.288C4.48067 16.096 4.718 16 5 16H8Z" fill="#989898" />
                                            </svg>





                                        </span>
                                    </>
                                }
                                {sidebarOpen && <span className={`${pathName === "/dashboard/rewards-system"
                                    ? "bg-[#E9E9E9] text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text"
                                    : ""
                                    }`} >Rewards System</span>}
                            </NavLink>
                        </li>




                        {/* Settings with Submenu */}
                        <li>
                            <button
                                onClick={() => setSettingsOpen(!settingsOpen)}
                                className={`flex items-center justify-between w-full px-4 py-3 rounded-[44px] transition ${pathName.startsWith("/settings") ? "bg-[#E9E9E9]" : ""
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <Settings />
                                    {sidebarOpen && <span>Settings</span>}
                                </div>
                                {sidebarOpen &&
                                    (settingsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                            </button>

                            {settingsOpen && sidebarOpen && (
                                <ul className="pl-12 mt-2 space-y-1">
                                    <li>
                                        <NavLink
                                            to="/dashboard/settings/profile"
                                            className={`block px-4 py-2 rounded transition 
                                                ${pathName === "/dashboard/settings/profile"
                                                    ? "bg-[#E9E9E9] text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text"
                                                    : "text-[#989898]"
                                                }`}
                                        >
                                            Profile
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/dashboard/settings/term-condiction"
                                            className={`block px-4 py-2 rounded transition 
                                            ${pathName === "/dashboard/settings/term-condiction"
                                                    ? "bg-[#E9E9E9] text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text"
                                                    : "text-[#989898]"
                                                }`}
                                        >
                                            Terms & Conditions
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/dashboard/settings/faq"
                                            className={`block px-4 py-2 rounded transition 
                                            ${pathName === "/dashboard/settings/faq"
                                                    ? "bg-[#E9E9E9] text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text"
                                                    : "text-[#989898]"
                                                }`}
                                        >
                                            FAQ
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/dashboard/settings/contact-info"
                                            className={`block px-4 py-2 rounded transition 
                                            ${pathName === "/dashboard/settings/contact-info"
                                                    ? "bg-[#E9E9E9] text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text"
                                                    : "text-[#989898]"
                                                }`}
                                        >
                                            Contact Info
                                        </NavLink>
                                    </li>
                                </ul>
                            )}
                        </li>








                    </ul>
                </nav>

                <div className=" mt-[50%] cursor-pointer " >
                    <span onClick={handleLogout}  >
                        <svg width="239" height="44" viewBox="0 0 239 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="238" height="43" rx="21.5" stroke="#989898" />
                            <path d="M26.0417 13.5417H34.5V11.125H26.0417C24.7125 11.125 23.625 12.2125 23.625 13.5417V30.4583C23.625 31.7875 24.7125 32.875 26.0417 32.875H34.5V30.4583H26.0417V13.5417ZM45.375 22L40.5417 17.1667V20.7917H30.875V23.2083H40.5417V26.8333L45.375 22Z" fill="#989898" />
                            <path d="M77.1533 28C76.5381 28 76.1689 27.6133 76.1689 26.9805V16.1963C76.1689 15.5635 76.5381 15.1768 77.1533 15.1768C77.7598 15.1768 78.1377 15.5635 78.1377 16.1963V26.2949H83.2705C83.8154 26.2949 84.1846 26.6289 84.1846 27.1475C84.1846 27.666 83.8154 28 83.2705 28H77.1533ZM89.2471 28.1758C86.6016 28.1758 84.8613 26.3564 84.8613 23.377C84.8613 20.4062 86.6104 18.5869 89.2471 18.5869C91.8838 18.5869 93.6328 20.4062 93.6328 23.377C93.6328 26.3564 91.8926 28.1758 89.2471 28.1758ZM89.2471 26.6113C90.7412 26.6113 91.6992 25.4336 91.6992 23.377C91.6992 21.3291 90.7324 20.1514 89.2471 20.1514C87.7617 20.1514 86.7949 21.3291 86.7949 23.377C86.7949 25.4336 87.7617 26.6113 89.2471 26.6113ZM98.9766 31.4805C97.2979 31.4629 95.9707 30.8125 95.3379 29.8105C95.2148 29.5996 95.1621 29.4062 95.1621 29.1865C95.1621 28.7471 95.4873 28.4307 95.9707 28.4307C96.2607 28.4307 96.4453 28.5273 96.7002 28.7822C97.4561 29.5732 98.1064 29.916 99.0117 29.9336C100.559 29.9512 101.499 29.0723 101.499 27.7803V26.3125H101.455C100.937 27.3145 99.8467 27.9736 98.5283 27.9736C96.1992 27.9736 94.6875 26.1543 94.6875 23.2979C94.6875 20.4062 96.1816 18.6045 98.5723 18.6045C99.8818 18.6045 100.901 19.2637 101.464 20.3096H101.499V19.5625C101.499 18.9473 101.912 18.5869 102.457 18.5869C103.002 18.5869 103.406 18.9473 103.406 19.5625V27.7451C103.406 30.0303 101.728 31.5068 98.9766 31.4805ZM99.0381 26.4268C100.523 26.4268 101.508 25.2139 101.508 23.3154C101.508 21.417 100.523 20.1689 99.0381 20.1689C97.5791 20.1689 96.6299 21.3818 96.6299 23.3066C96.6299 25.2402 97.5791 26.4268 99.0381 26.4268ZM114.647 28.2109C110.991 28.2109 108.706 25.6973 108.706 21.6631C108.706 17.6289 110.991 15.1064 114.647 15.1064C118.295 15.1064 120.589 17.6289 120.589 21.6631C120.589 25.6973 118.295 28.2109 114.647 28.2109ZM114.647 26.4795C117.056 26.4795 118.567 24.6162 118.567 21.6631C118.567 18.7012 117.056 16.8379 114.647 16.8379C112.239 16.8379 110.719 18.7012 110.719 21.6631C110.719 24.6162 112.239 26.4795 114.647 26.4795ZM125.44 28.167C123.428 28.167 122.197 26.8574 122.197 24.7393V19.5977C122.197 18.9648 122.584 18.5869 123.146 18.5869C123.7 18.5869 124.096 18.9648 124.096 19.5977V24.3701C124.096 25.7764 124.764 26.5322 126.073 26.5322C127.444 26.5322 128.271 25.583 128.271 24.1416V19.5977C128.271 18.9648 128.666 18.5869 129.22 18.5869C129.782 18.5869 130.169 18.9648 130.169 19.5977V27.2002C130.169 27.7891 129.809 28.167 129.264 28.167C128.719 28.167 128.35 27.7891 128.35 27.209V26.4355H128.306C127.796 27.543 126.855 28.167 125.44 28.167ZM132.604 25.7852V20.2568H131.936C131.443 20.2568 131.145 19.9756 131.145 19.5098C131.145 19.0352 131.443 18.7539 131.936 18.7539H132.604V17.3828C132.604 16.7764 132.981 16.3721 133.562 16.3721C134.133 16.3721 134.511 16.7764 134.511 17.3828V18.7539H135.592C136.084 18.7539 136.383 19.0439 136.383 19.5098C136.383 19.9756 136.084 20.2568 135.592 20.2568H134.511V25.3633C134.511 26.1016 134.766 26.4355 135.451 26.4883L135.601 26.4971C136.146 26.5498 136.418 26.7695 136.418 27.2178C136.418 27.7891 135.979 28.0791 135.047 28.0791H134.95C133.395 28.0791 132.604 27.3145 132.604 25.7852Z" fill="#989898" />
                        </svg>
                    </span>

                </div>

            </aside>

            {/* Header */}
            <header
                className={`fixed top-0 h-24 bg-white shadow z-20 flex items-center justify-between px-6 transition-all duration-300 ${sidebarOpen ? "ml-[350px]" : "ml-[100px]"
                    }`}
                style={{
                    width: sidebarOpen ? "calc(100% - 350px)" : "calc(100% - 80px)",
                }}
            >
                <Navbar></Navbar>
            </header>

            {/* Main Content */}
            <main
                className={`flex-1 p-6 mt-24 transition-all min-h-screen pb-20  duration-300 ${sidebarOpen ? "ml-[350px]" : "ml-[100px]"
                    } bg-gray-100 `}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;

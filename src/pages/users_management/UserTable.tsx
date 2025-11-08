"use client";
import { useState } from "react";

import { Search, RefreshCw } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";

type User = {
    id: number;
    name: string;
    email: string;
    contact: string;
    status: "Active" | "Inactive" | "Suspense";
    subscription: "Paid" | "Trial" | "Free";
};

const usersData: User[] = [
    { id: 1, name: "John Doe", email: "john@example.com", contact: "+123456789", status: "Active", subscription: "Paid" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", contact: "+987654321", status: "Inactive", subscription: "Trial" },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", contact: "+192837465", status: "Suspense", subscription: "Free" },
    // Add more users here
];

const UserTable = () => {
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const filteredUsers = usersData.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.contact.toLowerCase().includes(search.toLowerCase())
    );

    const handleReload = (id: number) => {
        console.log("Reload user with id:", id);
    };

    return (
        <div className=" shadow shadow-[#00000033] rounded-[14px] bg-white px-7 py-9 ">
            <h1 className=" text-3xl font-medium mb-9 " >All Users</h1>
            {/* Search Bar */}
            <div className=" relative w-[80%] mb-5  ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                    className="pl-10" // Add left padding so text doesn't overlap the icon
                    placeholder="Search by name, email, or contact"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto  rounded-lg">
                    <thead className="bg-[#E9E9E9] clear-start py-3  ">
                        <tr className=" text-[#686868] text-xs py-4  " >
                            <th className="px-4 py-2 text-start ">Name</th>
                            <th className="px-4 py-2 text-center">Email</th>
                            <th className="px-4 py-2 text-center">Contact</th>
                            <th className="px-4 py-2 text-center">Status</th>
                            <th className="px-4 py-2 text-center">Subscription</th>
                            <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition text-center text-xs ">
                                <td className="px-4 py-2 flex flex-row items-center gap-x-2.5 text-center text-xs text-[#000000] "> <span><img src="/images/logo/user.png" alt="" /></span> {user.name}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">{user.contact}</td>
                                <td className="px-4 py-2">
                                    <span
                                        className={`px-4 py-1 rounded-[4px]  text-xs  ${user.status === "Active"
                                            ? "text-[#24983F] bg-[#EAF6EC] "
                                            : user.status === "Inactive"
                                                ? "text-[#988E24] bg-[#F5F6EA] "
                                                : "bg-[#F6EAEA] text-[#982424] "
                                            }`}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    <span
                                        className={`px-4 py-1 rounded-[4px]  text-xs  ${user.subscription === "Paid"
                                            ? "text-[#24983F] bg-[#EAF6EC] "
                                            : user.subscription === "Trial"
                                                ? "text-[#988E24] bg-[#F5F6EA] "
                                                : "bg-[#F6EAEA] text-[#982424] "
                                            }`}
                                    >
                                        {user.subscription}
                                    </span>
                                </td>
                                <td className="px-4 py-2 flex items-center gap-2">
                                    {/* View Modal */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="flex items-center gap-1 px-2 py-1 text-sm border border-[#989898] "
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11 4.5C10.2044 4.5 9.44129 4.81607 8.87868 5.37868C8.31607 5.94129 8 6.70435 8 7.5C8 8.29565 8.31607 9.05871 8.87868 9.62132C9.44129 10.1839 10.2044 10.5 11 10.5C11.7956 10.5 12.5587 10.1839 13.1213 9.62132C13.6839 9.05871 14 8.29565 14 7.5C14 6.70435 13.6839 5.94129 13.1213 5.37868C12.5587 4.81607 11.7956 4.5 11 4.5ZM11 12.5C9.67392 12.5 8.40215 11.9732 7.46447 11.0355C6.52678 10.0979 6 8.82608 6 7.5C6 6.17392 6.52678 4.90215 7.46447 3.96447C8.40215 3.02678 9.67392 2.5 11 2.5C12.3261 2.5 13.5979 3.02678 14.5355 3.96447C15.4732 4.90215 16 6.17392 16 7.5C16 8.82608 15.4732 10.0979 14.5355 11.0355C13.5979 11.9732 12.3261 12.5 11 12.5ZM11 0C6 0 1.73 3.11 0 7.5C1.73 11.89 6 15 11 15C16 15 20.27 11.89 22 7.5C20.27 3.11 16 0 11 0Z" fill="#B9B9B9" />
                                                </svg>


                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl pt-10 pb-7 px-8  ">

                                            {selectedUser && (
                                                <>
                                                    <div className="space-y-2 mt-2">
                                                        {/* imgage and info  */}
                                                        <div className=" flex items-center gap-x-5  " >
                                                            <div>
                                                                <img src="/images/logo/user.png" alt="" className=" w-20 h-20 rounded-full " />
                                                            </div>
                                                            <div className=" space-y-2 " >
                                                                <h1 className=" text-lg font-medium " >Emma Johnson</h1>
                                                                <p className=" text-xs " >emmajohnson@gmail.com</p>
                                                                <button className=" bg-[#EAF6EC] rounded-[4px] py-1 px-4 text-xs text-[#24983F]  " >Active</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className=" mt-7 flex items-center justify-between gap-x-4 " >

                                                        {/* box 1 phone  */}

                                                        <div className=" bg-[#E9E9E994] h-[76px] w-[33.33%] rounded-[5px] py-3 px-5 " >
                                                            <h1 className=" text-sm font-medium " >Phone</h1>
                                                            <p className=" text-sm mt-3 " >(+05555555)</p>
                                                        </div>

                                                        {/* box 2 Subscription  */}

                                                        <div className=" bg-[#E9E9E994] h-[76px] w-[33.33%] rounded-[5px] py-3 px-5 " >
                                                            <h1 className=" text-sm font-medium " >Subscription</h1>
                                                            <button className=" bg-[#EAF6EC] text-[#24983F] border border-[#69E397]  px-4 py-1 rounded-[4px] text-xs mt-3 " >Paid</button>
                                                        </div>



                                                        {/* box 3 Date Joined  */}

                                                        <div className=" bg-[#E9E9E994] h-[76px] w-[33.33%] rounded-[5px] py-3 px-5 " >
                                                            <h1 className=" text-sm font-medium " >Date Joined</h1>
                                                            <p className=" text-sm mt-3 " >Mar 15, 2025</p>
                                                        </div>

                                                    </div>
                                                    <div className=" mt-8 " >
                                                        <h1 className=" font-medium text-[16px] " >Course Enrollments</h1>
                                                        <div className=" border border-[#989898] rounded-[8px] flex justify-between py-3 px-4 mt-2 items-center " >
                                                            <h1>Advanced Nail Art</h1>
                                                            <button className=" bg-[#C2E9BE] rounded-[20px] py-1 px-3 text-[#2A912D] " >Enrolled</button>
                                                        </div>
                                                    </div>


                                                    <div className=" " >
                                                        <h1 className=" font-medium text-[16px] " >Appointment History</h1>
                                                        <div className=" border border-[#989898] rounded-[8px] flex justify-between items-center py-3 px-4 mt-2 " >
                                                            <h1>Appointment #1</h1>
                                                            <p className=" text-[#000000] text-xs " >  Oct 15, 2025</p>
                                                        </div>
                                                    </div>


                                                    <div className=" mt-12 flex justify-end " >
                                                        <button className=" border border-[#E32C2C] text-[#E32C2C] text-xs rounded-[6px] p-2.5 " >Syspend User</button>
                                                    </div>


                                                </>
                                            )}
                                        </DialogContent>
                                    </Dialog>

                                    {/* Reload Button */}

                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-1 px-2 py-1 text-sm border border-[#989898] "
                                        onClick={() => handleReload(user.id)}
                                    >
                                        <RefreshCw size={16} />
                                    </Button>

                                </td>
                            </tr>
                        ))}

                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;

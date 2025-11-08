import { useState } from "react";

const UserReward = () => {
    const users = [
        { id: 1, name: "Ishan Rana", email: "ishan@example.com", total: 1200, redeemed: 400, available: 800, lastRedeemed: "2025-10-10" },
        { id: 2, name: "Arif Hasan", email: "arif@example.com", total: 900, redeemed: 300, available: 600, lastRedeemed: "2025-09-25" },
        { id: 3, name: "Mehedi Hossain", email: "mehedi@example.com", total: 1500, redeemed: 700, available: 800, lastRedeemed: "2025-09-15" },
        { id: 4, name: "Sadia Akter", email: "sadia@example.com", total: 600, redeemed: 200, available: 400, lastRedeemed: "2025-10-01" },
        { id: 5, name: "Rafiul Islam", email: "rafiul@example.com", total: 1100, redeemed: 500, available: 600, lastRedeemed: "2025-09-05" },
        { id: 6, name: "Mim Sultana", email: "mim@example.com", total: 1300, redeemed: 300, available: 1000, lastRedeemed: "2025-09-28" },
        { id: 7, name: "Rakib Khan", email: "rakib@example.com", total: 950, redeemed: 150, available: 800, lastRedeemed: "2025-10-05" },
        { id: 8, name: "Sara Rahman", email: "sara@example.com", total: 1800, redeemed: 1000, available: 800, lastRedeemed: "2025-09-20" },
        { id: 9, name: "Fahim Alam", email: "fahim@example.com", total: 1000, redeemed: 400, available: 600, lastRedeemed: "2025-09-11" },
        { id: 10, name: "Tania Nahar", email: "tania@example.com", total: 800, redeemed: 300, available: 500, lastRedeemed: "2025-09-02" },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    const totalPages = Math.ceil(users.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="    ">
            <div className="py-7 px-11 rounded-[14px] shadow shadow-[#00000033] bg-white  mt-8 ">
                <h1 className=" mb-6 text-xl font-medium text-[#3A3734]   ">
                    User Reward
                </h1>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rounded-lg">
                        <thead className="bg-[#E9E9E9] text-sm uppercase">
                            <tr>
                                <th className="px-4 py-3 border-b text-[#686868] text-xs ">User Name</th>
                                <th className="px-4 py-3 border-b text-[#686868] text-xs ">Email</th>
                                <th className="px-4 py-3 border-b text-[#686868] text-xs  text-center">Total Points</th>
                                <th className="px-4 py-3 border-b text-[#686868] text-xs  text-center">Redeemed Points</th>
                                <th className="px-4 py-3 border-b text-[#686868] text-xs  text-center">Available Points</th>
                                <th className="px-4 py-3 border-b text-[#686868] text-xs  text-center">Last Redeemed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-gray-50 transition-colors border-b"
                                >
                                    <td className="px-4 py-3 text-sm ">{user.name}</td>
                                    <td className="px-4 py-3 text-sm ">{user.email}</td>
                                    <td className="px-4 py-3 text-center text-sm ">{user.total}</td>
                                    <td className="px-4 py-3 text-center  text-sm ">{user.redeemed}</td>
                                    <td className="px-4 py-3 text-center  text-sm ">{user.available}</td>
                                    <td className="px-4 py-3 text-center text-sm ">{user.lastRedeemed}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center  gap-x-4 justify-end  mt-6">
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 text-sm rounded-md border ${currentPage === 1
                            ? "text-gray-400 border-gray-200 cursor-not-allowed"
                            : "text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        Previous
                    </button>

                    <span className="text-gray-600 text-sm">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 text-sm rounded-md border ${currentPage === totalPages
                            ? "text-gray-400 border-gray-200 cursor-not-allowed"
                            : "text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserReward;

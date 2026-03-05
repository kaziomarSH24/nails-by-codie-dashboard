import { useState } from "react";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { useAllRewardQuery } from "../../api/reward-api/rewardApi";
import type { UserRewardPoints } from "../../lib/type/rewardType";
import UserRewardSkeleton from "../../components/skeleton/UserRewardSkeleton";


const UserReward = () => {

    const { data, isLoading } = useAllRewardQuery({});


    const users: UserRewardPoints[] = data?.report?.data || [];



    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

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

    if (isLoading) {
        return (
            <div>
                <UserRewardSkeleton />
            </div>
        )
    }

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
                                    <td className="px-4 py-3 text-sm ">{user.user_name}</td>
                                    <td className="px-4 py-3 text-sm ">{user.email}</td>
                                    <td className="px-4 py-3 text-center text-sm ">{user.total_points}</td>
                                    <td className="px-4 py-3 text-center  text-sm ">{user.redeemed_points}</td>
                                    <td className="px-4 py-3 text-center  text-sm ">{user.available_points}</td>
                                    <td className="px-4 py-3 text-center text-sm ">{user.last_redeemed}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center gap-x-2 justify-end mt-6">
                    {/* Previous */}
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 text-sm rounded-md border ${currentPage === 1
                            ? "text-gray-400 border-gray-200 cursor-not-allowed"
                            : "text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        <GrFormPrevious size={30} />
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-2 text-sm rounded-md border ${currentPage === i + 1
                                ? "bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] text-black "
                                : "text-gray-700 border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    {/* Next */}
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 text-sm rounded-md border ${currentPage === totalPages
                            ? "text-gray-400 border-gray-200 cursor-not-allowed"
                            : "text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        <MdNavigateNext size={30} />

                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserReward;

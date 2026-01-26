const UserRewardSkeleton = () => {
    return (
        <div>
            <div className="py-7 px-11 rounded-[14px] shadow shadow-[#00000033] bg-white mt-8 animate-pulse">
                {/* Title */}
                <div className="h-6 w-40 bg-gray-200 rounded mb-6" />

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left rounded-lg">
                        <thead className="bg-[#E9E9E9]">
                            <tr>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <th key={i} className="px-4 py-3 border-b">
                                        <div className="h-3 w-20 bg-gray-300 rounded" />
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {Array.from({ length: 10 }).map((_, index) => (
                                <tr key={index} className="border-b">
                                    {/* User Name */}
                                    <td className="px-4 py-3">
                                        <div className="h-4 w-32 bg-gray-200 rounded" />
                                    </td>

                                    {/* Email */}
                                    <td className="px-4 py-3">
                                        <div className="h-4 w-44 bg-gray-200 rounded" />
                                    </td>

                                    {/* Total */}
                                    <td className="px-4 py-3 text-center">
                                        <div className="h-4 w-12 bg-gray-200 rounded mx-auto" />
                                    </td>

                                    {/* Redeemed */}
                                    <td className="px-4 py-3 text-center">
                                        <div className="h-4 w-12 bg-gray-200 rounded mx-auto" />
                                    </td>

                                    {/* Available */}
                                    <td className="px-4 py-3 text-center">
                                        <div className="h-4 w-12 bg-gray-200 rounded mx-auto" />
                                    </td>

                                    {/* Last Redeemed */}
                                    <td className="px-4 py-3 text-center">
                                        <div className="h-4 w-24 bg-gray-200 rounded mx-auto" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Skeleton */}
                <div className="flex items-center gap-x-2 justify-end mt-6">
                    <div className="h-9 w-9 bg-gray-200 rounded-md" />
                    <div className="h-9 w-9 bg-gray-200 rounded-md" />
                    <div className="h-9 w-9 bg-gray-200 rounded-md" />
                    <div className="h-9 w-9 bg-gray-200 rounded-md" />
                    <div className="h-9 w-9 bg-gray-200 rounded-md" />
                </div>
            </div>
        </div>
    );
};

export default UserRewardSkeleton;

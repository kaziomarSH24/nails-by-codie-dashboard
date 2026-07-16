
const ProductSkeleton = () => {
    return (
        <div>
            <div className="w-full mx-auto animate-pulse">
                {/* Title */}
                <div className="h-8 w-64 bg-gray-200 rounded mb-9" />

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-[80%]">
                        <div className="h-11 w-full bg-gray-200 rounded-[5.95px]" />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border">
                        <thead className="bg-[#E9E9E9] text-xs">
                            <tr>
                                {["Product Name", "Stock", "Price", "Status", "Date Added", "Action"].map(
                                    (item) => (
                                        <th key={item} className="px-4 py-3">
                                            <div className="h-3 w-20 bg-gray-300 rounded" />
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {Array.from({ length: 6 }).map((_, index) => (
                                <tr key={index} className="border-t">
                                    {/* Product */}
                                    <td className="px-4 py-3 flex items-center gap-x-2">
                                        <div className="w-12 h-12 rounded-full bg-gray-200" />
                                        <div className="h-4 w-32 bg-gray-200 rounded" />
                                    </td>

                                    {/* Stock */}
                                    <td className="px-4 py-3">
                                        <div className="h-4 w-10 bg-gray-200 rounded" />
                                    </td>

                                    {/* Price */}
                                    <td className="px-4 py-3">
                                        <div className="h-4 w-16 bg-gray-200 rounded" />
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3">
                                        <div className="h-6 w-20 bg-gray-200 rounded-full" />
                                    </td>

                                    {/* Date */}
                                    <td className="px-4 py-3">
                                        <div className="h-4 w-24 bg-gray-200 rounded" />
                                    </td>

                                    {/* Action */}
                                    <td className="px-4 py-3 flex justify-center gap-3">
                                        <div className="h-9 w-9 bg-gray-200 rounded-md" />
                                        <div className="h-9 w-9 bg-gray-200 rounded-md" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-end items-center mt-6 gap-2">
                    <div className="h-8 w-16 bg-gray-200 rounded-md" />
                    <div className="h-8 w-8 bg-gray-200 rounded-md" />
                    <div className="h-8 w-8 bg-gray-200 rounded-md" />
                    <div className="h-8 w-16 bg-gray-200 rounded-md" />
                </div>
            </div>

        </div>
    )
}

export default ProductSkeleton
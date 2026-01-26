import { useState } from "react";
import { useStockOverviewQuery } from "../../api/stock-api/stockApi";
import type { StockOverviewType } from "../../lib/type/stockType";
import { Button } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";

const ITEMS_PER_PAGE = 5;

const StockOverview = () => {
    const [stockPage, setStockPage] = useState(1);

    // ================= API =================
    const { data, isLoading } = useStockOverviewQuery({});

    const stockOverviewData: StockOverviewType[] =
        data?.data?.data || [];

    // ================= PAGINATION =================
    const stockTotalPages = Math.ceil(
        stockOverviewData.length / ITEMS_PER_PAGE
    );

    const stockPageItems = stockOverviewData.slice(
        (stockPage - 1) * ITEMS_PER_PAGE,
        stockPage * ITEMS_PER_PAGE
    );



    return (
        <div>
            <div className="overflow-x-auto">

                {
                    isLoading ? <div className=" flex justify-center items-center " > <Spinner /> </div> :
                        <>
                            {/* TABLE */}
                            <table className="w-full border-collapse">
                                <thead className="bg-[#E9E9E9] text-[#686868] text-xs h-12">
                                    <tr>
                                        <th className="p-2 border-b text-left">Product</th>
                                        <th className="p-2 border-b text-left">Image</th>
                                        <th className="p-2 border-b text-center">Stock Status</th>
                                        <th className="p-2 border-b text-center">SKU</th>
                                        <th className="p-2 border-b text-center">Current Stock</th>
                                        <th className="p-2 border-b text-center">
                                            Low-Stock Alert
                                        </th>
                                        <th className="p-2 border-b text-center">Status</th>
                                        <th className="p-2 border-b text-center">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {stockPageItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50 border-b items-center "
                                        >
                                            <td className="p-2 text-sm">{item.title}</td>

                                            <td className="p-2">
                                                <img
                                                    src={item.image_url}
                                                    width={60}
                                                    height={60}
                                                    alt={item.title}
                                                    className="rounded"
                                                />
                                            </td>

                                            <td className="text-center text-sm">
                                                {item.stock_status}
                                            </td>

                                            <td className="p-2 text-center text-sm">
                                                {item.sku}
                                            </td>

                                            <td className="p-2 text-center text-sm">
                                                {item.stock_quantity}
                                            </td>

                                            <td className="p-2 text-center">
                                                <span className="bg-[#EAF6EC] py-1 px-3 text-[#24983F] text-xs rounded">
                                                    {item.low_stock_threshold}
                                                </span>
                                            </td>

                                            <td className="p-2 text-center">
                                                <span className="bg-[#EAF6EC] py-1 px-3 text-[#24983F] text-xs rounded">
                                                    {item.status}
                                                </span>
                                            </td>

                                            <td className="p-2 flex justify-center  mt-3 ">
                                                <button className="border border-[#137ADA] text-[#137ADA] px-5 py-1.5 flex items-center gap-2 rounded text-sm">
                                                    Shopify
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {stockPageItems.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="text-center py-6 text-gray-500"
                                            >
                                                No data found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* PAGINATION */}
                            {stockTotalPages > 1 && (
                                <div className="mt-4 flex items-center justify-end gap-2 flex-wrap">
                                    {/* Prev */}
                                    <Button
                                        size="sm"
                                        className="bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87]"
                                        disabled={stockPage === 1}
                                        onClick={() => setStockPage(stockPage - 1)}
                                    >
                                        Prev
                                    </Button>

                                    {/* Page Numbers */}
                                    {Array.from(
                                        { length: stockTotalPages },
                                        (_, i) => i + 1
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setStockPage(page)}
                                            className={`px-3 py-1 rounded border text-sm ${stockPage === page
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] text-white"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    {/* Next */}
                                    <Button
                                        size="sm"
                                        className="bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87]"
                                        disabled={stockPage === stockTotalPages}
                                        onClick={() => setStockPage(stockPage + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}

                        </>
                }


            </div>
        </div>
    );
};

export default StockOverview;

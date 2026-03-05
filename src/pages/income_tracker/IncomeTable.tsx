import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import GenerateReports from "./GenerateReports";
import TransactionDetails from "./TransactionDetails";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { useIncomeReportQuery } from "../../api/income-api/incomeApi";
import type { Transaction } from "../../lib/type/incomeType";



const ITEMS_PER_PAGE = 5;

const IncomeTable = () => {
    const [filterModal, setFilterModal] = useState(false);
    const [viewData, setViewData] = useState<number>();
    const [currentPage, setCurrentPage] = useState(1);

    // 🔍 filter state
    const [filters, setFilters] = useState({
        name: "",
        fromDate: "",
        toDate: "",
    });

    // tranzsition api

    const { data } = useIncomeReportQuery({});

    const allTransactions: Transaction[] = data?.report?.data || [];








    // ✅ filtering logic
    const filteredTransactions = allTransactions.filter((t) => {
        const matchName =
            !filters.name ||
            t.user_name.toLowerCase().includes(filters.name.toLowerCase());

        const matchFrom =
            !filters.fromDate || new Date(t.date) >= new Date(filters.fromDate);

        const matchTo =
            !filters.toDate || new Date(t.date) <= new Date(filters.toDate);

        return matchName && matchFrom && matchTo;
    });

    // pagination after filter
    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentTransactions = filteredTransactions.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    );


    const pageNumbers = Array.from(
        { length: totalPages },
        (_, i) => i + 1
    );

    return (
        <>
            <div className="pt-5 pb-9 bg-white rounded-[14px] shadow px-7 mt-7">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium">Recent Transactions</h2>
                    <Button
                        variant="outline"
                        className="flex gap-2"
                        onClick={() => setFilterModal(true)}
                    >
                        <Filter size={18} /> Filter
                    </Button>
                </div>

                {/* Filter Modal */}
                <Dialog open={filterModal} onOpenChange={setFilterModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Filter</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 mt-4">
                            {/* Search */}
                            <div>
                                <label className="text-sm font-medium">Search by Name</label>
                                <input
                                    type="text"
                                    placeholder="User name"
                                    value={filters.name}
                                    onChange={(e) =>
                                        setFilters({ ...filters, name: e.target.value })
                                    }
                                    className="w-full border rounded px-3 py-2 mt-1"
                                />
                            </div>

                            {/* Date range */}
                            <div>
                                <label className="text-sm font-medium">Date Range</label>
                                <div className="grid grid-cols-2 gap-3 mt-1">
                                    <input
                                        type="date"
                                        value={filters.fromDate}
                                        onChange={(e) =>
                                            setFilters({ ...filters, fromDate: e.target.value })
                                        }
                                        className="border rounded px-3 py-2"
                                    />
                                    <input
                                        type="date"
                                        value={filters.toDate}
                                        onChange={(e) =>
                                            setFilters({ ...filters, toDate: e.target.value })
                                        }
                                        className="border rounded px-3 py-2"
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setFilters({ name: "", fromDate: "", toDate: "" });
                                        setCurrentPage(1);
                                        setFilterModal(false);
                                    }}
                                    className="border px-6 py-2 rounded"
                                >
                                    Reset
                                </button>

                                <button
                                    onClick={() => {
                                        setCurrentPage(1);
                                        setFilterModal(false);
                                    }}
                                    className="bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] px-6 py-2 rounded"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-[#E9E9E9] h-12">
                            <tr className="text-center text-xs text-[#686868]">
                                <th className="py-3 px-4 border-b">Date</th>
                                <th className="py-3 px-4 border-b">Source</th>
                                <th className="py-3 px-4 border-b">Item</th>
                                <th className="py-3 px-4 border-b">User</th>
                                <th className="py-3 px-4 border-b">Amount</th>
                                <th className="py-3 px-4 border-b">Status</th>
                                <th className="py-3 px-4 border-b text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTransactions.map((t: Transaction) => (
                                <tr key={t.id} className="hover:bg-gray-50 text-center">
                                    <td className="py-3 px-4 border-b">{t.date}</td>
                                    <td className="py-3 px-4 border-b">{t.source}</td>
                                    <td className="py-3 px-4 border-b">{t.item_name}</td>
                                    <td className="py-3 px-4 border-b">{t.user_name}</td>
                                    <td className="py-3 px-4 border-b">{t.amount}</td>
                                    <td className="py-3 px-4 border-b">
                                        <span
                                            className={`px-3 py-1 rounded-[4px] text-xs  ${t.status === "Success"
                                                ? " bg-[#EAF6EC] text-[#24983F]  "
                                                : t.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 border-b text-center">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button
                                                    onClick={() => setViewData(t.id)}
                                                    className=" "
                                                >
                                                    <svg width="42" height="30" viewBox="0 0 42 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect x="0.5" y="0.5" width="41" height="29" rx="5.5" stroke="#989898" />
                                                        <path d="M21 12C20.2044 12 19.4413 12.3161 18.8787 12.8787C18.3161 13.4413 18 14.2044 18 15C18 15.7956 18.3161 16.5587 18.8787 17.1213C19.4413 17.6839 20.2044 18 21 18C21.7956 18 22.5587 17.6839 23.1213 17.1213C23.6839 16.5587 24 15.7956 24 15C24 14.2044 23.6839 13.4413 23.1213 12.8787C22.5587 12.3161 21.7956 12 21 12ZM21 20C19.6739 20 18.4021 19.4732 17.4645 18.5355C16.5268 17.5979 16 16.3261 16 15C16 13.6739 16.5268 12.4021 17.4645 11.4645C18.4021 10.5268 19.6739 10 21 10C22.3261 10 23.5979 10.5268 24.5355 11.4645C25.4732 12.4021 26 13.6739 26 15C26 16.3261 25.4732 17.5979 24.5355 18.5355C23.5979 19.4732 22.3261 20 21 20ZM21 7.5C16 7.5 11.73 10.61 10 15C11.73 19.39 16 22.5 21 22.5C26 22.5 30.27 19.39 32 15C30.27 10.61 26 7.5 21 7.5Z" fill="#B9B9B9" />
                                                    </svg>
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle className="text-lg font-semibold">
                                                        Transaction Details
                                                    </DialogTitle>
                                                </DialogHeader>
                                                {viewData && (
                                                    <TransactionDetails viewId={viewData} />
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>



                {/* Pagination */}
                <div className="flex justify-end items-center mt-4">


                    <div className="flex items-center gap-2">
                        {/* Previous */}
                        <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                        >

                            <GrFormPrevious size={30} />
                        </Button>

                        {/* Page Numbers */}
                        {pageNumbers.map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 rounded border text-sm transition
          ${currentPage === page
                                        ? " bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] text-black font-medium"
                                        : "border-gray-300 hover:bg-gray-100"
                                    }
        `}
                            >
                                {page}
                            </button>
                        ))}

                        {/* Next */}
                        <Button
                            variant="outline"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                        >
                            <MdNavigateNext size={30} />
                        </Button>
                    </div>
                </div>


            </div>

            <GenerateReports />
        </>
    );
};

export default IncomeTable;

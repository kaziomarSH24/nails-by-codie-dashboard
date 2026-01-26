import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import GenerateReports from "./GenerateReports";
import TransactionDetails from "./TransactionDetails";
const allTransactions = [
    { id: 1, date: "2025-10-23", source: "PayPal", item: "Subscription Plan", user: "John Doe", amount: "$120.00", status: "Completed" },
];
const ITEMS_PER_PAGE = 5;
const IncomeTable = () => {
    const [filterModal, setFilterModal] = useState(false);
    const [viewData, setViewData] = useState<{ id: number; date: string; source: string; item: string; user: string; amount: string; status: string } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(allTransactions.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentTransactions = allTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    return (
        <>
            <div className="pt-5 pb-9 bg-white rounded-[14px] shadow shadow-[#00000033] px-7 mt-7">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium text-[#3A3734]">Recent Transactions</h2>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 border border-gray-400"
                        onClick={() => setFilterModal(true)}
                    >
                        <Filter size={18} /> Filter
                    </Button>
                </div>
                {/* Filter Modal */}
                <Dialog open={filterModal} onOpenChange={setFilterModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">
                                <div className=" flex items-center gap-x-2 " >
                                    <span className=" " >
                                        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.0011 9V16.88C10.0411 17.18 9.94111 17.5 9.71111 17.71C9.61859 17.8027 9.50871 17.8762 9.38773 17.9264C9.26676 17.9766 9.13708 18.0024 9.00611 18.0024C8.87514 18.0024 8.74546 17.9766 8.62448 17.9264C8.50351 17.8762 8.39362 17.8027 8.30111 17.71L6.29111 15.7C6.18211 15.5933 6.09922 15.4629 6.04892 15.319C5.99861 15.175 5.98225 15.0213 6.00111 14.87V9H5.97111L0.211108 1.62C0.0487158 1.41153 -0.0245586 1.14726 0.00729555 0.88493C0.0391497 0.622602 0.173543 0.383546 0.381108 0.22C0.571108 0.08 0.781108 0 1.00111 0H15.0011C15.2211 0 15.4311 0.08 15.6211 0.22C15.8287 0.383546 15.9631 0.622602 15.9949 0.88493C16.0268 1.14726 15.9535 1.41153 15.7911 1.62L10.0311 9H10.0011Z" fill="#3A3734" />
                                        </svg>
                                    </span>
                                    <span className=" text-[#3A3734] text-lg font-medium " >Filter</span>
                                </div>
                            </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 space-y-4">
                            {/* Search by Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Search by Name
                                </label>
                                <div className="relative">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 104.5 17 6.5 6.5 0 0017 10.5z"
                                        />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search by user name"
                                        className="w-full border border-[#B9B9B9] rounded-md px-3 py-2 text-sm bg-gray-50  focus:outline-none focus:ring-0"
                                    />
                                </div>
                            </div>
                            {/* Date Range (From & To) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date Range
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">From</label>
                                        <input
                                            type="date"
                                            className="w-full border border-[#B9B9B9] rounded-md px-3 py-2 text-sm bg-gray-50  focus:outline-none focus:ring-0"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">To</label>
                                        <input
                                            type="date"
                                            className="w-full border border-[#B9B9B9] rounded-md px-3 py-2 text-sm bg-gray-50  focus:outline-none focus:ring-0"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Buttons */}
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        // Reset logic (you can clear filters here)
                                        setFilterModal(false);
                                    }}
                                    className=" border border-[#F2DA87] py-3 px-14 rounded-[43px] text-[#3A3734] font-medium "
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => setFilterModal(false)}
                                    className="bg-gradient-to-b from-[#FFD700] to-[#E6BE00] hover:opacity-90 transition duration-200 shadow-sm text-[#3A3734] font-medium  py-3 px-14 rounded-[43px]"
                                >
                                    Apply Filter
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                {/* Table */}
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
                            {currentTransactions.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50 text-center">
                                    <td className="py-3 px-4 border-b">{t.date}</td>
                                    <td className="py-3 px-4 border-b">{t.source}</td>
                                    <td className="py-3 px-4 border-b">{t.item}</td>
                                    <td className="py-3 px-4 border-b">{t.user}</td>
                                    <td className="py-3 px-4 border-b">{t.amount}</td>
                                    <td className="py-3 px-4 border-b">
                                        <span
                                            className={`px-3 py-1 rounded-[4px] text-xs  ${t.status === "Completed"
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
                                                    onClick={() => setViewData(t)}
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
                                                    <TransactionDetails />
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
                <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-600">
                        Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, allTransactions.length)} of {allTransactions.length}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={handlePrev}
                            className="border-gray-400"
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            disabled={currentPage === totalPages}
                            onClick={handleNext}
                            className="border-gray-400"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
            <GenerateReports></GenerateReports>
        </>
    );
};
export default IncomeTable;

also give me filter and modal search filter give me full code
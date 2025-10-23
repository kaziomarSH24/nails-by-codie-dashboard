import React, { useState } from "react";
import { Filter, Eye } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import GenerateReports from "./GenerateReports";

const allTransactions = [
    { id: 1, date: "2025-10-23", source: "PayPal", item: "Subscription Plan", user: "John Doe", amount: "$120.00", status: "Completed" },
    { id: 2, date: "2025-10-22", source: "Stripe", item: "Course Payment", user: "Jane Smith", amount: "$85.00", status: "Completed" },
    { id: 3, date: "2025-10-21", source: "Bank Transfer", item: "Product Purchase", user: "Alex Johnson", amount: "$250.00", status: "Completed" },
    { id: 4, date: "2025-10-20", source: "PayPal", item: "E-book Purchase", user: "Chris Lee", amount: "$25.00", status: "Completed" },
    { id: 5, date: "2025-10-19", source: "Stripe", item: "Membership", user: "Emma Brown", amount: "$40.00", status: "Completed" },
    { id: 6, date: "2025-10-18", source: "Payoneer", item: "Service Fee", user: "Daniel Kim", amount: "$60.00", status: "Completed" },
    { id: 7, date: "2025-10-17", source: "Bank Transfer", item: "Consulting", user: "Sophia Wilson", amount: "$500.00", status: "Completed" },
    { id: 8, date: "2025-10-16", source: "Stripe", item: "Workshop Fee", user: "Michael Clark", amount: "$75.00", status: "Completed" },
    { id: 9, date: "2025-10-15", source: "PayPal", item: "Course Payment", user: "Olivia Davis", amount: "$120.00", status: "Completed" },
    { id: 10, date: "2025-10-14", source: "Payoneer", item: "Product Purchase", user: "Noah Taylor", amount: "$200.00", status: "Completed" },
    { id: 11, date: "2025-10-13", source: "Bank Transfer", item: "Software License", user: "Liam Anderson", amount: "$300.00", status: "Completed" },
];

const ITEMS_PER_PAGE = 5;

const IncomeTable = () => {
    const [filterModal, setFilterModal] = useState(false);
    const [viewData, setViewData] = useState(null);
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
                                                    <>
                                                        <div className=" rounded-[6px]" >
                                                            <div className="space-y-2 mt-2 border border-[#B9B9B9]  rounded-[6px] p-4 ">
                                                                {/* imgage and info  */}
                                                                <div className=" flex items-center gap-x-5 mb-6  " >
                                                                    <div>
                                                                        <img src="/images/logo/user.png" alt="" className=" w-20 h-20 rounded-full " />
                                                                    </div>
                                                                    <div className=" space-y-2 " >
                                                                        <h1 className=" text-lg font-medium " >Emma Johnson</h1>
                                                                        <p className=" text-xs " >emmajohnson@gmail.com</p>
                                                                    </div>
                                                                </div>
                                                                <div className=" space-y-4    " >
                                                                    <div className=" flex justify-between items-center " >
                                                                        <h1 className=" text-sm " >Transaction ID</h1>
                                                                        <p className=" text-sm " >RQS12346689</p>
                                                                    </div>
                                                                    <div className=" flex justify-between items-center " >
                                                                        <h1 className=" text-sm " >Transaction Date</h1>
                                                                        <p className=" text-sm " >12 Jun, 11:28 AM</p>
                                                                    </div>
                                                                    <div className=" flex justify-between items-center " >
                                                                        <h1 className=" text-sm " >Shopify Order</h1>
                                                                        <p className=" text-sm " >#20111</p>
                                                                    </div>
                                                                    <div className=" flex justify-between items-center " >
                                                                        <h1 className=" text-sm " >Status</h1>
                                                                        <button className=" bg-[#EAF6EC] py-1 px-3 rounded-[4px] text-[#24983F] text-sm " >Completed</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className=" bg-[#E9E9E9] px-4 py-3 rounded-[6px] " >
                                                            <h1>Amount Breakdown</h1>
                                                            <div className=" mt-4 " >

                                                                <div className=" space-y-4 " >
                                                                    <div className=" flex justify-between " >
                                                                        <h1>Subtotal</h1>
                                                                        <p>$45.00</p>
                                                                    </div>
                                                                    <div className=" flex justify-between " >
                                                                        <h1>Tax</h1>
                                                                        <p>$3.00</p>
                                                                    </div>
                                                                    <div className=" flex justify-between " >
                                                                        <h1>Processing Fee</h1>
                                                                        <p>$1.50</p>
                                                                    </div>
                                                                    <div className=" border border-[#989898] " ></div>
                                                                    <div className=" flex justify-between " >
                                                                        <h1 className=" font-medium " >Total</h1>
                                                                        <p className=" font-medium " >$48.00</p>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div className="px-6" >
                                                            <h1 className=" font-medium " >Related Links</h1>
                                                            <div className=" flex itemce justify-between mt-5 " >
                                                                <h1 className=" text-sm " >Shopify Order</h1>
                                                                <p className=" text-xs text-[#911DC7F0] " >#2011</p>
                                                            </div>
                                                        </div>


                                                        <div className=" flex justify-end mt-5 " >
                                                            <button className=" flex items-center gap-x-3  px-3.5 py-1.5 rounded-[23px] text-sm font-medium bg-gradient-to-b from-[#FFD700] to-[#E6BE00] hover:opacity-90 transition duration-200 shadow-sm" > <span><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M7 10.577L3.461 7.039L4.169 6.319L6.5 8.65V0H7.5V8.65L9.83 6.32L10.539 7.039L7 10.577ZM1.616 14C1.15533 14 0.771 13.846 0.463 13.538C0.155 13.23 0.000666667 12.8453 0 12.384V9.961H1V12.384C1 12.538 1.064 12.6793 1.192 12.808C1.32 12.9367 1.461 13.0007 1.615 13H12.385C12.5383 13 12.6793 12.936 12.808 12.808C12.9367 12.68 13.0007 12.5387 13 12.384V9.961H14V12.384C14 12.8447 13.846 13.229 13.538 13.537C13.23 13.845 12.8453 13.9993 12.384 14H1.616Z" fill="black" />
                                                            </svg>
                                                            </span> Export</button>
                                                        </div>











                                                    </>
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
            </div>
            <GenerateReports></GenerateReports>
        </>
    );
};

export default IncomeTable;

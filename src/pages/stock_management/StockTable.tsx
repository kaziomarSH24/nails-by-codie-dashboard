"use client";
import { useState, useMemo } from "react";



import { Button } from "../../components/ui/button";


type StockStatus = "Low Stock" | "In Stock" | "Out of Stock";
type RequestStatus = "Pending" | "Approved";

interface StockItem {
    id: number;
    product: string;
    sku: string;
    currentStock: number;
    lowStockAlert: number;
    status: StockStatus;
}

interface RestockRequest {
    id: number;
    techName: string;
    product: string;
    currentQty: number;
    requestedQty: number;
    date: string;
    status: RequestStatus;
}

const stockData: StockItem[] = [
    { id: 1, product: "Product A", sku: "SKU001", currentStock: 10, lowStockAlert: 5, status: "In Stock" },
    { id: 2, product: "Product B", sku: "SKU002", currentStock: 2, lowStockAlert: 5, status: "Low Stock" },
    { id: 3, product: "Product C", sku: "SKU003", currentStock: 0, lowStockAlert: 5, status: "Out of Stock" },
    { id: 4, product: "Product D", sku: "SKU004", currentStock: 12, lowStockAlert: 5, status: "In Stock" },
    { id: 5, product: "Product E", sku: "SKU005", currentStock: 1, lowStockAlert: 5, status: "Low Stock" },
];

const restockRequests: RestockRequest[] = [
    { id: 1, techName: "John Doe", product: "Product A", currentQty: 10, requestedQty: 20, date: "2025-10-23", status: "Pending" },
    { id: 2, techName: "Jane Smith", product: "Product B", currentQty: 2, requestedQty: 10, date: "2025-10-22", status: "Approved" },
    { id: 3, techName: "Alice", product: "Product C", currentQty: 0, requestedQty: 5, date: "2025-10-20", status: "Pending" },
    { id: 4, techName: "Bob", product: "Product D", currentQty: 8, requestedQty: 15, date: "2025-10-21", status: "Approved" },
];

const ITEMS_PER_PAGE = 2;

export default function StockManagement() {
    const [search, setSearch] = useState("");
    console.log(setSearch)
    const [modalOpen, setModalOpen] = useState(false);
    console.log(modalOpen)
    console.log(setModalOpen)
    const [modalData, setModalData] = useState<StockItem | RestockRequest | null>(null);
    console.log(modalData)
    console.log(setModalData)
    const [stockPage, setStockPage] = useState(1);
    const [requestPage, setRequestPage] = useState(1);
    const [activeTab, setActiveTab] = useState<"stock" | "request">("stock");

    // const openModal = (data) => {
    //     setModalData(data);
    //     setModalOpen(true);
    // };

    // console.log(open)

    // Filtered & paginated stock data
    const filteredStock = useMemo(() =>
        stockData.filter(item =>
            item.product.toLowerCase().includes(search.toLowerCase()) ||
            item.sku.toLowerCase().includes(search.toLowerCase())
        ), [search]
    );
    const stockTotalPages = Math.ceil(filteredStock.length / ITEMS_PER_PAGE);
    const stockPageItems = filteredStock.slice((stockPage - 1) * ITEMS_PER_PAGE, stockPage * ITEMS_PER_PAGE);

    // Filtered & paginated restock requests
    const filteredRequests = useMemo(() =>
        restockRequests.filter(req =>
            req.product.toLowerCase().includes(search.toLowerCase()) ||
            req.techName.toLowerCase().includes(search.toLowerCase())
        ), [search]
    );
    const requestTotalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
    const requestPageItems = filteredRequests.slice((requestPage - 1) * ITEMS_PER_PAGE, requestPage * ITEMS_PER_PAGE);

    return (
        <div className=" pt-5 pb-9 bg-white rounded-[14px] shadow shadow-[#00000033] px-7 ">


            {/* Tabs */}
            <div className="flex gap-2 mb-5 border-b border-gray-300">
                <button
                    className={`text-lg font-medium pb-2 ${activeTab === "stock"
                        ? "text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text border-b-2 border-[#F2DA87]"
                        : "text-[#000000] border-b-2 border-transparent "
                        }`}
                    onClick={() => setActiveTab("stock")}
                >
                    Stock Overview
                </button>
                <button
                    className={`text-lg font-medium pb-2 ${activeTab === "request"
                        ? "text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text border-b-2 border-[#F2DA87]"
                        : "text-[#000000] border-b-2 border-transparent "
                        }`}
                    onClick={() => setActiveTab("request")}
                >
                    Restock Requests
                </button>
            </div>

            {/* Tables */}
            {activeTab === "stock" && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse  ">
                        <thead className="bg-[#E9E9E9] text-[#686868] text-xs py-2 h-12 ">
                            <tr>
                                <th className="p-2 border-b  text-left">Product</th>
                                <th className="p-2 border-b  text-center">SKU</th>
                                <th className="p-2 border-b  text-center">Current Stock</th>
                                <th className="p-2 border-b  text-center">Low-Stock Alert</th>
                                <th className="p-2 border-b  text-center">Status</th>
                                <th className="p-2 border-b  text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockPageItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="border-b p-2 text-sm ">{item.product}</td>
                                    <td className="border-b p-2 text-center ">{item.sku}</td>
                                    <td className="border-b p-2 text-center">{item.currentStock}</td>
                                    <td className="border-b p-2 text-center "><button className="bg-[#EAF6EC] py-1 px-3 text-[#24983F] text-xs rounded-[4px]  "  >Low Stock</button></td>
                                    <td className={`border-b p-2 font-semibold text-center `}> <button className="bg-[#EAF6EC] py-1 px-3 text-[#24983F] text-xs rounded-[4px]  " >Synced</button> </td>
                                    <td className="border-b p-2 flex justify-center  gap-2">
                                        <button className=" border border-[#137ADA] text-[#137ADA] px-5  py-1.5 flex items-center gap-x-3 rounded-[6px] text-sm " >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13.5 10.5L21 3M21 3H16M21 3V8M21 14V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H10" stroke="#2B6FBD" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            <span>Shopify</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="mt-2 flex justify-end space-x-2">
                        <Button size="sm" disabled={stockPage === 1} onClick={() => setStockPage(stockPage - 1)}>Prev</Button>
                        <span className="px-2 py-1 border rounded">{stockPage} / {stockTotalPages}</span>
                        <Button size="sm" disabled={stockPage === stockTotalPages} onClick={() => setStockPage(stockPage + 1)}>Next</Button>
                    </div>
                </div>
            )}

            {activeTab === "request" && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse ">
                        <thead className="bg-[#E9E9E9] h-12 text-[#686868] text-xs ">
                            <tr>
                                <th className="border-b p-2 text-center">Tech Name</th>
                                <th className="border-b p-2 text-center">Product</th>
                                <th className="border-b p-2 text-center">Current Qty</th>
                                <th className="border-b p-2 text-center">Requested Qty</th>
                                <th className="border-b p-2 text-center">Date</th>
                                <th className="border-b p-2 text-center">Status</th>
                                <th className="border-b p-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requestPageItems.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50">
                                    <td className="border-b p-2 text-center text-sm ">{req.techName}</td>
                                    <td className="border-b p-2 text-center text-sm ">{req.product}</td>
                                    <td className="border-b p-2 text-center text-sm ">{req.currentQty}</td>
                                    <td className="border-b p-2 text-center">{req.requestedQty}</td>
                                    <td className="border-b p-2 text-center">{req.date}</td>
                                    <td className={`border-b p-2 font-semibold text-center `}> <button className={` rounded-[4px] text-sm px-4 py-1 ${req.status === "Pending" ? "bg-[#F5F6EA] text-[#988E24]  " : " bg-[#ECF6EA] text-[#2E9824]  "}`} >{req.status}</button> </td>
                                    <td className="border-b p-2 flex gap-2 justify-center  ">
                                        <button className=" border border-[#A6EA8D] bg-[#EDFFEE] rounded-[6px] px-1.5 py-1  " >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.55008 17.3081L4.58008 12.3381L5.29408 11.6251L9.55008 15.8811L18.7061 6.7251L19.4191 7.4391L9.55008 17.3081Z" fill="#21A107" />
                                            </svg>

                                        </button>
                                        <button className=" border border-[#D77777] bg-[#FFDFDF] rounded-[6px] px-2  py-1  " >
                                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0.5 0.5L12.5 12.5M12.5 0.5L0.5 12.5" stroke="#F02525" stroke-linecap="round" />
                                            </svg>


                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="mt-2 flex justify-end space-x-2">
                        <Button size="sm" disabled={requestPage === 1} onClick={() => setRequestPage(requestPage - 1)}>Prev</Button>
                        <span className="px-2 py-1 border rounded">{requestPage} / {requestTotalPages}</span>
                        <Button size="sm" disabled={requestPage === requestTotalPages} onClick={() => setRequestPage(requestPage + 1)}>Next</Button>
                    </div>
                </div>
            )}

            {/* Modal */}
            {/* <Modal open={modalOpen} onOpenChange={setModalOpen}>
                <ModalContent>
                    <ModalHeader>
                        <h3 className="text-lg font-bold">Details</h3>
                    </ModalHeader>
                    <ModalBody>
                        <pre className="text-sm">{JSON.stringify(modalData, null, 2)}</pre>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => setModalOpen(false)}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal> */}
        </div>
    );
}

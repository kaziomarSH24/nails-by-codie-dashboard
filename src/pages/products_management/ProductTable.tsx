"use client";

import React, { useState } from "react";
import { Eye, RefreshCcw, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";


const ProductTable = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [open, setOpen] = useState(false);

    const itemsPerPage = 5;

    const products = [
        { name: "Wireless Headphones", stock: 25, price: "$120", status: "Synced", date: "2025-10-20", description: "Noise-cancelling Bluetooth headphones with 20hr battery life." },
        { name: "Smart Watch", stock: 10, price: "$85", status: "Not Synced", date: "2025-10-19", description: "Fitness smart watch with heart rate and sleep tracking." },
        { name: "Bluetooth Speaker", stock: 50, price: "$60", status: "Synced", date: "2025-10-18", description: "Portable speaker with waterproof design and deep bass." },
        { name: "Laptop Bag", stock: 15, price: "$40", status: "Not Synced", date: "2025-10-17", description: "Durable laptop bag with anti-theft zippers and USB charging port." },
        { name: "Gaming Mouse", stock: 30, price: "$35", status: "Synced", date: "2025-10-16", description: "RGB gaming mouse with adjustable DPI and ergonomic grip." },
        { name: "USB-C Cable", stock: 60, price: "$10", status: "Not Synced", date: "2025-10-15", description: "Durable braided USB-C to USB-A fast charging cable." },
    ];

    // Filtered data
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    // Handle View Click
    const handleView = (product) => {
        setSelectedProduct(product);
        setOpen(true);
    };

    // Handle Sync Toggle
    const handleSync = (index) => {
        const updated = [...products];
        updated[index].status =
            updated[index].status === "Synced" ? "Not Synced" : "Synced";
    };

    return (
        <div className=" py-8 px-7 shadow shadow-[#00000033] rounded-2xl bg-white ">
            <div className="w-full mx-auto">
                <h1 className=" font-medium text-3xl  " >Product Management</h1>
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 mt-9 ">

                    {/* Search Bar */}
                    <div className="relative w-[80%]  ">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search product by name"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-3 py-3 px-8 border border-[#B9B9B9] rounded-[5.95px] focus:ring-0 focus:outline-none text-sm"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full  text-left border ">
                        <thead className="bg-[#E9E9E9] text-[#686868] text-xs ">
                            <tr>
                                <th className="px-4 py-3">Product Name</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Date Added</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((product, index) => (
                                <tr key={index} className="border-t text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-4 py-3 flex items-center gap-x-1.5  ">
                                        <img src="/images/product/product-1.jpg" className=" w-9 h-9 rounded-full" />
                                        {product.name}</td>
                                    <td className="px-4 py-3">{product.stock}</td>
                                    <td className="px-4 py-3">{product.price}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-full ${product.status === "Synced"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{product.date}</td>
                                    <td className="px-4 py-3 text-center flex justify-center gap-3">
                                        <button
                                            className=" border border-[#989898] rounded-[6px] py-1.5 px-2 "
                                            onClick={() => handleView(product)}
                                        >
                                            <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11 4.5C10.2044 4.5 9.44129 4.81607 8.87868 5.37868C8.31607 5.94129 8 6.70435 8 7.5C8 8.29565 8.31607 9.05871 8.87868 9.62132C9.44129 10.1839 10.2044 10.5 11 10.5C11.7956 10.5 12.5587 10.1839 13.1213 9.62132C13.6839 9.05871 14 8.29565 14 7.5C14 6.70435 13.6839 5.94129 13.1213 5.37868C12.5587 4.81607 11.7956 4.5 11 4.5ZM11 12.5C9.67392 12.5 8.40215 11.9732 7.46447 11.0355C6.52678 10.0979 6 8.82608 6 7.5C6 6.17392 6.52678 4.90215 7.46447 3.96447C8.40215 3.02678 9.67392 2.5 11 2.5C12.3261 2.5 13.5979 3.02678 14.5355 3.96447C15.4732 4.90215 16 6.17392 16 7.5C16 8.82608 15.4732 10.0979 14.5355 11.0355C13.5979 11.9732 12.3261 12.5 11 12.5ZM11 0C6 0 1.73 3.11 0 7.5C1.73 11.89 6 15 11 15C16 15 20.27 11.89 22 7.5C20.27 3.11 16 0 11 0Z" fill="#B9B9B9" />
                                            </svg>

                                        </button>
                                        <button
                                            className=" border border-[#989898] rounded-[6px] py-1.5 px-2 "

                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4.654 19.346V18.346H7.75L6.696 17.304C5.93067 16.5386 5.37333 15.7086 5.024 14.814C4.67467 13.9206 4.5 13.0126 4.5 12.09C4.5 10.4833 4.958 9.02962 5.874 7.72895C6.79 6.42829 7.99867 5.49929 9.5 4.94195V6.00395C8.28667 6.51395 7.31667 7.32195 6.59 8.42795C5.86333 9.53395 5.5 10.754 5.5 12.088C5.5 12.9026 5.65467 13.6926 5.964 14.458C6.27267 15.2246 6.75267 15.9336 7.404 16.585L8.423 17.604V14.577H9.423V19.347L4.654 19.346ZM14.5 19.058V17.996C15.7133 17.486 16.6833 16.678 17.41 15.572C18.1367 14.466 18.5 13.246 18.5 11.912C18.5 11.0973 18.3457 10.3073 18.037 9.54195C17.7277 8.77529 17.2477 8.06662 16.597 7.41595L15.577 6.39595V9.42295H14.577V4.65295H19.347V5.65295H16.25L17.304 6.69595C18.0693 7.46129 18.6267 8.29129 18.976 9.18595C19.3253 10.08 19.5 10.9886 19.5 11.912C19.5 13.5186 19.042 14.972 18.126 16.272C17.21 17.572 16.0013 18.5006 14.5 19.058Z" fill="#686868" />
                                            </svg>


                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
                    <p>
                        Showing {startIndex + 1}–
                        {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of{" "}
                        {filteredProducts.length} products
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md border ${currentPage === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-100"
                                }`}
                        >
                            Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 rounded-md border ${currentPage === i + 1
                                    ? "bg-yellow-400 text-white border-yellow-400"
                                    : "bg-white hover:bg-gray-100"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md border ${currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-100"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Product View Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className=" px-12 max-w-2xl  ">


                    {selectedProduct && (
                        <div className=" flex items-start  gap-x-7 " >
                            <div className=" w-[50%] " >
                                <img src="/images/product/product-1.jpg" className=" w-[304px] h-[249px] rounded-[9px] " alt="" />
                            </div>
                            <div className="space-y-4 w-[50%] ">
                                {/* product name  */}
                                <div>
                                    <p className=" text-sm " >Name</p>
                                    <p className=" text-[16px] font-medium mt-1.5 " >{selectedProduct.name}</p>
                                </div>
                                <div>

                                    <p className="text-sm " >Price</p>
                                    <p className=" mt-1.5 text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text font-medium text-xl " >
                                        ${selectedProduct.stock}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm " >Stock Status</p>
                                    <p className=" text-[16px] font-medium mt-1.5 " >8 in stock</p>
                                </div>

                                <div>
                                    <p className="text-sm " >Description</p>
                                    <p className="  text-[#989898] mt-1.5 text-sm  " >{selectedProduct.description}</p>
                                </div>




                                <div>
                                    <p className=" text-sm " >Last Synced</p>
                                    <p><span className="font-medium text-[16px] "></span> October 18, 2025 at 02:45 PM</p>
                                </div>
                            </div>
                        </div>

                    )}
                    <div className=" border border-[#B9B9B9] mt-6 " ></div>
                    <div className=" flex justify-end " >
                        <button className=" py-1.5 px-3.5 rounded-[42px] bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] text-[#1E1E1E] " >Edit Product</button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductTable;

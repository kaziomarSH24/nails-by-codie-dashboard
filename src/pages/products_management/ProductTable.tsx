import { useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { useAllProductQuery, useSynceProductMutation } from "../../api/product-api/productApi";
import type { ProductType } from "../../lib/type/productType";
import { errorMessage } from "../../lib/error/errorMsg";
import { toast } from "sonner";
import ProductSkeleton from "../../components/skeleton/ProductSkeleton";

const ProductTable = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState<ProductType | undefined>(undefined);
    const [open, setOpen] = useState(false);

    // Matches per_page config or custom query limits
    const itemsPerPage = 10;

    // 1. Pass pagination parameters to your RTK Query hook
    const { data, isLoading, isFetching, refetch } = useAllProductQuery({
        page: currentPage,
        per_page: itemsPerPage,
        search: search // Assuming your API supports filtering at endpoint level
    });

    const products: ProductType[] = data?.data || [];

    // 2. Derive structural metadata directly from backend pagination payload
    const totalPages = data?.meta?.last_page || 1;

    // Handle View Click
    const handleView = (product: ProductType) => {
        setSelectedProduct(product);
        setOpen(true);
    };

    // Sync individual product
    const [synceProduct] = useSynceProductMutation();

    const handleSyncProduct = async (product: ProductType) => {
        try {
            const res = await synceProduct({ id: product?.id }).unwrap();
            if (res) {
                toast.success(res?.message || "Product synced successfully");
                refetch();
            }
        } catch (error) {
            errorMessage(error);
        }
    };

    if (isLoading) {
        return (
            <div>
                <ProductSkeleton />
            </div>
        );
    }

    return (
        <div className="py-8 px-7 shadow shadow-[#00000033] rounded-2xl bg-white">
            <div className="w-full mx-auto">
                <h1 className="font-medium text-3xl">Product Management</h1>

                {/* Header / Search Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 mt-9">
                    <div className="relative w-[80%]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search product by name"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1); // Reset to page 1 on active text modifications
                            }}
                            className="w-full pl-10 pr-3 py-3 px-8 border border-[#B9B9B9] rounded-[5.95px] focus:ring-0 focus:outline-none text-sm"
                        />
                    </div>
                </div>

                {/* Table Layout Container */}
                <div className={`overflow-x-auto transition-opacity duration-150 ${isFetching ? "opacity-50" : "opacity-100"}`}>
                    <table className="w-full text-left">
                        <thead className="bg-[#E9E9E9] text-[#686868] text-xs">
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
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product, index) => (
                                    <tr key={product?.id || index} className="text-sm font-medium hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100">
                                        {/* Product Title & Image */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-x-3">
                                                <img
                                                    src={product?.image_url || "/placeholder.png"}
                                                    alt={product?.title || "Product"}
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                                />
                                                <span className="text-gray-900 font-semibold">{product?.title}</span>
                                            </div>
                                        </td>

                                        {/* Stock Quantity */}
                                        <td className="px-4 py-3 text-gray-600">{product?.stock_quantity}</td>

                                        {/* Price */}
                                        <td className="px-4 py-3 text-gray-900 font-semibold">${product?.price}</td>

                                        {/* Status Badge */}
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize ${product?.status?.toLowerCase() === "synced"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {product?.status}
                                            </span>
                                        </td>

                                        {/* Created At Date */}
                                        <td className="px-4 py-3 text-gray-500">
                                            {product?.created_at ? new Date(product.created_at).toLocaleDateString() : "N/A"}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex justify-center items-center gap-x-2.5">
                                                <button
                                                    type="button"
                                                    className="border border-[#989898] hover:bg-gray-100 rounded-[6px] py-1.5 px-2 transition-colors cursor-pointer"
                                                    onClick={() => handleView(product)}
                                                    title="View Product"
                                                >
                                                    <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M11 4.5C10.2044 4.5 9.44129 4.81607 8.87868 5.37868C8.31607 5.94129 8 6.70435 8 7.5C8 8.29565 8.31607 9.05871 8.87868 9.62132C9.44129 10.1839 10.2044 10.5 11 10.5C11.7956 10.5 12.5587 10.1839 13.1213 9.62132C13.6839 9.05871 14 8.29565 14 7.5C14 6.70435 13.6839 5.94129 13.1213 5.37868C12.5587 4.81607 11.7956 4.5 11 4.5ZM11 12.5C9.67392 12.5 8.40215 11.9732 7.46447 11.0355C6.52678 10.0979 6 8.82608 6 7.5C6 6.17392 6.52678 4.90215 7.46447 3.96447C8.40215 3.02678 9.67392 2.5 11 2.5C12.3261 2.5 13.5979 3.02678 14.5355 3.96447C15.4732 4.90215 16 6.17392 16 7.5C16 8.82608 15.4732 10.0979 14.5355 11.0355C13.5979 11.9732 12.3261 12.5 11 12.5ZM11 0C6 0 1.73 3.11 0 7.5C1.73 11.89 6 15 11 15C16 15 20.27 11.89 22 7.5C20.27 3.11 16 0 11 0Z" fill="#B9B9B9" />
                                                    </svg>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleSyncProduct(product)}
                                                    className="border border-[#989898] hover:bg-gray-100 rounded-[6px] py-1.5 px-2 transition-colors cursor-pointer"
                                                    title="Sync Product"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4.654 19.346V18.346H7.75L6.696 17.304C5.93067 16.5386 5.37333 15.7086 5.024 14.814C4.67467 13.9206 4.5 13.0126 4.5 12.09C4.5 10.4833 4.958 9.02962 5.874 7.72895C6.79 6.42829 7.99867 5.49929 9.5 4.94195V6.00395C8.28667 6.51395 7.31667 7.32195 6.59 8.42795C5.86333 9.53395 5.5 10.754 5.5 12.088C5.5 12.9026 5.65467 13.6926 5.964 14.458C6.27267 15.2246 6.75267 15.9336 7.404 16.585L8.423 17.604V14.577H9.423V19.347L4.654 19.346ZM14.5 19.058V17.996C15.7133 17.486 16.6833 16.678 17.41 15.572C18.1367 14.466 18.5 13.246 18.5 11.912C18.5 11.0973 18.3457 10.3073 18.037 9.54195C17.7277 8.77529 17.2477 8.06662 16.597 7.41595L15.577 6.39595V9.42295H14.577V4.65295H19.347V5.65295H16.25L17.304 6.69595C18.0693 7.46129 18.6267 8.29129 18.976 9.18595C19.3253 10.08 19.5 10.9886 19.5 11.912C19.5 13.5186 19.042 14.972 18.126 16.272C17.21 17.572 16.0013 18.5006 14.5 19.058Z" fill="#686868" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-end items-center mt-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md border ${currentPage === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white hover:bg-gray-100 cursor-pointer"
                                }`}
                        >
                            Prev
                        </button>

                        {/* Renders a limited sliding page range window around active context */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                            .map((page, idx, arr) => {
                                return (
                                    <div key={page} className="flex items-center gap-2">
                                        {idx > 0 && arr[idx - 1] !== page - 1 && <span className="text-gray-400">...</span>}
                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1 rounded-md border font-medium cursor-pointer transition-all ${currentPage === page
                                                    ? "bg-gradient-to-b from-[#F2DA87] via-[#91741A] to-[#F2DA87] text-gray-900 border-[#91741A]"
                                                    : "bg-white text-gray-600 hover:bg-gray-100 border-gray-200"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    </div>
                                );
                            })}

                        <button
                            type="button"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className={`px-3 py-1 rounded-md border ${currentPage === totalPages || totalPages === 0
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white hover:bg-gray-100 cursor-pointer"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Product View Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="px-12 max-w-2xl bg-slate-100">
                    {selectedProduct && (
                        <div className="flex items-start gap-x-7">
                            <div className="w-[50%]">
                                <img
                                    src={selectedProduct?.image_url || "/placeholder.png"}
                                    className="w-[304px] h-[249px] rounded-[9px] object-cover"
                                    alt={selectedProduct?.title}
                                />
                            </div>
                            <div className="space-y-4 w-[50%]">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="text-[16px] font-medium mt-1.5 text-gray-900">{selectedProduct.title}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Price</p>
                                    <p className="mt-1.5 text-transparent bg-gradient-to-r from-[#F2DA87] via-[#91741A] to-[#F2DA87] bg-clip-text font-semibold text-xl">
                                        ${selectedProduct.price}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Stock Status</p>
                                    <p className="text-[16px] font-medium mt-1.5 text-gray-900">
                                        {selectedProduct.stock_quantity} in stock
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Last Synced</p>
                                    <p className="text-sm text-gray-700 mt-1.5">
                                        {selectedProduct?.updated_at ? new Date(selectedProduct.updated_at).toLocaleTimeString() : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="border border-gray-200 mt-6" />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductTable;
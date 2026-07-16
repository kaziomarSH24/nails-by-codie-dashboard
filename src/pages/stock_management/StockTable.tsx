import { useState } from "react";



import StockOverview from "./StockOverview";
import RestockRequests from "./RestockRequests";






export default function StockManagement() {


    const [activeTab, setActiveTab] = useState<"stock" | "request">("stock");










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
                <StockOverview />
            )}

            {activeTab === "request" && (
                <RestockRequests />
            )}


        </div>
    );
}

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import axios from 'axios';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { useState } from "react";
// import { useReportGenerateQuery } from "../../api/report/reportApi";


type FormatType = "pdf" | "excel";

const GenerateReports = () => {
    const [day, setDay] = useState<string>();
    const [format, setFormat] = useState<FormatType>();
    const [search, setSearch] = useState<string>();



    /* ================= HANDLE DOWNLOAD ================= */


    const token = localStorage.getItem("token")

    const handleDownload = async (format: "excel" | "pdf") => {
        try {
            const apiUrl = import.meta.env.VITE_YOUTUBE_API_KEY; // backend base URL
            const response = await axios.get(`${apiUrl}/admin/income/generate-report`, {
                params: {
                    period: day,
                    search: search,
                    format: format, // excel/pdf
                },
                responseType: "blob", // important for binary file
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // create blob and download
            const blob = new Blob([response.data], {
                type:
                    format === "excel"
                        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        : "application/pdf",
            });

            const downloadUrl = window.URL.createObjectURL(blob);
            const fileExtension = format === "excel" ? "xlsx" : "pdf";
            const fileName = `income_report_${new Date().toISOString().split("T")[0]}.${fileExtension}`;

            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            // cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            console.log(`File downloaded successfully: ${fileName}`);
        } catch (error) {
            console.error("File download failed:", error);
        }
    };





    return (
        <Card className="mt-7 shadow shadow-[#00000033] rounded-[7px]">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-[#3A3734]">
                    Generate Reports
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="flex justify-between gap-x-5">
                    {/* PERIOD */}
                    <div className="w-full">
                        <label className="block text-sm font-medium mb-2">
                            Select Period
                        </label>
                        <Select onValueChange={setDay}>
                            <SelectTrigger className="w-full border">
                                <SelectValue placeholder="Select days" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                                <SelectItem value="last_15_days">Last 15 Days</SelectItem>
                                <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                                <SelectItem value="last_month">Last Month</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* REPORT TYPE */}
                    <div className="w-full">
                        <label className="block text-sm font-medium mb-2">
                            Report Type
                        </label>
                        <Select onValueChange={((value) => { setSearch(value) })} >
                            <SelectTrigger className="w-full border">
                                <SelectValue placeholder="Select report type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="income">Income Summary</SelectItem>
                                <SelectItem value="course">Course Revenue</SelectItem>
                                <SelectItem value="product">Product Sales</SelectItem>
                                <SelectItem value="tax">Tax Report</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* FORMAT */}
                    <div className="w-full">
                        <label className="block text-sm font-medium mb-2">
                            Format
                        </label>
                        <Select onValueChange={(v) => setFormat(v as FormatType)}>
                            <SelectTrigger className="w-full border">
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="excel">Excel (CSV)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* BUTTON */}
                    <div className="mt-7">
                        <Button
                            disabled={!day || !format}
                            onClick={() => { handleDownload(format) }}
                            className="bg-[#91741A] text-white px-6"
                        >
                            Generate
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default GenerateReports;

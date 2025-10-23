import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Button } from "../../components/ui/button";



const GenerateReports = () => {
    return (
        <Card className=" mt-7 shadow shadow-[#00000033] rounded-[7px] ">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-[#3A3734]">Generate Reports</CardTitle>
            </CardHeader>

            <CardContent>
                <div className=" flex justify-between gap-x-5 ">
                    {/* Select Period */}
                    <div className=" w-full " >
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Period</label>
                        <Select>
                            <SelectTrigger className="w-full border border-gray-300">
                                <SelectValue placeholder="Select days" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7days">Last 7 Days</SelectItem>
                                <SelectItem value="15days">Last 15 Days</SelectItem>
                                <SelectItem value="30days">Last 30 Days</SelectItem>
                                <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Report Type */}
                    <div className=" w-full " >
                        <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                        <Select>
                            <SelectTrigger className="w-full border border-gray-300">
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

                    {/* Format */}
                    <div className=" w-full  " >
                        <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                        <Select>
                            <SelectTrigger className="w-full border border-gray-300">
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="excel">Excel</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Generate Button */}
                    <div className="mt-7">
                        <Button className="bg-[#91741A] text-white hover:bg-[#7a6116] px-6">
                            Generate
                        </Button>
                    </div>
                </div>


            </CardContent>
        </Card>
    );
};

export default GenerateReports;

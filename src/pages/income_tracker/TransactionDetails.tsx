
import { useIncomeDetailsQuery } from "../../api/income-api/incomeApi";
import { Spinner } from "../../components/ui/spinner";
import type { TransactionDetailsResponse } from "../../lib/type/incomeType";



const TransactionDetails = ({ viewId }: { viewId: number }) => {

    const { data, isLoading } = useIncomeDetailsQuery(viewId)

    const transitionDetails: TransactionDetailsResponse = data?.data;
    console.log("transitionDetails is ", transitionDetails)

    /* ---------- EXPORT CSV ---------- */
    const exportCSV = () => {
        const rows = [
            ["Transaction ID", transitionDetails?.transaction_id],
            ["Date", transitionDetails?.date],
            ["Status", transitionDetails?.status],
            ["User Name", transitionDetails?.user?.name],
            ["User Email", transitionDetails?.user?.email],
            ["Reference", transitionDetails?.source_reference],
            ["Total Amount", `${transitionDetails?.currency} ${transitionDetails?.total_amount}`],
            // ...data.breakdown.map((b) => [b.label, b.value]),
        ];

        const csv =
            "data:text/csv;charset=utf-8," +
            rows.map((r) => r.join(",")).join("\n");

        const link = document.createElement("a");
        link.href = encodeURI(csv);
        link.download = "transaction.csv";
        link.click();
    };

    /* ---------- EXPORT JSON ---------- */
    // const exportJSON = () => {
    //     const blob = new Blob([JSON.stringify(transitionDetails, null, 2)], {
    //         type: "application/json",
    //     });

    //     const link = document.createElement("a");
    //     link.href = URL.createObjectURL(blob);
    //     link.download = "transaction.json";
    //     link.click();
    // };

    if (isLoading) {
        return (
            <div className=" flex justify-center items-center  h-[50vh] " >
                <Spinner />
            </div>
        )
    } else {
        return (
            <div className="max-w-3xl mx-auto  p-6 space-y-6">
                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Transaction Details</h2>


                </div>

                {/* USER */}
                <div className="flex items-center gap-4">
                    <img
                        src={transitionDetails?.user?.avatar}
                        alt={transitionDetails?.user?.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-medium">{transitionDetails?.user.name}</p>
                        <p className="text-sm text-gray-500">{transitionDetails?.user.email}</p>
                    </div>
                </div>

                {/* INFO */}
                <div className=" flex justify-between items-center " >
                    <h1>
                        Transaction ID:
                    </h1>
                    <strong> {transitionDetails?.transaction_id}</strong>
                </div>
                <div className=" flex justify-between items-center " >
                    <h1>Transaction Date:</h1>
                    <strong> {transitionDetails?.date}</strong>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                        <strong>Status:</strong>{" "}
                        <span
                            className={`font-semibold ${transitionDetails?.status === "Success"
                                ? "text-green-600"
                                : transitionDetails?.status === "Pending"
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                        >
                            {transitionDetails?.status}
                        </span>
                    </p>
                    <p>
                        <strong>Reference:</strong> {transitionDetails?.source_reference}
                    </p>
                </div>

                {/* BREAKDOWN */}
                <div>
                    <h3 className="font-semibold mb-2">Payment Breakdown</h3>
                    <div className="space-y-2 text-sm">

                        <div className="flex justify-between font-semibold border-t pt-2">
                            <span>Total</span>
                            <span>
                                {transitionDetails?.currency} {transitionDetails?.total_amount}
                            </span>
                        </div>
                    </div>
                </div>

                {/* RELATED LINK */}
                {/* <p className="text-blue-600 text-sm hover:underline" >
                {transitionDetails?.related_link?.display_text}
            </p> */}

                <div className="flex justify-end gap-2">
                    <button
                        onClick={exportCSV}
                        className="px-3 py-1.5  text-sm rounded bg-yellow-400 hover:bg-yellow-500"
                    >
                        Download
                    </button>

                    {/* <button
                    onClick={exportJSON}
                    className="px-3 py-1.5 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                    JSON
                </button> */}
                </div>
            </div>
        )
    }
};

export default TransactionDetails;

// WeeklyUsersChart.jsx
import { useMemo, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useUserChartQuery } from "../../api/home-api/homeApi";

const WeeklyUsersChart = () => {
    const [view, setView] = useState<"weekly" | "monthly">("weekly");

    const { data: userChart, isLoading } = useUserChartQuery(view);

    // 🔥 Transform API response to recharts format
    const chartData = useMemo(() => {
        if (!userChart?.data?.labels || !userChart?.data?.data) return [];

        return userChart.data.labels.map(
            (label: string, index: number) => ({
                day: label,
                users: userChart.data.data[index] ?? 0,
            })
        );
    }, [userChart]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    New Users this {view}
                </h2>

                <div className="flex space-x-4">
                    <button
                        onClick={() => setView("weekly")}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${view === "weekly"
                            ? "bg-yellow-400 text-white"
                            : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        Weekly
                    </button>

                    <button
                        onClick={() => setView("monthly")}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${view === "monthly"
                            ? "bg-yellow-400 text-white"
                            : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            {/* Chart */}
            {isLoading ? (
                <p className="text-gray-500">Loading users...</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                    >
                        <XAxis
                            dataKey="day"
                            tick={{ fill: "#6B7280", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: "#6B7280", fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            width={40}
                        />
                        <Tooltip />

                        <Bar
                            dataKey="users"
                            radius={[8, 8, 0, 0]}
                            barSize={40}
                            fill="url(#goldGradient)"
                        >
                            <defs>
                                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#FFD700" stopOpacity={0.9} />
                                    <stop offset="100%" stopColor="#FFD700" stopOpacity={0.6} />
                                </linearGradient>
                            </defs>
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default WeeklyUsersChart;
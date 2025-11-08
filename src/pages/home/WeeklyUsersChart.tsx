// WeeklyUsersChart.jsx
import  { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { day: "Mon", users: 150 },
    { day: "Tue", users: 80 },
    { day: "Wed", users: 150 },
    { day: "Thu", users: 600 },
    { day: "Fri", users: 400 },
    { day: "Sat", users: 100 },
    { day: "Sun", users: 180 },
];

const WeeklyUsersChart = () => {
    const [view, setView] = useState("Weekly");

    return (
        <div className="bg-white p-6 rounded-xl shadow-md w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">New Users this week</h2>
                <div className="flex items-center gap-4 text-sm">
                    <label className="flex items-center gap-1 cursor-pointer">
                        <input
                            type="radio"
                            name="view"
                            checked={view === "Weekly"}
                            onChange={() => setView("Weekly")}
                            className="accent-yellow-400"
                        />
                        Weekly
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                        <input
                            type="radio"
                            name="view"
                            checked={view === "Monthly"}
                            onChange={() => setView("Monthly")}
                            className="accent-gray-400"
                        />
                        Monthly
                    </label>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
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
                        fill="url(#goldGradient)"
                        radius={[8, 8, 0, 0]}
                        barSize={40} // Increased from 28 to 40
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
        </div>
    );
};

export default WeeklyUsersChart;

// WeeklyIncomeChart.jsx
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data
const weeklyData = [
  { day: "Mon", income: 1600 },
  { day: "Tue", income: 3200 },
  { day: "Wed", income: 2200 },
  { day: "Thu", income: 4100 },
  { day: "Fri", income: 3600 },
  { day: "Sat", income: 4100 },
  { day: "Sun", income: 2200 },
];

const monthlyData = [
  { day: "Week 1", income: 12000 },
  { day: "Week 2", income: 15000 },
  { day: "Week 3", income: 9000 },
  { day: "Week 4", income: 18000 },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow border text-sm">
        <p className="text-gray-800 font-semibold">
          +${payload[0].value.toLocaleString()}
        </p>
        <p className="text-gray-500">{payload[0].payload.day}</p>
      </div>
    );
  }
  return null;
};

const IncomeChart: React.FC = () => {
  const [view, setView] = useState<"Weekly" | "Monthly">("Weekly");

  const data = view === "Weekly" ? weeklyData : monthlyData;

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full max-w-2xl">
      {/* Header with toggle buttons */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Income this {view.toLowerCase()}
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setView("Weekly")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${view === "Weekly"
                ? "bg-yellow-400 text-white"
                : "bg-gray-100 text-gray-700"
              }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setView("Monthly")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${view === "Monthly"
                ? "bg-yellow-400 text-white"
                : "bg-gray-100 text-gray-700"
              }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Line chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="day" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#FACC15"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeChart;

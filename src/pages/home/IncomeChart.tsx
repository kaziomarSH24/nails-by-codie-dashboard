// weeklyIncomeChart.jsx
import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useIncomeChartQuery } from "../../api/home-api/homeApi";

// Custom tooltip
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
  const [view, setView] = useState<"weekly" | "monthly">("weekly");

  // API call depends on view
  const { data: incomeChart, isLoading } = useIncomeChartQuery(view);

  // 🔥 Transform API data to chart data
  const chartData = useMemo(() => {
    if (!incomeChart?.data?.labels || !incomeChart?.data?.data) return [];

    return incomeChart.data.labels.map(
      (label: string, index: number) => ({
        day: label,
        income: incomeChart.data.data[index] ?? 0,
      })
    );
  }, [incomeChart]);

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full max-w-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Income this {view}
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

      {/* Loading state */}
      {isLoading ? (
        <p className="text-gray-500">Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
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
      )}
    </div>
  );
};

export default IncomeChart;
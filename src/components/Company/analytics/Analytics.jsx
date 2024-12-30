import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { format, subMonths, subWeeks, subYears } from "date-fns";
import api from "../../../services/axios";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

// Reusable Timeframe Selector Component
const TimeframeSelector = ({ value, onChange, options }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-all duration-200"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
      <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </div>
);

// Metrics Card Component
const MetricsCard = ({ title, value, color, trend, change }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white rounded-xl shadow-md p-4 text-center"
  >
    <h2 className="text-gray-500 text-sm mb-2">{title}</h2>
    <p className={`text-2xl md:text-3xl font-bold ${color}`}>{value}</p>
    <div
      className={`mt-2 ${
        trend === "up" ? "text-green-500" : "text-red-500"
      } text-sm`}
    >
      {trend === "up" ? "↑" : "↓"} {change}%{" "}
      {trend === "up" ? "increase" : "decrease"}
    </div>
  </motion.div>
);

// Growth Trend Chart Component
const GrowthTrendChart = ({ stats, timeframe, onTimeframeChange }) => {
  const timeframeOptions = [
    { value: "week", label: "Last Week" },
    { value: "month", label: "Last Month" },
    { value: "year", label: "Last Year" },
  ];

  const generateTimeLabels = (timeframe) => {
    const now = new Date();
    switch (timeframe) {
      case "week":
        return Array.from({ length: 7 }, (_, i) =>
          format(subWeeks(now, 7 - i - 1), "MMM dd")
        );
      case "year":
        return Array.from({ length: 12 }, (_, i) =>
          format(subMonths(now, 12 - i - 1), "MMM")
        );
      default: // month
        return Array.from({ length: 6 }, (_, i) =>
          format(subMonths(now, 6 - i - 1), "MMM dd")
        );
    }
  };

  const trendData = useMemo(() => {
    if (!stats) return null;

    const labels = generateTimeLabels(timeframe);

    const generateTrendData = (baseValue) => {
      const multipliers = {
        week: [0.8, 0.85, 0.9, 0.95, 0.98, 1.0, 1.02],
        month: [0.7, 0.8, 0.85, 0.9, 0.95, 1.0],
        year: [0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1.0],
      };

      return labels.map((_, index) =>
        Math.round(baseValue * multipliers[timeframe][index])
      );
    };

    return {
      labels,
      datasets: [
        {
          label: "Company Growth",
          data: generateTrendData(stats.companies.total),
          fill: true,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.4,
          pointRadius: 6,
          pointBackgroundColor: "rgb(59, 130, 246)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointHoverRadius: 8,
        },
      ],
    };
  }, [stats, timeframe]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "nearest",
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          cornerRadius: 4,
          padding: 12,
          titleFont: { size: 14 },
          bodyFont: { size: 12 },
        },
        title: {
          display: true,
          text: `${
            timeframe === "week"
              ? "Weekly"
              : timeframe === "month"
              ? "Monthly"
              : "Yearly"
          } Company Growth`,
          font: { size: 16 },
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: "rgba(0,0,0,0.05)",
            drawBorder: false,
          },
          ticks: { callback: (value) => `${value}` },
        },
        x: { grid: { display: false } },
      },
    }),
    [timeframe]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Company Growth Trends</h2>
        <TimeframeSelector
          value={timeframe}
          onChange={(e) => onTimeframeChange(e.target.value)}
          options={timeframeOptions}
        />
      </div>
      <div className="h-[300px] md:h-[400px]">
        {trendData ? (
          <Line data={trendData} options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No trend data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [growthTimeframe, setGrowthTimeframe] = useState("month");
  const [distributionTimeframe, setDistributionTimeframe] = useState("month");

  // Fetch analytics data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/analytics/dashboard-stats");
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        setError("Failed to load statistics");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Analytics Cards Data
  const cards = useMemo(() => {
    if (!stats) return [];

    return [
      {
        title: "Total Companies",
        value: stats?.companies?.total ?? 0,
        color: "text-blue-600",
        change: Math.abs(stats?.companies?.percentageChange ?? 0),
        trend: stats?.companies?.trend ?? "up",
      },
      {
        title: "Total Products",
        value: stats?.products?.total ?? 0,
        color: "text-purple-600",
        change: Math.abs(stats?.products?.percentageChange ?? 0),
        trend: stats?.products?.trend ?? "up",
      },
      {
        title: "Total Forums",
        value: stats?.forums?.total ?? 0,
        color: "text-orange-600",
        change: Math.abs(stats?.forums?.percentageChange ?? 0),
        trend: stats?.forums?.trend ?? "up",
      },
      {
        title: "Product Reports",
        value: stats?.reports?.total ?? 0,
        color: "text-red-600",
        change: Math.abs(stats?.reports?.percentageChange ?? 0),
        trend: stats?.reports?.trend ?? "up",
      },
    ];
  }, [stats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 min-h-screen bg-gray-50 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center"
      >
        Dashboard Analytics
      </motion.h1>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => (
          <MetricsCard
            key={card.title}
            title={card.title}
            value={card.value}
            color={card.color}
            trend={card.trend}
            change={card.change}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Growth Trend Chart */}
        <GrowthTrendChart
          stats={stats}
          timeframe={growthTimeframe}
          onTimeframeChange={setGrowthTimeframe}
        />

        {/* Product Status Distribution */}
      </div>
    </div>
  );
};

export default Analytics;

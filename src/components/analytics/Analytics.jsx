import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
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
} from "chart.js";
import {
  Search,
  MessageSquare,
  Users,
  UserPlus,
  ChevronRight,
  Calendar,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserGeolocationMap from "./UserGeolocationMap ";
import * as XLSX from "xlsx"; // Import the XLSX library

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const apiURL = process.env.REACT_APP_API_URL;

const StatCard = ({ title, value, icon: Icon, route }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm flex flex-col font-poppins">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-black font-semibold text-xs md:text-sm">{title}</h3>
        <div className="p-1.5 rounded-lg bg-blue-100">
          <Icon className="w-4 h-4 md:w-5 md:h-5 text-blue-900 m-1" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-base md:text-lg font-bold text-blue-800">
          {value}
        </span>
        <button
          className="text-blue-900 font-semibold flex items-center text-xs"
          onClick={() => navigate(route)}
        >
          View More
          <ChevronRight className="w-3 h-3 ml-1" />
        </button>
      </div>
    </div>
  );
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  scales: {
    x: {
      ticks: {
        autoSkip: true,
        maxRotation: 90,
        minRotation: 45,
      },
    },
  },
};

export default function AnalyticsDashboard() {
  const [companyCount, setCompanyCount] = useState(0);
  const [forumCount, setForumCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [productReportCount, setProductReportCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeInterval, setTimeInterval] = useState("week");
  const [performanceData, setPerformanceData] = useState({});
  const navigate = useNavigate();

  const transformChartData = (data, timeInterval) => {
    if (!data || !data.performanceData) return null;

    const sortedData = [...data.performanceData].sort((a, b) => {
      if (a._id.year === b._id.year) {
        if (timeInterval === "week") {
          return a._id.week - b._id.week;
        } else if (timeInterval === "monthly") {
          return a._id.month - b._id.month;
        }
      }
      return a._id.year - b._id.year;
    });

    let labels;
    if (timeInterval === "week") {
      labels = sortedData.map(
        (item) => `Week ${item._id.week}, ${item._id.year}`
      );
    } else if (timeInterval === "monthly") {
      labels = sortedData.map(
        (item) => `Month ${item._id.month}, ${item._id.year}`
      );
    } else {
      labels = sortedData.map((item) => `${item._id.year}`);
    }

    return {
      labels,
      datasets: [
        {
          label: "Company Growth",
          data: sortedData.map((item) => item.companyCount),
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          tension: 0.4,
          fill: true,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: "#4CAF50",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
      ],
    };
  };

  // Fetch total counts
  useEffect(() => {
    axios
      .get(`${apiURL}/admin/totalCounts`)
      .then((response) => {
        setCompanyCount(response.data.totalCompanyCount);
        setForumCount(response.data.totalForumCount);
        setProductCount(response.data.totalProductCount);
        setProductReportCount(response.data.totalProductReportCount);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching total counts:", error);
        setLoading(false);
      });
  }, []);

  // Fetch performance data
  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await axios.get(
          `${apiURL}/visitor/company-performance`,
          {
            params: { type: timeInterval },
          }
        );
        setPerformanceData(response.data);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      }
    };

    fetchPerformanceData();
  }, [timeInterval]);

  const handleIntervalChange = (e) => {
    setTimeInterval(e.target.value);
  };

  // Function to download data as an Excel file
  const downloadExcel = () => {
    if (!performanceData.performanceData) {
      alert("No performance data available to download.");
      return;
    }

    // Prepare the data
    const excelData = performanceData.performanceData.map((item) => ({
      Year: item._id.year,
      Week: item._id.week || "N/A", // In case there's no week field
      Month: item._id.month || "N/A", // In case there's no month field
      CompanyCount: item.companyCount,
    }));

    // Create a worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Company Performance");

    // Trigger the download
    XLSX.writeFile(wb, "Company_Performance.xlsx");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-t-transparent border-gray-600 rounded-full animate-spin"></div>
          <div className="text-lg font-semibold text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  const chartData = transformChartData(performanceData, timeInterval);

  return (
    <div className="bg-gray-100 p-2 md:p-4 min-h-screen overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg md:text-xl font-bold">Analytics</h1>
        <div className="flex gap-2">
          <button className="p-1.5 rounded bg-blue-600 text-white">
            <Calendar className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded bg-blue-600 text-white">
            <Download className="w-4 h-4" onClick={downloadExcel} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Search}
          value={companyCount}
          title="Total Companies"
          route="/admin/company"
        />
        <StatCard
          icon={MessageSquare}
          value={forumCount}
          title="Total Forums"
          route="/admin/forum"
        />
        <StatCard
          icon={Users}
          value={productCount}
          title="Total Products"
          route="/admin/product"
        />
        <StatCard
          icon={UserPlus}
          value={productReportCount}
          title="Total Product Reports"
          route="/admin/reports"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Company Performance
            </h2>
            <select
              value={timeInterval}
              onChange={handleIntervalChange}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="week">Week</option>
              <option value="monthly">Month</option>
              <option value="yearly">Year</option>
            </select>
          </div>
          <div className="h-80">
            {chartData && <Line data={chartData} options={chartOptions} />}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <UserGeolocationMap />
      </div>
    </div>
  );
}

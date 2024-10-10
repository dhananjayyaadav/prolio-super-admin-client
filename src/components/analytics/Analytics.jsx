import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  ArcElement,
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
} from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-continents.json";
const markers = [
  { coordinates: [-73.935242, 40.73061], name: "New York" },
  { coordinates: [2.352222, 48.856614], name: "Paris" },
  { coordinates: [121.473701, 31.230416], name: "Shanghai" },
];
const StatCard = ({ title, value, icon: Icon }) => (
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
      <button className="text-blue-900 font-semibold flex items-center text-xs">
        View More
        <ChevronRight className="w-3 h-3 ml-1" />
      </button>
    </div>
  </div>
);
const FormRequestItem = ({ icon: Icon, title, count }) => (
  <div className="flex items-center justify-between p-2 bg-white rounded-lg mb-1 cursor-pointer hover:bg-gray-50">
    <div className="flex items-center">
      <div className="p-1.5 rounded-lg bg-blue-100 mr-2">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <span className="text-xs md:text-sm">{title}</span>
    </div>
    <div className="flex items-center">
      <span className="text-xs md:text-sm mr-1">({count})</span>
      <ChevronRight className="w-3 h-3 text-gray-400" />
    </div>
  </div>
);
export default function AnalyticsDashboard() {
  const days = ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];
  const conversionData = {
    labels: days,
    datasets: [
      {
        label: "Views",
        data: [5000, 12000, 8000, 20000, 7000, 10000, 11000],
        backgroundColor: "#FCD34D",
      },
      {
        label: "Enquiries",
        data: [2000, 7000, 5000, 9000, 2000, 8000, 7000],
        backgroundColor: "#3B82F6",
      },
    ],
  };
  const visitorInsightData = {
    labels: days,
    datasets: [
      {
        label: "Rare",
        data: [1000, 4580, 1000, 15000, 10000, 5000, 20000],
        fill: true,
        backgroundColor: "rgba(0, 128, 0, 0.2)",
        borderColor: "green",
        tension: 0.4,
      },
      {
        label: "New",
        data: [2000, 3000, 2000, 10000, 15000, 10000, 15000],
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "#3B82F6",
        tension: 0.4,
      },
      {
        label: "Loyal",
        data: [500, 2000, 500, 8000, 12000, 8000, 12000],
        fill: true,
        backgroundColor: "rgba(251, 146, 60, 0.2)",
        borderColor: "#FB923C",
        tension: 0.4,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          boxWidth: 10,
          font: {
            size: 10,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
  };
  return (
    <div className="bg-gray-100 p-2 md:p-4 min-h-screen overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg md:text-xl font-bold">Analytics</h1>
        <div className="flex gap-2">
          <button className="p-1.5 rounded bg-blue-600 text-white">
            <Calendar className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded bg-blue-600 text-white">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <StatCard title="Total Enquiries" value="13,258" icon={Search} />
        <StatCard
          title="Total Form Response"
          value="13,258"
          icon={MessageSquare}
        />
        <StatCard title="Total Visitors" value="13,258" icon={Users} />
        <StatCard title="New Visitors" value="13,258" icon={UserPlus} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 font-poppins">
        <div className="bg-white p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold">Conversion Rates</h2>
            <select className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
              <option>Weekly</option>
            </select>
          </div>
          <div className="h-40 md:h-48">
            <Bar data={conversionData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-md font-poppins">
          <h2 className="text-sm font-semibold mb-2">Visitors Demographics</h2>
          <div className="h-48 md:h-64">
            <ComposableMap
              projectionConfig={{
                rotate: [-10, 0, 0],
                scale: 147,
              }}
            >
              <ZoomableGroup center={[0, 0]} zoom={1}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#ADD8E6"
                        stroke="#D6D6DA"
                        strokeWidth={0.5}
                        style={{
                          default: {
                            fill: "#EAEFFF",
                            outline: "none",
                          },
                          hover: {
                            fill: "#3B82F6",
                            outline: "none",
                          },
                        }}
                      />
                    ))
                  }
                </Geographies>
                {markers.map(({ coordinates, name }) => (
                  <Marker key={name} coordinates={coordinates}>
                    <circle r={4} fill="#FF6347" />
                    <text
                      textAnchor="middle"
                      y={-10}
                      style={{
                        fontFamily: "system-ui",
                        fontSize: "8px",
                        fill: "#5D5A6D",
                      }}
                    >
                      {name}
                    </text>
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-poppins">
        <div className="bg-white p-3 rounded-lg ">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold">Form Requests</h2>
            <select className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
              <option>Weekly</option>
            </select>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6 hover:shadow-xl transition-shadow">
            <FormRequestItem icon={Users} title="Reseller Forms" count="20" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6 hover:shadow-xl transition-shadow">
            <FormRequestItem icon={Users} title="Supplier Forms" count="05" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6 hover:shadow-xl transition-shadow">
            <FormRequestItem
              icon={MessageSquare}
              title="Service Center"
              count="15"
            />
          </div>
        </div>
        <div className="md:col-span-2 bg-white p-3 rounded-lg font-poppins">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold">Visitors Insight</h2>
            <select className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
              <option>Weekly</option>
            </select>
          </div>
          <div className="h-40 md:h-48">
            <Line data={visitorInsightData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  Search,
  MessageSquare,
  Users,
  ChevronRight,
  Filter,
  Calendar,
} from "lucide-react";

const conversionData = [
  { name: "Tue", value: 5000, enquiries: 2000 },
  { name: "Wed", value: 12000, enquiries: 7000 },
  { name: "Thu", value: 8000, enquiries: 4000 },
  { name: "Fri", value: 15000, enquiries: 12000 },
  { name: "Sat", value: 10000, enquiries: 8000 },
  { name: "Sun", value: 12000, enquiries: 7000 },
  { name: "Mon", value: 8000, enquiries: 5000 },
];

const visitorData = [
  { name: "Tue", rare: 2000, new: 3000, loyal: 4000 },
  { name: "Wed", rare: 3000, new: 4000, loyal: 3000 },
  { name: "Thu", rare: 4500, new: 5000, loyal: 4000 },
  { name: "Fri", rare: 6000, new: 8000, loyal: 7000 },
  { name: "Sat", rare: 8000, new: 10000, loyal: 9000 },
  { name: "Sun", rare: 7000, new: 9000, loyal: 8000 },
  { name: "Mon", rare: 8000, new: 11000, loyal: 10000 },
];

const productsData = [
  {
    machine: "Machine",
    productId: "123456",
    category: "electronics",
    lastEdited: "19/12/23",
    views: "12k",
    price: "1286",
    trend: "up",
  },
  {
    machine: "Machine",
    productId: "113456",
    category: "Machine",
    lastEdited: "19/12/23",
    views: "11k",
    price: "1125",
    trend: "up",
  },
  {
    machine: "Machine",
    productId: "111456",
    category: "Machine",
    lastEdited: "19/12/23",
    views: "1k",
    price: "1128",
    trend: "down",
  },
];

const geographicData = [
  { name: "Asia", value: 45, color: "#059669" },
  { name: "Europe", value: 25, color: "#F97316" },
  { name: "Africa", value: 15, color: "#FFB800" },
  { name: "South America", value: 10, color: "#22C55E" },
  { name: "North America", value: 5, color: "#3B82F1" },
];

const WorldMap = () => (
  <svg viewBox="0 0 1000 500" className="w-full h-full">
    <path
      d="M150,70 Q200,50 250,70 Q300,90 350,70 L400,110 L350,170 L300,190 L250,170 L200,150 L150,130 Z"
      fill="#3B82F1"
      opacity="0.8"
    />
    <path
      d="M250,200 Q270,220 280,250 L300,300 L280,350 L250,380 L220,350 L210,300 Z"
      fill="#22C55E"
      opacity="0.8"
    />
    <path
      d="M420,100 Q460,80 500,100 L520,130 L500,160 L460,170 L420,150 Z"
      fill="#F97316"
      opacity="0.8"
    />
    <path
      d="M420,180 Q480,160 540,180 L580,220 L560,280 L500,320 L440,280 L420,220 Z"
      fill="#FFB800"
      opacity="0.8"
    />
    <path
      d="M540,80 Q620,60 700,80 Q780,100 860,80 L900,130 L860,200 L780,250 L700,270 L620,250 L540,200 Z"
      fill="#059669"
      opacity="0.8"
    />
    <path
      d="M700,300 Q740,280 780,300 L800,330 L780,360 L740,370 L700,350 Z"
      fill="#6366F1"
      opacity="0.8"
    />
  </svg>
);

const StatCard = ({ icon, value, title }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <div className="flex justify-between mb-4">
      <div className="p-2 bg-blue-100 rounded-lg">{icon}</div>
      <button className="text-sm text-blue-600 flex items-center">
        View More <ChevronRight className="h-4 w-4" />
      </button>
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-gray-500 text-sm">{title}</div>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-blue-100">
            <Filter className="h-5 w-5 text-blue-600" />
          </button>
          <button className="p-2 rounded-full bg-blue-100">
            <Download className="h-5 w-5 text-blue-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Search className="h-5 w-5 text-blue-600" />}
          value="13,258"
          title="Total Enquiries"
        />
        <StatCard
          icon={<MessageSquare className="h-5 w-5 text-blue-600" />}
          value="13,258"
          title="Total Form Response"
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-blue-600" />}
          value="13,258"
          title="Total Visitors"
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-blue-600" />}
          value="13,258"
          title="New Visitors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Conversion Rates</h2>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
              Weekly
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FFB800" />
              <Bar dataKey="enquiries" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Visitors geographics</h2>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Asia</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm">Europe</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Africa</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">N.America</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm">S.America</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 h-[200px]">
            <div className="col-span-2">
              <WorldMap />
            </div>
            <div className="col-span-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={geographicData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    innerRadius={45}
                  >
                    {geographicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#000"
                    fontSize="14"
                    fontWeight="500"
                  >
                    85%
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-6">
        <div className="col-span-12 md:col-span-3 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold mb-4">Form Requests</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Reseller Forms(20)</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Supplier Forms(05)</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Service Center</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-9 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold">Visitors Insight</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Rare</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">New</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm">Loyal</span>
                </div>
              </div>
            </div>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
              Weekly
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="rare"
                stackId="1"
                stroke="#059669"
                fill="#059669"
              />
              <Area
                type="monotone"
                dataKey="new"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
              />
              <Area
                type="monotone"
                dataKey="loyal"
                stackId="1"
                stroke="#F97316"
                fill="#F97316"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold">Products</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-gray-100">
              <Filter className="h-5 w-5 text-gray-600" />
            </button>

            <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
              Monthly
            </button>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pb-4">Product</th>
              <th className="pb-4">Product ID</th>
              <th className="pb-4">Category</th>
              <th className="pb-4">Last Edited</th>
              <th className="pb-4">Views</th>
              <th className="pb-4">Price</th>
              <th className="pb-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {productsData.map((product, index) => (
              <tr key={index} className="border-t">
                <td className="py-4">{product.machine}</td>
                <td>{product.productId}</td>
                <td className="text-blue-600">{product.category}</td>
                <td>{product.lastEdited}</td>
                <td>{product.views}</td>
                <td className="flex items-center gap-2">
                  {product.price}
                  {product.trend === "up" ? (
                    <span className="text-green-500">↑</span>
                  ) : (
                    <span className="text-red-500">↓</span>
                  )}
                </td>
                <td>
                  <button className="p-1">⋮</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  Briefcase,
  Mail,
  Heart,
  LineChart,
  UserCog,
  HelpCircle,
  Settings,
  AlertTriangle,
  Package,
} from "lucide-react";
import { Category } from "@mui/icons-material";

const Sidebar = ({ isCollapsed = false }) => {
  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      text: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <Building2 size={20} />,
      text: "Company profiles",
      path: "/company-profile",
    },
    {
      icon: <Category size={20} />,
      text: "Category",
      path: "/category",
    },

    {
      icon: <Package size={20} />,
      text: "Products",
      path: "/company-products",
    },
    {
      icon: <MessageSquare size={20} />,
      text: "Forum Management",
      path: "/company-forum",
    },
    {
      icon: <UserCog size={20} />,
      text: "Influencer Management",
      path: "/influencer",
    },
    {
      icon: <UserCog size={20} />,
      text: "Influencer Verification ",
      path: "/influencer-verification",
    },
    {
      icon: <AlertTriangle size={20} />,
      text: "Product Report",
      path: "/report-product",
    },

    { icon: <LineChart size={20} />, text: "Analytics", path: "/analytics" },
    {
      icon: <HelpCircle size={20} />,
      text: "Banner Management",
      path: "/banner",
    },
    {
      icon: <HelpCircle size={20} />,
      text: "Company Logs",
      path: "/company-logs",
    },
    {
      icon: <HelpCircle size={20} />,
      text: "Your Logs",
      path: "/our-logs",
    },
    { icon: <UserCog size={20} />, text: "Access Management", path: "/access" },
    { icon: <Settings size={20} />, text: "Settings", path: "/settings" },
  ];

  return (
    <nav className="flex-1 py-4">
      <ul className="space-y-1">
        {menuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-gray-600 
                hover:bg-blue-50 hover:text-blue-900 
                transition-colors duration-200
                ${isActive ? "bg-blue-50 text-blue-900" : ""}
              `}
            >
              <span className="inline-flex items-center justify-center">
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="ml-3 text-sm font-medium">{item.text}</span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;

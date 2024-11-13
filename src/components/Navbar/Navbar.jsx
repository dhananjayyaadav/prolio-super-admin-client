import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import { LiaClipboardCheckSolid } from "react-icons/lia";
import { CiSettings } from "react-icons/ci";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoCubeOutline } from "react-icons/io5";
import { GrAnalytics } from "react-icons/gr";
import { FaRegLightbulb, FaRegQuestionCircle } from "react-icons/fa";
// import sidBarImage from "../../assets/sidebar.png";
import { CgBox } from "react-icons/cg";
import { LuKey } from "react-icons/lu";
import { TbCategoryPlus } from "react-icons/tb";
import { IoMdLogOut } from "react-icons/io";
import { Bell } from "lucide-react";
import { BellOff } from "lucide-react";

function Navbar() {
  const [navLinks, setNavLinks] = useState([
    {
      title: "Dashboard",
      icon: <Icon icon="mingcute:grid-2-fill" className="bg-transparent" />,
      path: "/admin",
    },
    {
      title: "Company Profiles",
      icon: <CgBox className="bg-transparent" />,
      path: "/admin/company",
    },
    {
      title: "Categories",
      icon: <TbCategoryPlus className="bg-transparent" />,
      path: "/admin/categories",
    },
    {
      title: "Products",
      icon: <IoCubeOutline className="bg-transparent" />,
      path: "/admin/products",
    },
    {
      title: "Opportunities",
      icon: <FaRegLightbulb className="bg-transparent" />,
      path: "/admin/opportunities",
    },
    {
      title: "Enquiries",
      icon: <FaPeopleGroup className="bg-transparent" />,
      path: "/admin/enquiries",
    },
    {
      title: "Wishlist",
      icon: <LiaClipboardCheckSolid className="bg-transparent" />,
      path: "/admin/wishlist",
    },
    {
      title: "Analytics",
      icon: <GrAnalytics className="bg-transparent" />,
      path: "/admin/dashboard",
    },
    {
      title: "Access Management",
      icon: <LuKey className="bg-transparent" />,
      path: "/admin/access",
    },
    {
      title: "Faqs",
      icon: <FaRegQuestionCircle className="bg-transparent" />,
      path: "/admin/faqs",
    },
    {
      title: "Setting",
      icon: <CiSettings className="bg-transparent" />,
      path: "/admin/setting",
    },
    {
      title: "Logout",
      icon: <IoMdLogOut className="bg-transparent" />,
      path: "/admin/setting",
    },
  ]);

  const Menus = [
    {
      name: "Home",
      icon: "iconamoon:notification-light",
      path: "/forum",
    },
    // { name: "notification", icon: "jam:message-alt", path: "/forum" },
    {
      name: "profile",
      icon: "bx:user",
      path: "/profile",
    },
  ];
  const profileMenu = {
    name: "userName",
    icon: "ep:arrow-down",
    path: "/profile",
  };
  const [Open, setOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadNotification, setUnreadNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [activeFilter, setActiveFilter] = useState("unread");
  const [isFetching, setIsFetching] = useState(false);

  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const [readNotification, setReadNotifications] = useState([]);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notification, setNotification] = useState([]);
  // Assuming notifications state contains all notifications
  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);
  const dropdownRef = useRef(null);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollTop + clientHeight >= scrollHeight - 20 &&
      !isFetching &&
      hasMore
    ) {
      setPage((prev) => prev + 1);
    }
  };
  const handleMenu = () => {
    setOpen((prev) => !prev);
    console.log(Open);
  };
  return (
    <>
      <nav className="w-full h-16 fixed flex justify-between items-center gap-6 bg-blue-900 top-0 left-0 z-10 px-4 md:px-10">
        <div className="flex items-center space-x-4">
          <h1 className="text-white font-semibold text-3xl font-serif cursor-pointer">
            Prolio
          </h1>
          <span className="hidden md:block text-white text-lg font-santoshi px-6 py-1">
            {/* Categories */}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Bell Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotificationDropdown(!showNotificationDropdown);
                setShowChatDropdown(false);
              }}
              className="relative p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors duration-200"
            >
              <Bell className="w-6 h-6 text-blue-900" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotificationDropdown && (
              <div
                className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-10"
                style={{ maxHeight: "500px" }}
                onScroll={handleScroll}
              >
                {/* Header */}
                <div className="px-4 py-3 bg-blue-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-blue-800">
                      Notifications
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setActiveFilter("unread")}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                          activeFilter === "unread"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        Unread
                      </button>
                      <button
                        onClick={() => setActiveFilter("read")}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                          activeFilter === "read"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        Read
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notification Content */}
                <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
                  {!isFetching ? (
                    <div className="p-4 space-y-3">
                      {activeFilter === "unread" ? (
                        unreadNotifications.length > 0 ? (
                          unreadNotifications.map((notification) => (
                            <div
                              key={notification._id}
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
                            >
                              <div className="flex-shrink-0 mt-1">
                                <Clock className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Just now
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center">
                            <BellOff className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">
                              All caught up!
                            </p>
                            <p className="text-gray-400 text-sm">
                              You have no unread notifications
                            </p>
                          </div>
                        )
                      ) : readNotifications.length > 0 ? (
                        readNotifications.map((notification) => (
                          <div
                            key={notification._id}
                            onClick={() =>
                              handleNotificationClick(notification)
                            }
                            className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                          >
                            <div className="flex-shrink-0 mt-1">
                              <CheckCircle2 className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-600">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Earlier
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center">
                          <BellOff className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">
                            No notifications yet
                          </p>
                          <p className="text-gray-400 text-sm">
                            Previous notifications will appear here
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-500 text-sm">
                        Loading notifications...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Icon */}
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center cursor-pointer">
            <Icon className="text-blue-900 text-3xl" icon="bx:user" />
          </div>

          {/* Hamburger Menu */}
          <div className="md:hidden">
            {Open ? (
              <button className="text-white p-4" onClick={handleMenu}>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            ) : (
              <button className="text-white p-4" onClick={handleMenu}>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Profile Dropdown */}
        {Open && (
          <div className="md:hidden absolute left-0 w-full shadow-lg mt-16 z-30 bg-blue-900 backdrop-filter backdrop-blur-lg">
            <div className="px-2 text-black gap-1">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className="py-2 px-4 hover:bg-blue-800 text-white text-base block"
                >
                  <div className="flex items-center">
                    {link.icon}
                    <span className="ml-2 font-santoshi">{link.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;

const ProfileDropdown = ({
  profileMenu,
  submitLogout,
  isDropdownOpen,
  setIsDropdownOpen,
}) => {
  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  return (
    <div className="relative ml-3 bg-transparent pt-2 hidden md:block">
      <button
        onClick={handleDropdownToggle}
        className="w-14 h-9 rounded-full bg-transparent flex justify-center items-center"
      >
        <span className="text-sm text-white bg-transparent px-3 whitespace-nowrap ">
          {profileMenu.name}
        </span>
        <Icon
          className="text-white bg-transparent  text-xl"
          icon={profileMenu.icon}
        />
      </button>
      {isDropdownOpen && ( // Show dropdown only when it's open
        <div className="absolute right-4 top-16 w-48 py-5 text-center border-2 bg-white rounded-md shadow-lg overflow-hidden">
          <ul>
            <Link to="/profile" onClick={handleDropdownToggle}>
              <li className="px-4 border-b text-black border-blue-900 hover:text-white hover:border-white hover:bg-blue-900 py-2">
                Profile
              </li>
            </Link>
            <li
              className="px-4 py-2 text-black text-center items-center hover:text-white hover:bg-blue-900 cursor-pointer"
              onClick={() => {
                submitLogout();
                handleDropdownToggle(); // Close the dropdown after logout
              }}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

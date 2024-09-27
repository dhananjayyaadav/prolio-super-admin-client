import React, { useState } from "react";
import {
  Users,
  Menu,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  LayoutDashboard,
  Home,
  Compass,
  Mail,
  PlusIcon,
} from "lucide-react";
import "typeface-poppins";
import forumBanner from "../../assets/forum/forumBanner.png";
import AddForum from "./AddForum";
import ForumChatModel from "./ForumChatModel";
import ForumRequests from "./ForumRequests";
import ExploreModel from "./ExploreModel";
// import ManageProduct from "./ManageProduct";
import ProductListPage from "../ForumProduct/ProductListPage";

const ForumManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageProductModalOpen, setIsManageProductModalOpen] =
    useState(false); // State for ManageProduct modal

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMyForumsSidebarCollapsed, setIsMyForumsSidebarCollapsed] =
    useState(false);
  const [activeView, setActiveView] = useState("home");

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  const openManageProductModal = () => setIsManageProductModalOpen(true); // Open ManageProduct modal
  const closeManageProductModal = () => setIsManageProductModalOpen(false); // Close ManageProduct modal

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleMyForumsSidebar = () =>
    setIsMyForumsSidebarCollapsed(!isMyForumsSidebarCollapsed);

  const handleNavClick = (view) => {
    setActiveView(view);
    if (view === "myForums") {
      setIsSidebarCollapsed(true);
    }
    if (view === "Manage Product of Forums") {
      // Check if the clicked view is "Manage Product of Forums"
      openManageProductModal(); // Open the ManageProduct modal
    }
  };

  // Main sidebar rendering function
  const renderSidebar = () => (
    <div
      className={`bg-white shadow-md transition-all duration-300 ${
        isSidebarCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!isSidebarCollapsed && (
          <>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white">
                <Users size={20} />
              </div>
              <span className="ml-2 text-lg font-semibold">Surya Suri</span>
            </div>
          </>
        )}
        <button onClick={toggleSidebar} className="text-gray-500">
          {isSidebarCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
      </div>

      <nav className="mt-6 space-y-2">
        {[
          {
            icon: <LayoutDashboard size={20} />,
            label: "Manage Product of Forums",
            view: "ProductListPage",
          },
          { icon: <Users size={20} />, label: "My Forums", view: "myForums" },
          {
            icon: <Compass size={20} />,
            label: "Explore",
            view: "ExploreModel",
          },
          {
            icon: <Mail size={20} />,
            label: "Invitations",
            view: "ForumRequests",
          },
        ].map((item, index) => (
          <button
            key={index}
            className={`flex items-center w-full py-2 px-4 ${
              activeView === item.view
                ? "bg-blue-100 text-blue-800"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => handleNavClick(item.view)}
            title={item.label} // Tooltip with the label
          >
            {item.icon}
            {!isSidebarCollapsed && (
              <span
                className="ml-2 truncate" // Truncate long text
              >
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );

  // Secondary sidebar for "My Forums"
  const renderMyForumsSidebar = () => (
    <div
      className={`bg-white shadow-md transition-all duration-300 ${
        isMyForumsSidebarCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center p-4 border-b">
        {!isMyForumsSidebarCollapsed && (
          <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white">
            <Users size={20} />
          </div>
        )}
        {!isMyForumsSidebarCollapsed && (
          <>
            <span className="ml-2 text-lg font-semibold">Surya Suri</span>
            <button className="ml-2 text-gray-600"></button>
          </>
        )}
        <button
          onClick={toggleMyForumsSidebar}
          className={`text-gray-600 ${
            !isMyForumsSidebarCollapsed ? "ml-auto" : ""
          }`}
        >
          <Menu size={20} />
        </button>
      </div>

      <button
        className={`w-full py-2 px-4 mt-4 flex items-center justify-center ${
          isMyForumsSidebarCollapsed
            ? "justify-center"
            : "bg-blue-800 text-white rounded"
        }`}
        onClick={openAddModal}
      >
        <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
        {!isMyForumsSidebarCollapsed && <span>Add Forum</span>}
      </button>

      <nav className="mt-6 space-y-2">
        <button
          className={`flex items-center px-4 py-2 w-full ${
            activeView === "home"
              ? "bg-blue-100 text-blue-800"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => handleNavClick("home")}
        >
          <Home size={20} className="mr-2" />
          {!isMyForumsSidebarCollapsed && <span>Home</span>}
        </button>

        <button
          className={`flex items-center px-4 py-2 w-full ${
            activeView === "myForums"
              ? "bg-blue-100 text-blue-800"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => handleNavClick("myForums")}
        >
          <Users size={20} className="mr-2" />
          {!isMyForumsSidebarCollapsed && <span>Group</span>}
        </button>
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-poppins">
      {/* Main Sidebar */}
      {renderSidebar()}

      {/* My Forums Sidebar - rendered conditionally next to the collapsed main sidebar */}
      {activeView === "myForums" && renderMyForumsSidebar()}

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {/* <h1 className="w-full mx-auto bg-white shadow-lg rounded-lg p-6 text-2xl font-bold mb-6">
          {activeView === "myForums" ? "My Forums" : "Forum Management"}
        </h1> */}
        {activeView === "home" && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center mb-4">
            <div className="mb-6">
              <img src={forumBanner} alt="forumBanner" className="mx-auto" />
            </div>
            <p className="text-gray-600 mb-6">
              Prolio fosters seamless communication and collaboration
              <br />
              among vendors, enabling real-time updates and efficient project
              coordination.
            </p>
            <button
              className="bg-blue-800 text-white py-2 px-4 rounded"
              onClick={openAddModal}
            >
              Create Forum
            </button>
          </div>
        )}
        {activeView === "myForums" && (
          <ForumChatModel onClose={() => handleNavClick("home")} />
        )}
        {activeView === "ForumRequests" && <ForumRequests />}
        {activeView === "ExploreModel" && <ExploreModel />}
        {activeView === "ProductListPage" && <ProductListPage />}{" "}
        {["explore"].includes(activeView) && (
          <p className="text-gray-600">This view is under construction.</p>
        )}
      </div>

      {/* Add Forum Modal */}
      <AddForum isOpen={isAddModalOpen} onClose={closeAddModal} />
      {/* Manage Product Modal */}
      {/* <ManageProduct
        isOpen={isManageProductModalOpen}
        onClose={closeManageProductModal}
      /> */}
    </div>
  );
};

export default ForumManagement;

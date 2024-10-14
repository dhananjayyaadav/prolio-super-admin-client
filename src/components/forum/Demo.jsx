

import React, { useState } from "react";
import {
  Users,
  Menu,
  Compass,
  Mail,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  LayoutDashboard,
} from "lucide-react";
import "typeface-poppins";
import forumBanner from "../../assets/forum/forumBanner.png";
import ForumModal from "./ForumModal";
import ForumChat from "./ForumChat";
import ForumRequests from "./ForumRequests";
import ManageProduct from "./ManageProduct"; // Import the ManageProduct component

const Forum = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("home");

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleNavClick = (view) => {
    setActiveView(view);
    if (view === "myForums") {
      setIsSidebarCollapsed(true);
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
            <MoreVertical size={20} className="text-gray-500" />
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
            label: "Manage Product",
            view: "manageProduct",
          },
          { icon: <Users size={20} />, label: "My Forums", view: "myForums" },
          { icon: <Compass size={20} />, label: "Explore", view: "explore" },
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
          >
            {item.icon}
            {!isSidebarCollapsed && <span className="ml-2">{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );

  // Secondary sidebar for "My Forums"
  const renderMyForumsSidebar = () => (
    <div className="w-64 bg-white shadow-md">
      <div className="flex items-center p-4 border-b">
        <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white">
          <Users size={20} />
        </div>
        <span className="ml-2 text-lg font-semibold">Surya Suri</span>
        <button className="ml-auto text-gray-600">
          <Menu size={20} />
        </button>
      </div>
      <button
        className="w-full py-2 px-4 mt-4 bg-blue-800 text-white rounded flex items-center justify-center"
        onClick={openAddModal}
      >
        <span className="mr-2">+</span> Add Forum
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
          Home
        </button>
        <button
          className={`flex items-center px-4 py-2 w-full ${
            activeView === "myForums"
              ? "bg-blue-100 text-blue-800"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => handleNavClick("myForums")}
        >
          <Users size={20} className="mr-2" /> Group
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
        <h1 className="w-full mx-auto bg-white shadow-lg rounded-lg p-6 text-2xl font-bold mb-6">
          {activeView === "myForums" ? "My Forums" : "Forum Management"}
        </h1>

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
          <ForumChat onClose={() => handleNavClick("home")} />
        )}

        {activeView === "ForumRequests" && <ForumRequests />}

        {activeView === "manageProduct" && <ManageProduct />}

        {["explore"].includes(activeView) && (
          <p className="text-gray-600">This view is under construction.</p>
        )}
      </div>

      {/* Add Forum Modal */}
      <ForumModal isOpen={isAddModalOpen} onClose={closeAddModal} />
    </div>
  );
};

export default Forum;












// import React, { useState } from "react";
// import { Users, Menu, Search } from "lucide-react";
// import "typeface-poppins";
// import forumBanner from "../../assets/forum/forumBanner.png";
// import AddForum from "./AddForum";
// import ForumChatModel from "./ForumChatModel";

// const ForumManagement = () => {
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [activeView, setActiveView] = useState("home"); // 'home' or 'chat'

//   const openAddModal = () => setIsAddModalOpen(true);
//   const closeAddModal = () => setIsAddModalOpen(false);

//   const openForumChatModel = () => setActiveView("chat");
//   const closeForumChatModel = () => setActiveView("home");

//   return (
//     <div className="flex h-screen bg-gray-100 font-poppins">
//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-md">
//         <div className="flex items-center p-4 border-b">
//           <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white">
//             <Users size={20} />
//           </div>
//           <span className="ml-2 text-lg font-semibold">Surya Suri</span>
//           <button className="ml-auto text-gray-600">
//             <Menu size={20} />
//           </button>
//         </div>
//         <button
//           className="w-full py-2 px-4 mt-4 bg-blue-800 text-white rounded flex items-center justify-center"
//           onClick={openAddModal}
//         >
//           <span className="mr-2">+</span> Add Forum
//         </button>
//         {/* Navigation Items */}
//         <nav className="mt-6 space-y-2">
//         <button
//             className={`flex items-center px-4 py-2 w-full ${
//               activeView === "home"
//                 ? "bg-blue-100 text-blue-800"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//             onClick={closeForumChatModel}
//           >
//             Home
//           </button>
//           <button
//             className={`flex items-center px-4 py-2 w-full ${
//               activeView === "chat"
//                 ? "bg-blue-100 text-blue-800"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//             onClick={openForumChatModel}
//           >
//             <Users size={20} className="mr-2" /> Group
//           </button>
   
//         </nav>
//       </div>
//       {/* Main Content */}
//       <div className="flex-1 p-8 overflow-auto">
//         <h1 className="w-full mx-auto bg-white shadow-lg rounded-lg p-6 text-2xl font-bold mb-6">
//           Forum Management
//         </h1>

//         {activeView === "home" ? (
//           // Home View (Forum Banner)
//           <div className="bg-white rounded-lg shadow-md p-8 text-center mb-4">
//             <div className="mb-6">
//               <img src={forumBanner} alt="forumBanner" className="mx-auto" />
//             </div>
//             <p className="text-gray-600 mb-6">
//               Prolio fosters seamless communication and collaboration
//               <br />
//               among vendors, enabling real-time updates and efficient project
//               coordination.
//             </p>
//             <button
//               className="bg-blue-800 text-white py-2 px-4 rounded"
//               onClick={openAddModal}
//             >
//               Create Forum
//             </button>
//           </div>
//         ) : (
//           // Chat View
//           <ForumChatModel onClose={closeForumChatModel} />
//         )}
//       </div>
//       {/* Add Forum Modal */}
//       <AddForum isOpen={isAddModalOpen} onClose={closeAddModal} />
//     </div>
//   );
// };

// export default ForumManagement;
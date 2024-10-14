import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import { BsFilePostFill } from "react-icons/bs";
import { TiPencil } from "react-icons/ti";
import { LiaClipboardCheckSolid } from "react-icons/lia";
import { CiSettings } from "react-icons/ci";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoCubeOutline } from "react-icons/io5";
import { GrAnalytics } from "react-icons/gr";
import { FaRegLightbulb, FaRegQuestionCircle } from "react-icons/fa";
import sidBarImage from "../../assets/sidebar.png";
import { CgBox } from "react-icons/cg";
import { LuKey } from "react-icons/lu";
import { TbCategoryPlus } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux"; // Import useDispatch
import { clearToken } from "../../store/tokenSlice"; // Import the clearToken action
import Swal from "sweetalert2"; // Import SweetAlert

function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.token.user);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // const [user, setUser] = useState(true);

  const [navLinks, setNavLinks] = useState([
    {
      title: "Dashboard",
      icon: <Icon icon="mingcute:grid-2-fill" className="bg-transparent" />,
      path: "/admin",
    },
    {
      title: "Forum Management",
      icon: <Icon icon="mingcute:grid-2-fill" className="bg-transparent" />,
      path: "/admin/forum",
    },
    {
      title: "Company Profiles",
      icon: <CgBox className="bg-transparent" />,
      path: "/admin/company",
    },
    {
      title: "Question Bank",
      icon: <CgBox className="bg-transparent" />,
      path: "/admin/type",
    },
    {
      title: "Categories",
      icon: <TbCategoryPlus className="bg-transparent" />,
      path: "/admin/categories",
    },
    {
      title: "Products",
      icon: <IoCubeOutline className="bg-transparent" />,
      path: user ? "/admin/product" : "/login",
    },
    {
      title: "Opportunities",
      icon: <FaRegLightbulb className="bg-transparent" />,
      path: user ? "/admin/opportunities" : "/login",
    },
    {
      title: "Enquiries",
      icon: <FaPeopleGroup className="bg-transparent" />,
      path: user ? "/admin/admin/enquiries" : "/login",
    },
    {
      title: "Analytics",
      icon: <GrAnalytics className="bg-transparent" />,
      path: user ? "/admin/analytics" : "/login",
    },
    {
      title: "Business Tips",
      icon: <TiPencil className="bg-transparent" />,
      path: user ? "/admin/product-tips" : "/login",
    },

    {
      title: "Faqs",
      icon: <FaRegQuestionCircle className="bg-transparent" />,
      path: user ? "/admin/admin/faqs" : "/login",
    },
    {
      title: "Banner Management",
      icon: <CiSettings className="bg-transparent" />,
      path: user ? "/admin/banner" : "/login",
    },
    {
      title: "Logout", // Add the logout option
      icon: <LuKey className="bg-transparent" />,
      path: "#",
      onClick: () => handleLogout(), // Call handleLogout function
    },
  ]);
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(clearToken()); // Clear token in Redux store
        Swal.fire("Logged out!", "You have been logged out.", "success");
        // Optionally, redirect to login page
        window.location.href = "/"; // Uncomment this if you want to redirect
      }
    });
  };

  return (
    <div
      className="md:w-[230px] left-0 overflow-y-auto h-full w-[60px] bg-white fixed md:block z-0 pt-10"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="w-full flex flex-col items-start gap-2 border-slate-300 bg-[#fff] py-5">
        {navLinks.map((link) => (
          <Link
            key={link.title}
            to={link.path}
            className={`flex items-center gap-2 w-full hover:bg-blue-50 px-6 py-3 cursor-pointer ${
              location.pathname === link.path
                ? "bg-blue-200 text-blue-900"
                : "bg-transparent text-gray-500"
            }`}
            onClick={link.onClick} // Handle click for logout
          >
            {link.icon}
            <span className="font-bold font-santoshi bg-transparent text-[15px]">
              {link.title}
            </span>
            {location.pathname === link.path && (
              <div className="absolute right-0 h-7 rounded bg-blue-900 w-1" />
            )}
          </Link>
        ))}
      </div>
      <div className="w-full">
        <img className="object-center" src={sidBarImage} alt="sidebarImage" />
      </div>
    </div>
  );
}
//   return (
//     <div
//       className="md:w-[230px] left-0  overflow-y-auto h-full w-[60px] bg-white fixed  md:block z-0 pt-10 "
//       style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//     >
//       <div className="w-full  flex flex-col items-start gap-2 border-slate-300 bg-[#fff] py-5 r">
//         {navLinks.map((link, index) => (
//           <Link
//             key={link.title}
//             to={link.path}
//             className={`flex items-center gap-2 w-full hover:bg-blue-50 px-6 py-3 cursor-pointer ${
//               location.pathname === link.path
//                 ? "bg-blue-200 text-blue-900"
//                 : "bg-transparent text-gray-500"
//             }`}
//           >
//             {link.icon}
//             <span className="font-bold font-santoshi bg-transparent text-[15px]">
//               {link.title}
//             </span>
//             {location.pathname === link.path && (
//               <div className="absolute right-0 h-7 rounded bg-blue-900 w-1" />
//             )}
//           </Link>
//         ))}
//       </div>
//       <div className="w-full">
//         <img className="object-center" src={sidBarImage} alt="sidebarImage" />
//       </div>
//     </div>
//     // <p>h</p>
//   );
// }

export default Sidebar;

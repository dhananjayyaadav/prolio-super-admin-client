import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import CompanyList from "../components/Admin/CompanyList";
import ViewTypes from "../components/Types/ViewTypes";
import AddCategories from "../components/Categories/AddCategories";
import CategoriyList from "../components/Categories/CategoriyList";
import CreateTypes from "../components/Types/CreateTypes";
import EditType from "../components/Types/EditType";
import EditCategory from "../components/Categories/EditCategory";
import BuyingTipsPage from "../components/ProductBuyingTips/BuyingTipsPage";
import Product from "../components/Product/Product";
import Opportunities from "../components/Opportunities/Opportunities";
import BannerManagement from "../components/Banner/BannerManagement";
import forumManagement from "../components/forum/ForumManagement";
import AdminDashboard from "../components/Admin/AdminDashboard";
import LogPage from "../components/Logs/LogPage";import Department from "../components/Departments/Department";

function HomePage() {
  return (
    <>
      <Navbar />
      <div className="mt-16 h-screen   w-full flex bg-blue-50">
        {/* <div className="w-[17%] "> */}
        <Sidebar />
        {/* </div> */}

        <div className="w-[80%]    bg-blue-50  ">
          <Routes>
            <Route path="/admin/forum" element={<forumManagement />}></Route>
            <Route path="/admin/company" element={<CompanyList />}></Route>
            <Route path="/admin/type" element={<ViewTypes />}></Route>
            <Route
              path="/admin/add-categories"
              element={<AddCategories />}
            ></Route>
            <Route path="/admin/categories" element={<CategoriyList />}></Route>
            <Route path="/admin/add-type" element={<CreateTypes />}></Route>
            <Route path="/admin/edit-type/:id" element={<EditType />}></Route>
            <Route
              path="/admin/edit-categorirs/:id"
              element={<EditCategory />}
            ></Route>
            <Route
              path="/admin/product-tips"
              element={<BuyingTipsPage />}
            ></Route>
            <Route path="/admin/product" element={<Product />}></Route>
            <Route path="/admin/banner" element={<BannerManagement />}></Route>
            <Route path="/admin/logs" element={<LogPage />}></Route>
            <Route path="/admin" element={<AdminDashboard />}></Route>
            <Route path="/admin/department" element={<Department />}></Route>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default HomePage;

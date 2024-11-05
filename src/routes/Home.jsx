import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
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
import BannerManagement from "../components/Banner/BannerManagement";
import Test from "../components/Banner/Test";
import ForumManagement from "../components/forum/ForumManagement";
import Analytics from "../components/analytics/Analytics";
import LoginPage from "../pages/LoginPage"; // Import the LoginPage
import LogPage from "../components/Logs/LogPage";
import AdminDashboard from "../components/Admin/AdminDashboard";
import Department from "../components/Departments/Department";
import Report from "../components/Report/Report";
import ProductSinglePage from "../components/Product/ProductSinglePage";

function Home() {
  const token = useSelector((state) => state.token.token);
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen">
      {/* Show the Navbar only if the user is logged in and not on the login page */}
      {token && (
        <div className="bg-blue-500 text-white p-4 w-full">
          <Navbar />
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        {token && (
          <div className="w-56 bg-white text-white p-4 overflow-auto">
            <Sidebar />
          </div>
        )}
        <div
          className={`flex-1 overflow-auto p-4 mt-5 ${
            token ? "bg-blue-50" : ""
          }`}
        >
          <Routes>
            {/* Public Route: Login Page */}
            {/* Redirect to admin dashboard if already authenticated */}
            <Route
              path="/"
              element={token ? <Navigate to="/admin" replace /> : <LoginPage />}
            />

            {/* Redirect to login if user is not authenticated and tries to access any /admin route */}
            {!token ? (
              <Route path="*" element={<Navigate to="/" />} />
            ) : (
              // Private Routes: Only accessible if the user is logged in
              <>
                <Route path="/admin/test" element={<Test />} />
                <Route path="/admin/forum" element={<ForumManagement />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/company" element={<CompanyList />} />
                <Route path="/admin/type" element={<ViewTypes />} />
                <Route
                  path="/admin/add-categories"
                  element={<AddCategories />}
                />
                <Route path="/admin/categories" element={<CategoriyList />} />
                <Route path="/admin/add-type" element={<CreateTypes />} />
                <Route path="/admin/edit-type/:id" element={<EditType />} />
                <Route
                  path="/admin/edit-categories/:id"
                  element={<EditCategory />}
                />
                <Route
                  path="/admin/product-tips"
                  element={<BuyingTipsPage />}
                />
                <Route path="/admin/product" element={<Product />} />
                <Route
                  path="/admin/product/:id"
                  element={<ProductSinglePage />}
                />
                <Route path="/admin/banner" element={<BannerManagement />} />
                <Route path="/admin/logs" element={<LogPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/department" element={<Department />} />
                <Route path="/admin/reports" element={<Report />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
}
export default Home;

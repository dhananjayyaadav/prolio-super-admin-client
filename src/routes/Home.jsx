import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
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

function Home() {
  return (
    // <Routes>
    //   <Route path="/*" element={<HomePage />} />
    // </Routes>

    <div className="flex flex-col h-screen">
      <div className="bg-blue-500 text-white p-4 w-full">
        {" "}
        {/* Navbar with Tailwind */}
        <Navbar />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-56 bg-white text-white p-4 overflow-auto">
          {/* Sidebar with Tailwind */}
          <Sidebar />
        </div>
        <div className="flex-1 overflow-auto p-4 mt-5  bg-blue-50">
          {/* Main content with Tailwind */}
          <Routes>
            <Route path="/test" element={<Test />} />
            <Route path="/forum" element={<ForumManagement />} />
            <Route path="/company" element={<CompanyList />} />
            <Route path="/type" element={<ViewTypes />} />
            <Route path="/add-categories" element={<AddCategories />} />
            <Route path="/categories" element={<CategoriyList />} />
            <Route path="/add-type" element={<CreateTypes />} />
            <Route path="/edit-type/:id" element={<EditType />} />
            <Route path="/edit-categories/:id" element={<EditCategory />} />
            <Route path="/product-tips" element={<BuyingTipsPage />} />
            <Route path="/product" element={<Product />} />
            <Route path="/banner" element={<BannerManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Home;

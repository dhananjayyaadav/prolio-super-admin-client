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
            <Route path="/forum" element={<forumManagement />}></Route>
            <Route path="/company" element={<CompanyList />}></Route>
            <Route path="/type" element={<ViewTypes />}></Route>
            <Route path="/add-categories" element={<AddCategories />}></Route>
            <Route path="/categories" element={<CategoriyList />}></Route>
            <Route path="/add-type" element={<CreateTypes />}></Route>
            <Route path="/edit-type/:id" element={<EditType />}></Route>
            <Route
              path="/edit-categorirs/:id"
              element={<EditCategory />}
            ></Route>
            <Route path="/product-tips" element={<BuyingTipsPage />}></Route>
            <Route path="/product" element={<Product />}></Route>
            <Route path="/banner" element={<BannerManagement />}></Route>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default HomePage;

// AuthenticatedLayout.js
import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

function AuthenticatedLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="mt-16 h-screen w-full flex bg-blue-50">
        <Sidebar />
        <div className="w-[80%] bg-blue-50">{children}</div>
      </div>
    </>
  );
}

export default AuthenticatedLayout;

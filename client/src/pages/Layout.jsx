import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { dummyUserData } from "../assets/assets";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";

const Layout = () => {
  const user = useSelector((state) => state.user.value);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return user ? (
    <div className="w-full flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 bg-slate-50">
        <Outlet />
      </div>

      {sidebarOpen ? (
        <X
          className="absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 right-4 z-50 w-11 h-11 rounded-xl bg-white/80 backdrop-blur border border-slate-200 shadow-sm hover:shadow-md flex flex-col justify-center px-3 gap-1.5 active:scale-95 transition sm:hidden"
        >
          <span className="w-5 h-0.5 bg-slate-800 rounded-full" />
          <span className="w-4 h-0.5 bg-slate-800 rounded-full" />
          <span className="w-3 h-0.5 bg-slate-800 rounded-full" />
        </button>
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 text-gray-900">
      {/* Sidebar: sticky on larger screens, slide-in on mobile */}
      <div
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 sm:static sm:shadow-none`}
      >
        <Sidebar onLinkClick={closeSidebar} />
      </div>

      {/* Backdrop when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 sm:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main layout */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Navbar */}
        <Navbar onMenuClick={toggleSidebar} />

        {/* Scrollable content and sticky footer */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

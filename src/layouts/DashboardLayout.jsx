import { useState } from "react";
import { Outlet } from "react-router";
import DashboardSidebar from "../components/DashboardSidebar";
import { GoSidebarCollapse } from "react-icons/go";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="sidebar-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Page Content */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Top Navbar - Hidden on desktop and when sidebar is open on mobile/tablet */}
        <div
          className={`sticky top-0 z-30 flex h-16 w-full items-center justify-center bg-white/95 backdrop-blur-sm shadow-sm ${
            sidebarOpen ? "lg:hidden hidden" : "lg:hidden"
          }`}
        >
          <div className="navbar w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="sidebar-drawer"
                aria-label="open sidebar"
                className="btn btn-ghost btn-sm"
              >
                <GoSidebarCollapse className="h-5 w-5 text-[#ef4343]" />
              </label>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sidebar Content - Full Height */}
      <div className="drawer-side z-50 min-h-screen">
        <label
          htmlFor="sidebar-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        {/* Mobile Sidebar */}
        <div className="lg:hidden h-full">
          <DashboardSidebar
            isMobile={true}
            closeSidebar={() => setSidebarOpen(false)}
          />
        </div>
        {/* Desktop Sidebar */}
        <div className="hidden lg:block h-full">
          <DashboardSidebar isMobile={false} closeSidebar={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

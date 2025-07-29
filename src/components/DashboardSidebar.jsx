import { Link, useLocation, useNavigate } from "react-router";
import {
  FaHome,
  FaUsers,
  FaFileAlt,
  FaPlus,
  FaDollarSign,
  FaSignOutAlt,
  FaUser,
  FaTint,
  FaGlobe,
  FaHandsHelping,
  FaRegHeart,
} from "react-icons/fa";
import { GoSidebarExpand } from "react-icons/go";
import { AuthContext } from "../providers/AuthProvider";
import Swal from "sweetalert2";
import { useContext } from "react";
import useRole from "../hooks/useRole";

const DashboardSidebar = ({ closeSidebar, isMobile = false }) => {
  const { user, logOut } = useContext(AuthContext);
  const { role } = useRole();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You'll need to log in again to access the dashboard",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4343",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      backdrop: "rgba(0,0,0,0.1)",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut()
          .then(() => {
            Swal.fire({
              title: "Logged out!",
              text: "You have been successfully logged out",
              icon: "success",
              confirmButtonColor: "#ef4343",
              timer: 1500,
            });
            navigate("/login");
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text: error.message || "Failed to log out",
              icon: "error",
              confirmButtonColor: "#ef4343",
            });
          });
      }
    });
  };

  const getRoleIcon = () => {
    switch (role) {
      case "admin":
        return <FaGlobe className="mr-1" />;
      case "volunteer":
        return <FaHandsHelping className="mr-1" />;
      case "donor":
        return <FaTint className="mr-1" />;
    }
  };

  const getNavigationItems = () => {
    if (!user) return []; // Return empty array if no user

    const baseItems = [
      { name: "Dashboard", href: "/dashboard", icon: FaHome },
      { name: "Profile", href: "/dashboard/profile", icon: FaUser },
    ];

    if (role === "donor") {
      return [
        ...baseItems,
        {
          name: "My Requests",
          href: "/dashboard/my-donation-requests",
          icon: FaTint,
        },
        {
          name: "Create Request",
          href: "/dashboard/create-donation-request",
          icon: FaPlus,
        },
      ];
    }

    if (role === "admin") {
      return [
        ...baseItems,
        { name: "All Users", href: "/dashboard/all-users", icon: FaUsers },
        {
          name: "All Blood Donation Request",
          href: "/dashboard/all-blood-donation-request",
          icon: FaTint,
        },
        {
          name: "Content Management",
          href: "/dashboard/content-management",
          icon: FaFileAlt,
        },
        { name: "Funding", href: "/dashboard/funding", icon: FaDollarSign },
      ];
    }

    if (role === "volunteer") {
      return [
        ...baseItems,
        {
          name: "All Blood Donation Request",
          href: "/dashboard/all-blood-donation-request",
          icon: FaTint,
        },
        {
          name: "Content Management",
          href: "/dashboard/content-management",
          icon: FaFileAlt,
        },
      ];
    }

    return baseItems;
  };

  return (
    <div className="flex flex-col justify-between w-64 min-h-full bg-white text-base-content border-r border-[#64748b]/30">
      {/* Top part of sidebar: Logo and Navigation */}
      <div>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-[#64748b]/30">
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={closeSidebar}
          >
            <div className="p-2 bg-gradient-to-tr from-[#ef4343] to-[#ff6b8b] rounded-lg shadow-md">
              <FaRegHeart className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-[#ef4343]">BloodConnect</span>
          </Link>

          {isMobile && (
            <button
              onClick={closeSidebar}
              className="btn btn-ghost btn-sm p-1 text-[#64748b] hover:text-[#ef4343]"
              aria-label="Close sidebar"
            >
              <GoSidebarExpand className="h-5 w-5 text-[#ef4343]" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <nav className="space-y-2">
            {getNavigationItems().map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-2 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#ef4343] text-white"
                      : "text-gray-600 hover:text-[#ef4343] hover:bg-[#ef4343]/10"
                  }`}
                  onClick={closeSidebar}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile & Logout - Fixed Section */}
      {user && (
        <div className="p-4 border-t border-[#64748b]/30">
          <div className="flex items-center space-x-3 mb-3">
            <div className="avatar">
              <div className="w-8 rounded-full ring-2 ring-[#ef4343]">
                <img
                  src={
                    user.photoURL ||
                    "https://img.icons8.com/?size=100&id=H101gtpJBVoh&format=png&color=000000"
                  }
                  alt={user.displayName || "User"}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.displayName || "User"}
              </p>
              <p className="text-xs text-[#64748b] capitalize flex items-center">
                {getRoleIcon()}
                {role === "admin" && "Admin"}
                {role === "volunteer" && "Volunteer"}
                {role === "donor" && "Donor"}
              </p>
            </div>
          </div>
          <button
            className="btn bg-transparent border-none shadow-none btn-sm w-full justify-start text-[#ef4343] hover:text-white hover:bg-[#ef4343]"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardSidebar;

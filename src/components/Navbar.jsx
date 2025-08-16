import { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaTachometerAlt,
  FaHandHoldingMedical,
  FaBook,
  FaMoneyBillWave,
  FaRegHeart,
} from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";
import Swal from "sweetalert2";
import useRole from "../hooks/useRole";
import { FaMagnifyingGlass } from "react-icons/fa6";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logOut } = useContext(AuthContext);

  const { role, loading: roleLoading } = useRole();

  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-item")
      ) {
        setIsMobileMenuOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        !event.target.closest(".user-menu-item")
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logOut()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Logout Successful",
          timer: 1500,
          showConfirmButton: false,
        });
        setIsUserMenuOpen(false);
        navigate("/");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Logout Failed",
          text: error.message || "Something went wrong",
        });
      });
  };

  const commonLinks = [
    {
      name: "Donation Requests",
      href: "/donation-requests",
      icon: FaHandHoldingMedical,
    },
    {
      name: "Search Donors",
      href: "/search",
      icon: FaMagnifyingGlass,
    },
    { name: "Blog", href: "/blog", icon: FaBook },
  ];

  const authLinks =
    !isLoading && user
      ? [
          { name: "Funding", href: "/funding", icon: FaMoneyBillWave },
          { name: "Dashboard", href: "/dashboard", icon: FaTachometerAlt },
        ]
      : [];

  const allLinks = [...commonLinks, ...authLinks];

  const isActive = (path) => location.pathname === path;

  if (isLoading) {
    return (
      <nav className="bg-[#fffffff2] backdrop-blur-sm border-b sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-tr from-[#ef4343] to-[#ff6b8b] rounded-lg shadow-md">
              <FaRegHeart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#ef4343]">
              BloodConnect
            </span>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-[#fffffff2] backdrop-blur-sm border-b sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-tr from-[#ef4343] to-[#ff6b8b] rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
              <FaRegHeart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#ef4343]">
              BloodConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {allLinks.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center text-sm font-medium transition-colors hover:text-[#ef4343] ${
                  isActive(item.href)
                    ? "text-[#ef4343] border-b-2 border-[#ef4343]"
                    : "text-[#64748b]"
                }`}
              >
                <item.icon className="mr-1.5" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  className="btn btn-ghost btn-circle avatar ring-2 ring-[#ef4343] hover:bg-[#ef4343]/10"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-label="User menu"
                >
                  <div className="w-10 rounded-full">
                    <img
                      src={
                        user?.photoURL ||
                        "https://img.icons8.com/?size=100&id=H101gtpJBVoh&format=png&color=000000"
                      }
                      alt={user?.displayName || "User"}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </button>

                {isUserMenuOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-3 w-56 z-50 bg-white rounded-lg shadow-lg p-2 border border-gray-100"
                  >
                    <li className="px-3 py-2">
                      <p className="text-sm text-[#ef4343] mb-2 font-medium">
                        {user?.displayName || "User"}
                      </p>
                      <p className="text-xs text-[#64748b] capitalize">
                        {!roleLoading ? role : "Loading..."}
                      </p>
                    </li>
                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-b border-[#64748b]"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-[#64748b]"></span>
                      </div>
                    </div>
                    <li>
                      <Link
                        to="/dashboard"
                        className="flex items-center text-[#64748b] hover:bg-[#ef4343]/10 hover:text-[#ef4343] px-3 py-2 rounded-lg user-menu-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsUserMenuOpen(false);
                        }}
                      >
                        <FaTachometerAlt className="mr-2" />
                        Dashboard
                      </Link>
                    </li>
                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-b border-[#64748b]"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-[#64748b]"></span>
                      </div>
                    </div>
                    <li>
                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLogout();
                          }}
                          className="flex items-center border-[#ef4343] text-[#ef4343] hover:bg-[#ef4343] hover:text-white w-full px-3 py-2 rounded-lg text-left user-menu-item"
                        >
                          <FaSignOutAlt className="mr-2" />
                          Log out
                        </button>
                      </div>
                    </li>
                  </motion.ul>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`btn bg-transparent shadow-none text-[#64748b] hover:text-white hover:bg-[#ef4343] ${
                    isActive("/login")
                      ? "text-[#ef4343] border-[#ef4343]"
                      : "text-[#64748b] border-none"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`btn bg-[#ef4343] hover:opacity-70 ${
                    isActive("/register")
                      ? " text-[#ef4343] bg-transparent shadow-none border-[#ef4343]"
                      : "text-white border-none"
                  }`}
                >
                  Join as Donor
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden" ref={mobileMenuRef}>
            <button
              className="btn text-[#ef4343] bg-transparent shadow-none border-[#ef4343] hover:bg-[#ef4343]/10 btn-circle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
          >
            <div className="py-4 space-y-2">
              {allLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 mobile-menu-item ${
                    isActive(item.href)
                      ? "bg-[#ef4343] text-white"
                      : "text-[#64748b] hover:bg-[#ef4343] hover:text-white"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="mr-3" />
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-gray-200 mt-3 pt-3 mx-2">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-3 text-sm font-medium text-[#64748b] hover:bg-[#ef4343]/10 hover:text-[#ef4343] rounded-lg mobile-menu-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <FaTachometerAlt className="mr-3" />
                      Dashboard
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium border-[#ef4343] text-[#ef4343] hover:bg-[#ef4343] hover:text-white rounded-lg mobile-menu-item"
                    >
                      <FaSignOutAlt className="mr-3" />
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMobileMenuOpen(false);
                      }}
                      className="btn bg-transparent shadow-none text-[#ef4343] border-[#ef4343] w-full justify-center mb-2 mobile-menu-item"
                    >
                      <FaUser className="mr-1" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMobileMenuOpen(false);
                      }}
                      className="btn bg-[#ef4343] border-none hover:opacity-70 w-full mobile-menu-item"
                    >
                      Join as Donor
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;

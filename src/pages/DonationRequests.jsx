import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxiosPublic from "../hooks/axiosPublic";
import {
  FaEye,
  FaTint,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaSearch,
  FaThLarge,
  FaList,
} from "react-icons/fa";
import Loading from "../pages/Loading";
import { RiFileListLine } from "react-icons/ri";
import { useState, useMemo, useEffect } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const DonationRequests = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  //State Management
  const [currentPage, setCurrentPage] = useState(1);
  const [layout, setLayout] = useState("grid-3");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const itemsPerPage = 6;

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Data Fetching
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["public-pending-requests"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/donation-requests/pending");
      return data;
    },
    refetchOnMount: "always",
  });

  // Debounce Search Term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Implemented efficient client-side sorting and filtering
  const processedRequests = useMemo(() => {
    const filtered = requests.filter((req) =>
      [
        req.recipientName,
        req.recipientDistrict,
        req.recipientUpazila,
        req.bloodGroup,
      ]
        .join(" ")
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase())
    );
    return filtered.sort((a, b) => {
      const dateA = new Date(a.donationDate);
      const dateB = new Date(b.donationDate);
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [requests, debouncedSearchTerm, sortBy]);

  // Updated pagination to use the sorted and filtered data
  const totalPages = Math.ceil(processedRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = processedRequests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handlers
  const handleViewDetails = (id) => navigate(`/donation-request/${id}`);
  const toggleLayout = () =>
    setLayout((prev) => (prev === "grid-3" ? "grid-2" : "grid-3"));

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hoursInt = parseInt(hours, 10);
    const suffix = hoursInt >= 12 ? "PM" : "AM";
    const formattedHours = ((hoursInt + 11) % 12) + 1;
    return `${formattedHours}:${minutes} ${suffix}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen dark:bg-gradient-to-br from-[#ef4343]/5 via-white to-[#ef4343]/10 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold text-[#ef4343]"
          >
            Pending Donation Requests
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg text-[#64748b] mt-2"
          >
            Find an opportunity to save a life.
          </motion.p>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-8 border border-gray-200 shadow-md"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="form-control relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search by name, location, blood group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-black pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4343] focus:border-transparent"
              />
              <FaSearch
                className="absolute left-3 top-3.5 text-gray-400"
                size={16}
              />
            </div>
            {/* Added sorting dropdown */}
            <div className="form-control w-full md:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select border border-gray-300 rounded-md focus:outline-none focus:ring-1 w-full bg-white text-black"
              >
                <option value="newest">Sort by Newest</option>
                <option value="oldest">Sort by Oldest</option>
              </select>
            </div>
            {/* Layout Toggle Button */}
            <div className="w-full md:w-auto flex items-center justify-center">
              <button
                onClick={toggleLayout}
                className="btn bg-transparent border-[#ef4343] text-[#ef4343] hover:bg-[#ef4343] hover:text-white shadow-none gap-2 w-full md:w-auto"
              >
                {layout === "grid-3" ? <FaList /> : <FaThLarge />}{" "}
                {layout === "grid-3" ? "2 Columns" : "3 Columns"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content Display */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loading />
            </motion.div>
          ) : processedRequests.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card bg-white shadow-xl border border-gray-200 text-center py-12"
            >
              <div className="card-body items-center">
                <RiFileListLine className="text-6xl text-[#ef4343] opacity-50 mb-4" />
                <h3 className="text-2xl font-semibold text-gray-700">
                  No Requests Found
                </h3>
                <p className="text-[#64748b] mt-2">
                  Your search did not return any results. Please try a different
                  search.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="data-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`grid grid-cols-1 gap-6 ${
                layout === "grid-3"
                  ? "md:grid-cols-2 lg:grid-cols-3"
                  : "md:grid-cols-2"
              }`}
            >
              {paginatedRequests.map((request) => (
                <motion.div
                  key={request._id}
                  variants={itemVariants}
                  className="card bg-white shadow-xl border border-gray-200 transition-shadow hover:shadow-2xl flex flex-col"
                >
                  <div className="card-body flex-grow">
                    <div className="mb-4">
                      <h2 className="card-title text-gray-800 text-xl">
                        {request.recipientName}
                      </h2>
                      <div className="badge bg-red-100 text-red-800 border-none font-bold p-3 mt-2">
                        <FaTint className="mr-1" />
                        {request.bloodGroup}
                      </div>
                    </div>
                    <div className="space-y-3 text-sm text-[#64748b] flex-grow">
                      <p className="flex items-start gap-2">
                        <FaMapMarkerAlt className="mt-1" />
                        <span>
                          <strong className="text-gray-800">Location:</strong>{" "}
                          {request.recipientUpazila},{" "}
                          {request.recipientDistrict}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FaCalendarAlt />
                        <span>
                          <strong className="text-gray-800">Date:</strong>{" "}
                          {new Date(request.donationDate).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <FaClock />
                        <span>
                          <strong className="text-gray-800">Time:</strong>{" "}
                          {formatTime(request.donationTime)}
                        </span>
                      </p>
                    </div>
                    <div className="card-actions justify-end mt-4">
                      <button
                        onClick={() => handleViewDetails(request._id)}
                        className="btn bg-[#ef4343] text-white border-none hover:bg-[#d13838] w-full"
                      >
                        <FaEye /> View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-between items-center mt-8"
          >
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, processedRequests.length)} of{" "}
              {processedRequests.length} results
            </p>
            <div className="join">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                className="join-item btn btn-sm bg-transparent border-[#ef4343] text-[#ef4343] hover:bg-[#ef4343] hover:text-white disabled:text-white disabled:border-none mr-2"
                disabled={currentPage === 1}
              >
                <MdNavigateBefore className="text-xl" />
              </button>
              <button className="join-item btn btn-sm pointer-events-none bg-transparent text-black mr-2 rounded-md">
                Page {currentPage} / {totalPages}
              </button>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                className="join-item btn btn-sm bg-transparent border-[#ef4343] text-[#ef4343] hover:bg-[#ef4343] hover:text-white disabled:text-white disabled:border-none"
                disabled={currentPage === totalPages}
              >
                <MdNavigateNext className="text-xl" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DonationRequests;

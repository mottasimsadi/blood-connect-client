import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosPublic from "../hooks/axiosPublic";
import { districts, upazilas, bloodGroups } from "../data/bangladeshData";
import {
  FaSearch,
  FaTint,
  FaMapMarkerAlt,
  FaCity,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Loading from "../pages/Loading";
import { motion, AnimatePresence } from "framer-motion";

const Search = () => {
  const axiosPublic = useAxiosPublic();

  // This state holds the real-time values from the form inputs
  const [searchParams, setSearchParams] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  // The query will be based on this state, not the real-time form state.
  const [activeSearchParams, setActiveSearchParams] = useState(searchParams);

  const [hasSearched, setHasSearched] = useState(false);

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

  const {
    data: donors = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    // The queryKey now depends on the 'active' search params, not the live form params.
    queryKey: ["search-donors", activeSearchParams],
    queryFn: async () => {
      const queryParams = new URLSearchParams(
        Object.fromEntries(
          // The fetch also uses the 'active' params.
          Object.entries(activeSearchParams).filter(([_, v]) => v !== "")
        )
      ).toString();

      const { data } = await axiosPublic.get(`/search-donors?${queryParams}`);
      return data;
    },
    enabled: false,
    onError: (error) => {
      console.error("Failed to search for donors:", error);
      Swal.fire({
        title: "Search Failed",
        text:
          error.message || "Could not retrieve donor data. Please try again.",
        icon: "error",
        confirmButtonColor: "#ef4343",
      });
    },
  });

  // This effect will run the search ONLY when activeSearchParams changes.
  useEffect(() => {
    if (hasSearched) {
      refetch();
    }
  }, [activeSearchParams, refetch, hasSearched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "district" && { upazila: "" }),
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (
      !searchParams.bloodGroup &&
      !searchParams.district &&
      !searchParams.upazila
    ) {
      Swal.fire({
        title: "No Criteria Selected",
        text: "Please select at least one search criterion.",
        icon: "info",
        confirmButtonColor: "#ef4343",
      });
      return;
    }

    setHasSearched(true);
    setActiveSearchParams(searchParams);
  };

  const isSearching = isLoading || isFetching;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#ef4343]/5 via-white to-[#ef4343]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-8"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold text-[#ef4343]"
          >
            Find a Blood Donor
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg text-[#64748b] mt-2"
          >
            Search for available donors in your area when you need it most.
          </motion.p>
        </motion.div>

        {/* Search Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card bg-white shadow-xl border border-gray-200 mb-12"
        >
          <div className="card-body">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Blood Group */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Blood Group</span>
                  </label>
                  <div className="relative">
                    <select
                      name="bloodGroup"
                      value={searchParams.bloodGroup}
                      onChange={handleChange}
                      className="select border border-gray-300 rounded-md focus:outline-none focus:ring-1 w-full pl-10 bg-white text-base-100 "
                    >
                      <option value="">Any Group</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                    <FaTint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  </div>
                </div>
                {/* District */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">District</span>
                  </label>
                  <div className="relative">
                    <select
                      name="district"
                      value={searchParams.district}
                      onChange={handleChange}
                      className="select border border-gray-300 rounded-md focus:outline-none focus:ring-1 w-full pl-10 bg-white text-base-100 "
                    >
                      <option value="">Any District</option>
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  </div>
                </div>
                {/* Upazila */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Upazila</span>
                  </label>
                  <div className="relative">
                    <select
                      name="upazila"
                      value={searchParams.upazila}
                      onChange={handleChange}
                      disabled={!searchParams.district}
                      className="select border border-gray-300 rounded-md focus:outline-none focus:ring-1 w-full pl-10 bg-white text-base-100 disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      <option value="">Any Upazila</option>
                      {searchParams.district &&
                        upazilas[searchParams.district]?.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                    </select>
                    <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  </div>
                </div>
              </div>
              <div className="card-actions justify-center pt-4">
                <button
                  type="submit"
                  className="btn bg-[#ef4343] text-white border-none hover:bg-[#d13838] w-full sm:w-auto"
                  disabled={isSearching}
                >
                  <FaSearch />{" "}
                  {isSearching ? (
                    <span
                      className="flex items-center justify-center bg-[#ef4343] text-white rounded-md border-none w-full h-full px-4 py-2 sm:w-auto opacity-80 cursor-not-allowed"
                      disabled
                    >
                      Searching...
                    </span>
                  ) : (
                    "Search Donors"
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Search Results Section */}
        <AnimatePresence mode="wait">
          {hasSearched && (
            <motion.div
              key="results-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {isSearching ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-center ">
                    <span className="loading loading-spinner loading-lg text-[#ef4343]"></span>
                  </div>
                </motion.div>
              ) : donors.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card bg-white shadow-xl border border-gray-200 text-center py-12"
                >
                  <div className="card-body items-center">
                    <FaMagnifyingGlass className="text-6xl text-[#ef4343] opacity-50 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">
                      No Donors Found
                    </h3>
                    <p className="text-[#64748b] mt-2">
                      Try adjusting your search criteria or expanding your
                      search area.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h2 className="text-2xl font-bold text-base-100 text-center mb-8">
                    Found{" "}
                    <span className="text-[#ef4343]">{donors.length}</span>{" "}
                    Matching Donor(s)
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {donors.map((donor) => (
                      <motion.div
                        key={donor._id}
                        variants={itemVariants}
                        className="card bg-white shadow-xl border border-gray-200 transition-shadow hover:shadow-2xl"
                      >
                        <div className="card-body">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="avatar">
                              <div className="w-16 rounded-full ring-2 ring-[#ef4343]">
                                <img
                                  src={
                                    donor.photoURL ||
                                    "https://img.icons8.com/?size=100&id=H101gtpJBVoh&format=png&color=000000"
                                  }
                                  alt={donor.name}
                                />
                              </div>
                            </div>
                            <div>
                              <h2 className="card-title text-gray-800">
                                {donor.name}
                              </h2>
                              <div className="badge bg-red-100 text-red-800 border-none font-bold p-3">
                                {donor.bloodGroup}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm text-[#64748b]">
                            <p className="flex items-center gap-2">
                              <FaEnvelope /> <span>{donor.email}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <FaMapMarkerAlt />{" "}
                              <span>
                                {donor.upazila}, {donor.district}
                              </span>
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Search;

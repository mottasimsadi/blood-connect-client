import { useState } from "react";
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

const Search = () => {
  const axiosPublic = useAxiosPublic();
  const [searchParams, setSearchParams] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  const [hasSearched, setHasSearched] = useState(false);

  const {
    data: donors = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["search-donors", searchParams],
    queryFn: async () => {
      const queryParams = new URLSearchParams(
        Object.fromEntries(
          Object.entries(searchParams).filter(([_, v]) => v !== "")
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
    refetch();
  };

  const isSearching = isLoading || isFetching;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ef4343]/5 via-white to-[#ef4343]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#ef4343]">
            Find a Blood Donor
          </h1>
          <p className="text-lg text-[#64748b] mt-2">
            Search for available donors in your area when you need it most.
          </p>
        </div>

        {/* Search Form Card */}
        <div className="card bg-white shadow-xl border border-gray-200 max-w-4xl mx-auto mb-12">
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
                    <span className="text-[#ef4343]">Searching...</span>
                  ) : (
                    "Search Donors"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Search Results Section */}
        {hasSearched && (
          <div>
            {isLoading ? (
              <Loading />
            ) : donors.length === 0 ? (
              <div className="card bg-white shadow-xl border border-gray-200 text-center py-12">
                <div className="card-body items-center">
                  <FaMagnifyingGlass className="text-6xl text-[#ef4343] opacity-50 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700">
                    No Donors Found
                  </h3>
                  <p className="text-[#64748b] mt-2">
                    Try adjusting your search criteria or expanding your search
                    area.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-base-100 text-center mb-8">
                  Found <span className="text-[#ef4343]">{donors.length}</span>{" "}
                  Matching Donor(s)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {donors.map((donor) => (
                    <div
                      key={donor._id}
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
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

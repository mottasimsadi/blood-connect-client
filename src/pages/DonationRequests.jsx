import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAxiosPublic from "../hooks/axiosPublic";
import {
  FaEye,
  FaTint,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import Loading from "../pages/Loading";
import { RiFileListLine } from "react-icons/ri";

const DonationRequests = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["public-pending-requests"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/donation-requests/pending");
      return data;
    },
  });

  const handleViewDetails = (id) => {
    navigate(`/dashboard/donation-request/${id}`);
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hoursInt = parseInt(hours, 10);
    const suffix = hoursInt >= 12 ? "PM" : "AM";
    const formattedHours = ((hoursInt + 11) % 12) + 1; // Converts 24h to 12h format
    return `${formattedHours}:${minutes} ${suffix}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ef4343]/5 via-white to-[#ef4343]/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#ef4343]">
            Pending Donation Requests
          </h1>
          <p className="text-lg text-[#64748b] mt-2">
            These are active requests from individuals in need. Your help can
            save a life.
          </p>
        </div>

        {isLoading ? (
          <Loading />
        ) : requests.length === 0 ? (
          <div className="card bg-white shadow-xl border border-gray-200 text-center py-12">
            <div className="card-body items-center">
              <RiFileListLine className="text-6xl text-[#ef4343] opacity-50 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700">
                No Pending Requests
              </h3>
              <p className="text-[#64748b] mt-2">
                There are currently no pending blood donation requests. Please
                check back later!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div
                key={request._id}
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
                        {request.recipientUpazila}, {request.recipientDistrict}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationRequests;
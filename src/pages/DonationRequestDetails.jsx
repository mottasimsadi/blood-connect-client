import { useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { AuthContext } from "../providers/AuthProvider";
import Loading from "../pages/Loading";
import {
  FaUser,
  FaMapMarkerAlt,
  FaTint,
  FaRegHospital,
  FaCalendarAlt,
  FaClock,
  FaRegCommentDots,
  FaHandHoldingHeart,
} from "react-icons/fa";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. Fetch the full details of this specific donation request
  const {
    data: request,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["donation-request-details", id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/donation-requests/${id}`);
      return data;
    },
    enabled: !!id,
  });

  // 2. Mutation to handle the "Donate" confirmation
  const { mutate: confirmDonation, isPending: isConfirming } = useMutation({
    mutationFn: () => {
      const donorInfo = {
        donorName: user.displayName,
        donorEmail: user.email,
      };
      return axiosSecure.patch(`/donation-requests/confirm/${id}`, donorInfo);
    },
    onSuccess: () => {
      Swal.fire({
        title: "Thank You!",
        text: "You have confirmed your donation. The status is now in-progress.",
        icon: "success",
        confirmButtonColor: "#ef4343",
      });
      queryClient.invalidateQueries({
        queryKey: ["donation-request-details", id],
      });
      navigate("/dashboard/my-donation-requests");
    },
    onError: (err) => {
      Swal.fire({
        title: "Action Failed",
        text:
          err.response?.data?.message ||
          "Could not confirm donation. Please try again.",
        icon: "error",
        confirmButtonColor: "#ef4343",
      });
    },
  });

  const handleConfirmDonation = () => {
    document.getElementById("confirm_donation_modal").close();
    confirmDonation();
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hoursInt = parseInt(hours, 10);
    const suffix = hoursInt >= 12 ? "PM" : "AM";
    const formattedHours = ((hoursInt + 11) % 12) + 1;
    return `${formattedHours}:${minutes} ${suffix}`;
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center text-[#ef4343]">
        Donation Request Details
      </h1>

      <div className="card bg-white shadow-xl border border-gray-200">
        <div className="card-body p-6 md:p-8 space-y-6">
          {/* All Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <p className="flex items-center gap-2">
              <FaUser className="text-[#ef4343]" />{" "}
              <strong>Recipient Name:</strong> {request.recipientName}
            </p>
            <p className="flex items-center gap-2">
              <FaTint className="text-[#ef4343]" />{" "}
              <strong>Blood Group:</strong> {request.bloodGroup}
            </p>
            <p className="flex items-center gap-2">
              <FaCalendarAlt className="text-[#ef4343]" />{" "}
              <strong>Donation Date:</strong>{" "}
              {new Date(request.donationDate).toLocaleDateString()}
            </p>
            <p className="flex items-center gap-2">
              <FaClock className="text-[#ef4343]" />{" "}
              <strong>Donation Time:</strong> {formatTime(request.donationTime)}
            </p>
            <p className="flex items-center gap-2 md:col-span-2">
              <FaRegHospital className="text-[#ef4343]" />{" "}
              <strong>Hospital:</strong> {request.hospitalName}
            </p>
            <p className="flex items-start gap-2 md:col-span-2">
              <FaMapMarkerAlt className="text-[#ef4343] mt-1" />{" "}
              <strong>Full Address:</strong> {request.fullAddress}
            </p>
            <p className="flex items-start gap-2 md:col-span-2">
              <FaRegCommentDots className="text-[#ef4343] mt-1" />{" "}
              <strong>Reason:</strong> {request.requestMessage}
            </p>
          </div>

          {/* Action Button */}
          <div className="card-actions justify-center pt-6">
            {request.status === "pending" &&
              user?.email !== request.requesterEmail && (
                <button
                  className="btn bg-[#ef4343] text-white border-none hover:bg-[#d13838]"
                  onClick={() =>
                    document
                      .getElementById("confirm_donation_modal")
                      .showModal()
                  }
                >
                  <FaHandHoldingHeart /> Donate
                </button>
              )}
            {request.status !== "pending" && (
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <p className="font-semibold text-gray-600">
                  This request is already {request.status}.
                </p>
              </div>
            )}
            {user?.email === request.requesterEmail && (
              <div className="text-center p-4 bg-yellow-100 text-yellow-800 rounded-lg">
                <p>This is your own request.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DaisyUI Modal */}
      <dialog id="confirm_donation_modal" className="modal">
        <div className="modal-box bg-white text-black">
          <h3 className="font-bold text-lg text-center">
            Confirm Your Donation
          </h3>
          <form method="dialog" className="space-y-4 p-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black mr-2">Your Name</span>
              </label>
              <input
                type="text"
                value={user?.displayName || ""}
                readOnly
                className="input text-black bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-black mr-3">Your Email</span>
              </label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="input text-black bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1"
              />
            </div>
            <div className="modal-action justify-center gap-2">
              <button className="btn text-[#ef4343] bg-transparent border-[#ef4343] hover:bg-[#ef4343] hover:text-white">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDonation}
                className="btn bg-[#ef4343] border-none hover:opacity-70 text-white"
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default DonationRequestDetails;

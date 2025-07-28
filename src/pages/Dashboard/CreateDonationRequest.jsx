import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useRole from "../../hooks/useRole";
import { districts, upazilas, bloodGroups } from "../../data/bangladeshData";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTint,
  FaRegHospital,
  FaCalendarAlt,
  FaClock,
  FaRegCommentDots,
  FaPaperPlane,
  FaCity,
} from "react-icons/fa";

const CreateDonationRequest = () => {
  const { user } = useContext(AuthContext);
  const { profile: userProfile, loading: profileLoading } = useRole();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Blocked user check
    if (userProfile?.status === "blocked") {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "Blocked users cannot create donation requests.",
        confirmButtonColor: "#ef4343",
      });
      return;
    }

    setIsSubmitting(true);

    const newRequest = {
      ...formData,
      requesterName: user.displayName,
      requesterEmail: user.email,
      status: "pending",
      createdAt: new Date(),
    };

    try {
      await axiosSecure.post("/donation-requests", newRequest);

      Swal.fire({
        icon: "success",
        title: "Request Created!",
        text: "Your blood donation request has been successfully created.",
        confirmButtonColor: "#ef4343",
      });

      navigate("/dashboard/my-donation-requests");
    } catch (error) {
      console.error("Failed to create request:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error.response?.data?.message ||
          "There was an error creating your request.",
        confirmButtonColor: "#ef4343",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "recipientDistrict" && { recipientUpazila: "" }),
    }));
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#ef4343]">
          Create a Donation Request
        </h1>
        <p className="text-[#64748b] mt-1">
          Fill out the form below to find a donor.
        </p>
      </div>

      {/* Form Card */}
      <div className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="card-body text-base-100 p-6 md:p-8">
          <div className="card-title text-2xl my-4 flex mx-auto">
            Donation Request Details
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Requester Info Section (Read-only) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Requester Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label mb-2">
                    <span className="label-text text-base-100 font-semibold">
                      Requester Name
                    </span>
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b] z-10" />
                    <input
                      type="text"
                      value={user?.displayName || ""}
                      readOnly
                      className="input input-bordered w-full pl-10 bg-gray-100 text-base-100"
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label mb-2">
                    <span className="label-text text-base-100 font-semibold">
                      Requester Email
                    </span>
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b] z-10" />
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="input input-bordered w-full pl-10 bg-gray-100 text-base-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Recipient's Information
              </h3>
              <div className="form-control">
                <label className="label mb-2">
                  <span className="label-text text-base-100 font-semibold">
                    Recipient's Name*
                  </span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b] z-10" />
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    placeholder="Enter recipient's full name"
                    required
                    className="input w-full text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 pl-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label mb-2">
                    <span className="label-text text-base-100 font-semibold">
                      Recipient's District*
                    </span>
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b] z-10" />
                    <select
                      name="recipientDistrict"
                      value={formData.recipientDistrict}
                      onChange={handleChange}
                      required
                      className="select border border-gray-300 rounded-md focus:outline-none focus:ring-1 w-full pl-10 bg-white text-base-100"
                    >
                      <option value="">Select district</option>
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-control">
                  <label className="label mb-2">
                    <span className="label-text text-base-100 font-semibold">
                      Recipient's Upazila*
                    </span>
                  </label>
                  <div className="relative">
                    <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b] z-10" />
                    <select
                      name="recipientUpazila"
                      value={formData.recipientUpazila}
                      onChange={handleChange}
                      required
                      disabled={!formData.recipientDistrict}
                      className="select border border-gray-300 rounded-md focus:outline-none focus:ring-1 w-full pl-10 bg-white text-base-100  disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      <option value="">Select upazila</option>
                      {formData.recipientDistrict &&
                        upazilas[formData.recipientDistrict]?.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Donation Location & Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Donation Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="form-control">
                  <label className="label mb-2">
                    <span className="label-text text-base-100 font-semibold">
                      Hospital Name*
                    </span>
                  </label>
                  <div className="relative">
                    <FaRegHospital className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b] z-10" />
                    <input
                      type="text"
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Dhaka Medical College"
                      className="input w-full text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 pl-10"
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label mb-2">
                    <span className="label-text text-base-100 font-semibold">
                      Full Address*
                    </span>
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b] z-10" />
                    <input
                      type="text"
                      name="fullAddress"
                      value={formData.fullAddress}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Zahir Raihan Rd, Dhaka"
                      className="input w-full text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 pl-10"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label mb-2">
                      <span className="label-text text-base-100 font-semibold">
                        Blood Group*
                      </span>
                    </label>
                    <div className="relative">
                      <FaTint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b] z-10" />
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        required
                        className="select border border-gray-300 rounded-md focus:outline-none focus:ring-1 w-full pl-10 bg-white text-base-100"
                      >
                        <option value="" className="">
                          Select blood group
                        </option>
                        {bloodGroups.map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label mb-2">
                      <span className="label-text text-base-100 font-semibold">
                        Donation Date*
                      </span>
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b] z-10" />
                      <input
                        type="date"
                        name="donationDate"
                        value={formData.donationDate}
                        onChange={handleChange}
                        required
                        className="input w-full text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 pl-10"
                      />
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label mb-2">
                      <span className="label-text text-base-100 font-semibold">
                        Donation Time*
                      </span>
                    </label>
                    <div className="relative">
                      <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b] z-10" />
                      <input
                        type="time"
                        name="donationTime"
                        value={formData.donationTime}
                        onChange={handleChange}
                        required
                        className="input w-full text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Message */}
            <div className="form-control">
              <label className="label mb-2">
                <span className="label-text text-base-100 font-semibold">
                  Request Message*
                </span>
              </label>
              <div className="relative">
                <FaRegCommentDots className="absolute left-3 top-1/6 -translate-y-1/2 h-4 w-4 text-[#64748b] z-10" />
                <textarea
                  name="requestMessage"
                  value={formData.requestMessage}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="textarea pl-10 text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 w-full "
                  placeholder="Please explain why you need blood and provide any additional details..."
                ></textarea>
              </div>
            </div>

            {/* Form Actions */}
            <div className="card-actions justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="btn bg-transparent border-[#ef4343] text-[#ef4343] shadow-none hover:bg-[#ef4343] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn bg-[#ef4343] hover:bg-[#d13838] border-none text-white"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <FaPaperPlane />
                )}
                {isSubmitting ? "Submitting..." : "Request Donation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDonationRequest;

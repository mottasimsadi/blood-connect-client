import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useRole from "../../hooks/useRole";
import { districts, upazilas, bloodGroups } from "../../data/bangladeshData";
import {
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
} from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import Loading from "../Loading";

const AllBloodDonationRequest = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { role, loading: roleLoading } = useRole();

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["all-donation-requests", statusFilter],
    queryFn: async () => {
      const url = `/donation-requests?status=${statusFilter}`;
      const { data } = await axiosSecure.get(url);
      return data;
    },
    enabled: role === "admin" || role === "volunteer",
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }) =>
      axiosSecure.patch(`/donation-requests/${id}`, { status }),
    onSuccess: () => {
      Swal.fire("Updated!", "The donation status has been updated.", "success");
      queryClient.invalidateQueries({ queryKey: ["all-donation-requests"] });
    },
    onError: (error) =>
      Swal.fire("Error!", error.message || "Could not update status.", "error"),
  });

  const { mutate: deleteRequest } = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/donation-requests/${id}`),
    onSuccess: () => {
      Swal.fire(
        "Deleted!",
        "The donation request has been deleted.",
        "success"
      );
      queryClient.invalidateQueries({ queryKey: ["all-donation-requests"] });
    },
    onError: (error) =>
      Swal.fire(
        "Error!",
        error.message || "Could not delete request.",
        "error"
      ),
  });

  const { mutate: updateRequest, isPending: isUpdating } = useMutation({
    mutationFn: (updatedData) =>
      axiosSecure.patch(
        `/donation-requests/${selectedRequest._id}`,
        updatedData
      ),
    onSuccess: () => {
      Swal.fire(
        "Updated!",
        "The donation request has been updated.",
        "success"
      );
      document.getElementById("edit_request_modal_all").close();
      queryClient.invalidateQueries({ queryKey: ["all-donation-requests"] });
    },
    onError: (error) =>
      Swal.fire(
        "Error!",
        error.message || "Could not update request.",
        "error"
      ),
  });

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    document.getElementById("view_details_modal_all").showModal();
  };
  const handleEdit = (request) => {
    setSelectedRequest(request);
    setEditFormData({ ...request });
    document.getElementById("edit_request_modal_all").showModal();
  };
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    updateRequest(editFormData);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "recipientDistrict" && { recipientUpazila: "" }),
    }));
  };

  const handleStatusChange = (id, newStatus) =>
    updateStatus({ id, status: newStatus });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRequest(id);
      }
    });
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "badge-warning",
      inprogress: "badge-info",
      done: "badge-success",
      canceled: "badge-error",
    };
    return styles[status] || "badge-ghost";
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hoursInt = parseInt(hours, 10);
    const suffix = hoursInt >= 12 ? "PM" : "AM";
    const formattedHours = ((hoursInt + 11) % 12) + 1; // Converts 24h to 12h format
    return `${formattedHours}:${minutes} ${suffix}`;
  };

  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = requests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (isLoading || roleLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="mx-auto text-center">
        <h1 className="text-3xl font-bold text-[#ef4343]">
          All Blood Donation Requests
        </h1>
        <p className="text-gray-500 mt-1">
          Manage and oversee all requests from users.
        </p>
      </div>

      <div className="card bg-white shadow-xl border border-gray-200">
        <div className="card-body">
          <div className="flex flex-col items-stretch sm:flex-row sm:justify-end gap-2 mb-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="statusFilter"
                className="flex items-center gap-1 font-medium text-gray-600 whitespace-nowrap"
              >
                <FaFilter />
                <span>Filter by:</span>
              </label>
              <select
                id="statusFilter"
                className="select border border-gray-300 rounded-md focus:outline-none focus:ring-1 pl-10 bg-white text-base-100 select-sm w-48"
                value={statusFilter}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full text-base-100">
              <thead className="text-base-100">
                <tr>
                  <th>Recipient</th>
                  <th>Location</th>
                  <th>Donation Date</th>
                  <th>Requester Info</th>
                  <th>Status</th>
                  <th>Donor Info</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((request) => (
                  <tr key={request._id} className="hover">
                    <td>{request.recipientName}</td>
                    <td>{`${request.recipientDistrict}, ${request.recipientUpazila}`}</td>
                    <td>
                      {new Date(request.donationDate).toLocaleDateString()}
                    </td>
                    <td>
                      <div>
                        <p className="font-medium">{request.requesterName}</p>
                        <p className="text-xs text-gray-500">
                          {request.requesterEmail}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${getStatusBadge(
                          request.status
                        )} capitalize`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td>
                      {request.status === "inprogress" ? (
                        <div>
                          <p>{request.donorName}</p>
                          <p className="text-xs text-gray-500">
                            {request.donorEmail}
                          </p>
                        </div>
                      ) : (
                        "No donor yet"
                      )}
                    </td>
                    <td className="text-center lg:space-x-1">
                      {/* Status Buttons (Visible to both Admin and Volunteer) */}
                      {request.status === "inprogress" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(request._id, "done")
                            }
                            className="btn btn-success btn-xs text-white"
                            title="Mark as Done"
                          >
                            <FaCheckCircle />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(request._id, "canceled")
                            }
                            className="btn btn-error btn-xs text-white"
                            title="Cancel Request"
                          >
                            <FaTimesCircle />
                          </button>
                        </>
                      )}

                      {/* View Button (Visible to both Admin and Volunteer) */}
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="btn bg-transparent border-[#ef4343] hover:bg-[#ef4343] hover:text-white shadow-none btn-xs text-[#ef4343]"
                        title="View"
                      >
                        <FaEye />
                      </button>

                      {/* Admin-Only Buttons */}
                      {role === "admin" && (
                        <>
                          <button
                            onClick={() => handleEdit(request)}
                            className="btn bg-transparent border-[#ef4343] hover:bg-[#ef4343] hover:text-white shadow-none btn-xs text-[#ef4343]"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(request._id)}
                            className="btn bg-transparent border-[#ef4343] hover:bg-[#ef4343] hover:text-white shadow-none btn-xs text-[#ef4343] -mt-1"
                            title="Delete"
                          >
                            <FaTrashAlt />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!isLoading && requests.length === 0 && (
            <div className="text-center py-10">
              <FaMagnifyingGlass className="text-6xl text-[#ef4343] opacity-50 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-700">
                No Requests Found
              </h3>
              <p className="text-gray-500 mt-2">
                No requests match the status "
                <span className="font-semibold text-[#ef4343]">
                  {statusFilter}
                </span>
                ".
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, requests.length)} of{" "}
                {requests.length} requests
              </p>
              <div className="join">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="join-item btn btn-sm bg-transparent border-[#ef4343] text-[#ef4343] hover:bg-[#ef4343] hover:text-white disabled:text-white disabled:border-none mr-2"
                  disabled={currentPage === 1}
                >
                  <MdNavigateBefore className="text-xl" />
                </button>
                <button className="join-item btn btn-sm pointer-events-none bg-transparent text-base-100 mr-2 rounded-md">
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
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      <dialog id="view_details_modal_all" className="modal">
        <div className="modal-box bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 w-11/12 max-w-2xl">
          <h3 className="font-bold text-lg text-center text-[#ef4343]">
            Request Details
          </h3>
          {selectedRequest && (
            <div className="py-4 space-y-4 text-gray-700">
              <p>
                <strong>Recipient Name:</strong> {selectedRequest.recipientName}
              </p>
              <p>
                <strong>Location:</strong> {selectedRequest.recipientUpazila},{" "}
                {selectedRequest.recipientDistrict}
              </p>
              <p>
                <strong>Hospital:</strong> {selectedRequest.hospitalName}
              </p>
              <p>
                <strong>Full Address:</strong> {selectedRequest.fullAddress}
              </p>
              <p>
                <strong>Blood Group:</strong> {selectedRequest.bloodGroup}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedRequest.donationDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {formatTime(selectedRequest.donationTime)}
              </p>
              <p>
                <strong>Reason:</strong> {selectedRequest.requestMessage}
              </p>
            </div>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn bg-[#ef4343] text-white border-none hover:opacity-70">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Edit Request Modal */}
      <dialog id="edit_request_modal" className="modal">
        <div className="modal-box bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 w-11/12 max-w-3xl">
          <h3 className="font-bold text-lg text-center text-[#ef4343]">
            Edit Donation Request
          </h3>
          {editFormData && (
            <form onSubmit={handleUpdateSubmit} className="py-4 space-y-4">
              {/* Recipient Name Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 mb-1">
                    Recipient's Name*
                  </span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <input
                    type="text"
                    name="recipientName"
                    value={editFormData.recipientName}
                    onChange={handleEditFormChange}
                    required
                    className="input w-full text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 pl-10"
                  />
                </div>
              </div>

              {/* District & Upazila Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700 mb-1">
                      Recipient's District*
                    </span>
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <select
                      name="recipientDistrict"
                      value={editFormData.recipientDistrict}
                      onChange={handleEditFormChange}
                      required
                      className="select border border-gray-300 rounded-md focus:outline-none focus:ring-1 w-full pl-10 bg-white text-base-100 mb-1"
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
                  <label className="label">
                    <span className="label-text text-gray-700 mb-1">
                      Recipient's Upazila*
                    </span>
                  </label>
                  <div className="relative">
                    <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <select
                      name="recipientUpazila"
                      value={editFormData.recipientUpazila}
                      onChange={handleEditFormChange}
                      required
                      disabled={!editFormData.recipientDistrict}
                      className="select border border-gray-300 rounded-md focus:outline-none focus:ring-1 w-full pl-10 bg-white text-base-100 disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      <option value="">Select upazila</option>
                      {editFormData.recipientDistrict &&
                        upazilas[editFormData.recipientDistrict]?.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Hospital & Address Fields */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 mb-1">
                    Hospital Name*
                  </span>
                </label>
                <div className="relative">
                  <FaRegHospital className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <input
                    type="text"
                    name="hospitalName"
                    value={editFormData.hospitalName}
                    onChange={handleEditFormChange}
                    required
                    className="input w-full text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 pl-10"
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 mb-1">
                    Full Address*
                  </span>
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <input
                    type="text"
                    name="fullAddress"
                    value={editFormData.fullAddress}
                    onChange={handleEditFormChange}
                    required
                    className="input w-full text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 pl-10"
                  />
                </div>
              </div>

              {/* Blood Group, Date & Time Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700 mb-1">
                      Blood Group*
                    </span>
                  </label>
                  <div className="relative">
                    <FaTint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <select
                      name="bloodGroup"
                      value={editFormData.bloodGroup}
                      onChange={handleEditFormChange}
                      required
                      className="select border border-gray-300 rounded-md focus:outline-none focus:ring-1 w-full pl-10 bg-white text-base-100"
                    >
                      <option value="">Select group</option>
                      {bloodGroups.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700 mb-1">
                      Donation Date*
                    </span>
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <input
                      type="date"
                      name="donationDate"
                      value={
                        new Date(editFormData.donationDate)
                          .toISOString()
                          .split("T")[0]
                      }
                      onChange={handleEditFormChange}
                      required
                      className="input w-full text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 pl-10"
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-700 mb-1">
                      Donation Time*
                    </span>
                  </label>
                  <div className="relative">
                    <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <input
                      type="time"
                      name="donationTime"
                      value={editFormData.donationTime}
                      onChange={handleEditFormChange}
                      required
                      className="input w-full text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Request Message Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700 mb-1">
                    Request Message*
                  </span>
                </label>
                <div className="relative">
                  <FaRegCommentDots className="absolute left-3 top-5 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <textarea
                    name="requestMessage"
                    value={editFormData.requestMessage}
                    onChange={handleEditFormChange}
                    required
                    className="textarea pl-10 text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 w-full "
                  ></textarea>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="modal-action justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(
                        role === "admin"
                          ? "edit_request_modal_all"
                          : "edit_request_modal"
                      )
                      .close()
                  }
                  className="btn text-[#ef4343] bg-transparent border-[#ef4343] hover:bg-[#ef4343] hover:text-white shadow-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-[#ef4343] text-white border-none hover:bg-[#d13838]"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <span className="loading loading-spinner text-[#ef4343]"></span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default AllBloodDonationRequest;

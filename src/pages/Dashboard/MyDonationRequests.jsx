import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
  FaPlus,
} from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const MyDonationRequests = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["my-all-requests", user?.email, statusFilter],
    queryFn: async () => {
      const url =
        statusFilter === "all"
          ? `/donation-requests/my-requests`
          : `/donation-requests/my-requests?status=${statusFilter}`;
      const { data } = await axiosSecure.get(url);
      return data;
    },
    enabled: !!user?.email,
    refetchOnMount: "always",
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }) =>
      axiosSecure.patch(`/donation-requests/${id}`, { status }),
    onSuccess: () => {
      Swal.fire("Updated!", "The donation status has been updated.", "success");
      queryClient.invalidateQueries({ queryKey: ["my-all-requests"] });
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
      queryClient.invalidateQueries({ queryKey: ["my-all-requests"] });
    },
    onError: (error) =>
      Swal.fire(
        "Error!",
        error.message || "Could not delete request.",
        "error"
      ),
  });

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

  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = requests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hoursInt = parseInt(hours, 10);
    const suffix = hoursInt >= 12 ? "PM" : "AM";
    const formattedHours = ((hoursInt + 11) % 12) + 1; // Converts 24h to 12h format
    return `${formattedHours}:${minutes} ${suffix}`;
  };

  return (
    <div className="space-y-6 p-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#ef4343]">
            My Donation Requests
          </h1>
          <p className="text-gray-500 mt-1">
            View, manage, and track all your requests.
          </p>
        </div>
        <Link
          to="/dashboard/create-donation-request"
          className="btn bg-[#ef4343] border-none text-white hover:bg-[#d13838]"
        >
          <FaPlus /> Create New Request
        </Link>
      </div>

      {/* Main Content Card */}
      <div className="card bg-white shadow-xl border border-gray-200">
        <div className="card-body">
          <div className="flex flex-col items-stretch sm:flex-row sm:justify-end gap-2 mb-4">
            <div className="flex items-center gap-2">
              {" "}
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

          {isLoading && (
            <div className="text-center p-10">
              <span className="loading loading-lg loading-spinner"></span>
            </div>
          )}

          {!isLoading && requests.length > 0 && (
            <div className="overflow-x-auto text-base-100">
              <table className="table w-full">
                {/* head */}
                <thead className="text-base-100">
                  <tr>
                    <th>Recipient Name</th>
                    <th>Location</th>
                    <th>Donation Date</th>
                    <th>Donation Time</th>
                    <th>Blood Group</th>
                    <th>Status</th>
                    <th>Donor Info</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRequests.map((request) => (
                    <tr key={request._id} className="hover">
                      <td>{request.recipientName}</td>
                      <td>{`${request.recipientDistrict}, ${request.recipientUpazila}`}</td>
                      <td>{`${new Date(
                        request.donationDate
                      ).toLocaleDateString()}`}</td>
                      <td>{`${formatTime(request.donationTime)}`}</td>
                      <td>{`${request.bloodGroup}`}</td>
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
                      <td className="space-x-1">
                        {/* Conditional "Done" and "Cancel" buttons */}
                        {request.status === "inprogress" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(request._id, "done")
                              }
                              className="btn bg-transparent border-[#ef4343] hover:bg-[#ef4343] hover:text-white shadow-none btn-xs text-[#ef4343] m-1"
                            >
                              <FaCheckCircle /> Done
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(request._id, "canceled")
                              }
                              className="btn bg-transparent border-[#ef4343] hover:bg-[#ef4343] hover:text-white shadow-none btn-xs text-[#ef4343] m-1"
                            >
                              <FaTimesCircle /> Cancel
                            </button>
                          </>
                        )}
                        {/* Standard Action Buttons */}
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/donation-request/${request._id}`
                            )
                          }
                          className="btn bg-transparent border-[#ef4343] hover:bg-[#ef4343] hover:text-white shadow-none btn-xs text-[#ef4343] m-1"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/edit-donation-request/${request._id}`
                            )
                          }
                          className="btn bg-transparent border-[#ef4343] hover:bg-[#ef4343] hover:text-white shadow-none btn-xs text-[#ef4343] m-1"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(request._id)}
                          className="btn bg-transparent border-[#ef4343] hover:bg-[#ef4343] hover:text-white shadow-none btn-xs text-[#ef4343] m-1"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && requests.length === 0 && (
            <div className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body items-center text-center">
                <FaMagnifyingGlass className="text-6xl text-[#ef4343] mb-4" />
                <h3 className="card-title text-base-100 text-2xl">
                  No Requests Found
                </h3>
                <p className="text-[#64748b] mt-2">
                  No requests match the status "
                  <span className="text-[#ef4343]">{statusFilter}</span>". Try
                  another filter or create a new request!
                </p>
              </div>
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
                  Page {currentPage}
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
    </div>
  );
};

export default MyDonationRequests;

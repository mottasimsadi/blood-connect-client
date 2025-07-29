import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useRole from "../../hooks/useRole";
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role, loading: roleLoading } = useRole();

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
                    <td className="text-center space-x-1">
                      {/* View Button (Visible to both Admin and Volunteer) */}
                      <button
                        onClick={() =>
                          navigate(`/dashboard/donation-request/${request._id}`)
                        }
                        className="btn bg-transparent border-[#ef4343] hover:bg-[#ef4343] hover:text-white shadow-none btn-xs text-[#ef4343]"
                        title="View"
                      >
                        <FaEye />
                      </button>

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

                      {/* Admin-Only Buttons */}
                      {role === "admin" && (
                        <>
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/edit-donation-request/${request._id}`
                              )
                            }
                            className="btn bg-transparent border-[#ef4343] hover:bg-[#ef4343] hover:text-white shadow-none btn-xs text-[#ef4343]"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(request._id)}
                            className="btn bg-transparent border-[#ef4343] hover:bg-[#ef4343] hover:text-white shadow-none btn-xs text-[#ef4343]"
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
    </div>
  );
};

export default AllBloodDonationRequest;

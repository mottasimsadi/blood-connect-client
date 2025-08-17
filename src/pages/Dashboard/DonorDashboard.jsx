import { useContext } from "react";
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
  FaHeartbeat,
} from "react-icons/fa";

const DonorDashboard = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. Fetch the 3 most recent donation requests for the logged-in donor
  const { data: recentRequests = [], isLoading } = useQuery({
    queryKey: ["my-recent-requests", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/donation-requests/my-requests?limit=3`
      );
      return data;
    },
    enabled: !!user?.email,
    refetchOnMount: "always",
  });

  // 2. Mutation for updating the status of a donation request
  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }) => {
      return axiosSecure.patch(`/donation-requests/${id}`, { status });
    },
    onSuccess: () => {
      Swal.fire("Updated!", "The donation status has been updated.", "success");
      queryClient.invalidateQueries({
        queryKey: ["my-recent-requests", user?.email],
      });
    },
    onError: (error) => {
      Swal.fire(
        "Error!",
        error.message || "Could not update the status.",
        "error"
      );
    },
  });

  // 3. Mutation for deleting a donation request
  const { mutate: deleteRequest } = useMutation({
    mutationFn: (id) => {
      return axiosSecure.delete(`/donation-requests/${id}`);
    },
    onSuccess: () => {
      Swal.fire(
        "Deleted!",
        "The donation request has been deleted.",
        "success"
      );
      queryClient.invalidateQueries({
        queryKey: ["my-recent-requests", user?.email],
      });
    },
    onError: (error) => {
      Swal.fire(
        "Error!",
        error.message || "Could not delete the request.",
        "error"
      );
    },
  });

  const handleStatusChange = (id, newStatus) => {
    updateStatus({ id, status: newStatus });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "badge-warning";
      case "inprogress":
        return "badge-info";
      case "done":
        return "badge-success";
      case "canceled":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hoursInt = parseInt(hours, 10);
    const suffix = hoursInt >= 12 ? "PM" : "AM";
    const formattedHours = ((hoursInt + 11) % 12) + 1; // Converts 24h to 12h format
    return `${formattedHours}:${minutes} ${suffix}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg text-[#ef4343]"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-[#ef4343] to-[#ff6b8b] text-white shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-3xl">
            Welcome back, {user?.displayName}!
          </h1>
          <p>
            Thank you for being a life-saving donor. Your contributions make a
            world of difference.
          </p>
        </div>
      </div>

      {/* Donor's Recent Requests Section */}
      {recentRequests.length > 0 ? (
        <div className="card bg-white text-black shadow-xl border border-gray-200">
          <div className="card-body">
            <h2 className="card-title text-black text-2xl mb-4">
              Your Recent Donation Requests
            </h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                {/* head */}
                <thead className="text-black">
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
                  {recentRequests.map((request) => (
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
                      <td className="lg:space-x-1">
                        {/* Conditional "Done" and "Cancel" buttons */}
                        {request.status === "inprogress" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(request._id, "done")
                              }
                              className="btn btn-success btn-xs text-white mb-1"
                              title="Mark as Done"
                            >
                              <FaCheckCircle />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(request._id, "canceled")
                              }
                              className="btn btn-error btn-xs text-white mb-1"
                              title="Cancel Request"
                            >
                              <FaTimesCircle />
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
                          className="btn bg-transparent border-[#ef4343] hover:bg-[#ef4343] hover:text-white shadow-none btn-xs text-[#ef4343] mb-1"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/edit-donation-request/${request._id}`
                            )
                          }
                          className="btn bg-transparent border-[#ef4343] hover:bg-[#ef4343] hover:text-white shadow-none btn-xs text-[#ef4343] mb-1"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(request._id)}
                          className="btn bg-transparent border-[#ef4343] hover:bg-[#ef4343] hover:text-white shadow-none btn-xs text-[#ef4343] -mt-1"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-actions justify-center mt-6">
              <Link
                to="/dashboard/my-donation-requests"
                className="btn bg-[#ef4343] border-none shadow-none hover:opacity-70 text-white"
              >
                View All My Requests
              </Link>
            </div>
          </div>
        </div>
      ) : (
        // Empty state for donors with no requests
        <div className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="card-body items-center text-center">
            <FaHeartbeat className="text-6xl text-[#ef4343] mb-4" />
            <h2 className="card-title text-black text-2xl">
              No Donation Requests Yet
            </h2>
            <p className="text-[#64748b]">
              You haven't made any donation requests. Create one to save a life!
            </p>
            <div className="card-actions mt-4">
              <Link
                to="/dashboard/create-donation-request"
                className="btn bg-[#ef4343] border-none shadow-none hover:opacity-70 text-white"
              >
                Create Donation Request
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;

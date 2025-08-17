import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  FaFilter,
  FaUsers,
  FaEllipsisV,
  FaUserCheck,
  FaUserSlash,
  FaUserShield,
  FaUserGraduate,
} from "react-icons/fa";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["all-users", statusFilter],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/get-users?status=${statusFilter}`
      );
      return data;
    },
  });

  const getRoleColorClass = (role) => {
    switch (role) {
      case "admin":
        return "text-purple-600 font-bold";
      case "volunteer":
        return "text-blue-600 font-bold";
      default:
        return "text-teal-600 font-bold";
    }
  };

  const getStatusColorClass = (status) => {
    return status === "active"
      ? "text-green-600 font-bold"
      : "text-red-600 font-bold";
  };

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, newStatus }) =>
      axiosSecure.patch(`/update-users/status/${id}`, { status: newStatus }),
    onSuccess: (data, variables) => {
      const { oldStatus, newStatus, userName } = variables;
      Swal.fire({
        title: "Status Updated!",
        html: `Successfully changed <strong>${userName}</strong>'s status from 
               <span class="${getStatusColorClass(
                 oldStatus
               )}">${oldStatus}</span> to 
               <span class="${getStatusColorClass(
                 newStatus
               )}">${newStatus}</span>.`,
        icon: "success",
        confirmButtonColor: "#ef4343",
      });
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
    onError: (error) =>
      Swal.fire({
        title: "Error!",
        text: error.message || "Could not update status.",
        icon: "error",
        confirmButtonColor: "#ef4343",
      }),
  });

  const { mutate: updateRole } = useMutation({
    mutationFn: ({ id, newRole }) =>
      axiosSecure.patch(`/update-users/role/${id}`, { role: newRole }),
    onSuccess: (data, variables) => {
      const { oldRole, newRole, userName } = variables;
      Swal.fire({
        title: "Role Updated!",
        html: `Successfully changed <strong>${userName}</strong>'s role from 
               <span class="${getRoleColorClass(oldRole)}">${oldRole}</span> to 
               <span class="${getRoleColorClass(newRole)}">${newRole}</span>.`,
        icon: "success",
        confirmButtonColor: "#ef4343",
      });
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
    onError: (error) =>
      Swal.fire({
        title: "Error!",
        text: error.message || "Could not update role.",
        icon: "error",
        confirmButtonColor: "#ef4343",
      }),
  });

  const handleStatusChange = (user, newStatus) => {
    Swal.fire({
      title: "Confirm Action",
      text: `Are you sure you want to ${
        newStatus === "blocked" ? "block" : "unblock"
      } ${user.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#64748b",
      confirmButtonText: `Yes, ${
        newStatus === "blocked" ? "block" : "unblock"
      }!`,
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus({
          id: user._id,
          newStatus,
          oldStatus: user.status,
          userName: user.name,
        });
      }
    });
  };

  const handleRoleChange = (user, newRole) => {
    Swal.fire({
      title: "Confirm Role Change",
      html: `Are you sure you want to change ${user.name}'s role from 
             <span class="${getRoleColorClass(user.role)}">${
        user.role
      }</span> to 
             <span class="${getRoleColorClass(newRole)}">${newRole}</span>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4343",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, update role!",
    }).then((result) => {
      if (result.isConfirmed) {
        updateRole({
          id: user._id,
          newRole,
          oldRole: user.role,
          userName: user.name,
        });
      }
    });
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: "bg-purple-100 text-purple-800",
      volunteer: "bg-blue-100 text-blue-800",
      donor: "bg-teal-100 text-teal-800",
    };
    return styles[role] || "bg-gray-100 text-gray-800";
  };
  const getStatusBadge = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold text-center text-[#ef4343] mb-6">
        All Users Management
      </h2>

      <div className="card bg-white shadow-xl border border-gray-200">
        <div className="card-body">
          <div className="flex flex-col items-stretch sm:flex-row sm:justify-end gap-2 mb-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="statusFilter"
                className="flex items-center gap-2 font-medium text-gray-600 whitespace-nowrap"
              >
                <FaFilter /> <span>Filter by Status:</span>
              </label>
              <select
                id="statusFilter"
                className="select border border-gray-300 rounded-md focus:outline-none focus:ring-1 pl-10 bg-white text-black select-sm w-48 max-w-xs"
                value={statusFilter}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center p-10">
              <span className="loading loading-lg loading-spinner text-[#ef4343]"></span>
            </div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="text-base text-gray-700">
                    <th>Avatar</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user, index) => (
                    <tr key={user._id} className="hover">
                      <td>
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src={
                                user.photoURL ||
                                "https://img.icons8.com/?size=100&id=H101gtpJBVoh&format=png&color=000000"
                              }
                              alt={`${user.name}'s avatar`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-600">{user.email}</td>
                      <td className="font-medium text-gray-800">{user.name}</td>
                      <td>
                        <span
                          className={`badge ${getRoleBadge(
                            user.role
                          )} capitalize`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${getStatusBadge(
                            user.status
                          )} capitalize`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <div
                          className={`dropdown dropdown-left ${
                            index === paginatedUsers.length - 1 ||
                            index === paginatedUsers.length - 2
                              ? "dropdown-top"
                              : "dropdown-bottom"
                          }`}
                        >
                          <label
                            tabIndex={0}
                            className="btn bg-transparent border-[#ef4343] text-[#ef4343] hover:bg-[#ef4343] hover:text-white btn-xs m-1"
                          >
                            <FaEllipsisV />
                          </label>
                          <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 text-left"
                          >
                            {user.status === "active" ? (
                              <li className="text-red-600 hover:text-red-600">
                                <a
                                  onClick={() =>
                                    handleStatusChange(user, "blocked")
                                  }
                                >
                                  <FaUserSlash className="mr-2" /> Block User
                                </a>
                              </li>
                            ) : (
                              <li className="text-green-600 hover:text-green-600">
                                <a
                                  onClick={() =>
                                    handleStatusChange(user, "active")
                                  }
                                >
                                  <FaUserCheck className="mr-2" /> Unblock User
                                </a>
                              </li>
                            )}
                            {user.role !== "donor" && (
                              <li>
                                <a
                                  onClick={() =>
                                    handleRoleChange(user, "donor")
                                  }
                                  className="hover:text-[#ef4343]"
                                >
                                  <FaUserGraduate className="mr-2" /> Make Donor
                                </a>
                              </li>
                            )}
                            {user.role !== "volunteer" && (
                              <li>
                                <a
                                  onClick={() =>
                                    handleRoleChange(user, "volunteer")
                                  }
                                  className="hover:text-[#ef4343]"
                                >
                                  <FaUserGraduate className="mr-2" /> Make
                                  Volunteer
                                </a>
                              </li>
                            )}
                            {user.role !== "admin" && (
                              <li>
                                <a
                                  onClick={() =>
                                    handleRoleChange(user, "admin")
                                  }
                                  className="hover:text-[#ef4343]"
                                >
                                  <FaUserShield className="mr-2" /> Make Admin
                                </a>
                              </li>
                            )}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <FaUsers className="text-6xl text-[#ef4343] opacity-50 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-700">
                No Users Found
              </h3>
              <p className="text-gray-500 mt-2">
                No users match the status "
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
                {Math.min(startIndex + itemsPerPage, users.length)} of{" "}
                {users.length} users
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;

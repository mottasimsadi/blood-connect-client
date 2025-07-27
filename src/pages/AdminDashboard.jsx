import React, { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { FaEnvelope, FaUser, FaUserCog, FaUserShield } from "react-icons/fa";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const axiosSecure = useAxiosSecure();

  const fetchUsers = () => {
    axiosSecure.get("/get-users").then(({ data }) => setUsers(data));
  };

  const handleRoleChange = (e, email, currentRole) => {
    const newRole = e.target.value;

    // Function to get role color class
    const getRoleColor = (role) => {
      switch (role) {
        case "admin":
          return "text-purple-600 font-bold";
        case "volunteer":
          return "text-blue-600 font-bold";
        case "donor":
          return "text-green-600 font-bold";
      }
    };

    Swal.fire({
      title: "Confirm Role Change",
      html: `
      <div class="text-center">
        <p>Are you sure you want to change this user's role from 
          <span class="${getRoleColor(currentRole)}">${currentRole}</span> 
          to 
          <span class="${getRoleColor(newRole)}">${newRole}</span>?
        </p>
      </div>
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4343",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, update role",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch("/update-role", { role: newRole, email })
          .then(({ data }) => {
            if (data.modifiedCount) {
              Swal.fire({
                title: "Role Updated!",
                html: `
              <div class="text-center">
                <div class="text-green-500 text-5xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p class="text-lg font-semibold">User role changed successfully!</p>
                <div class="mt-4 space-y-1">
                  <p><span class="font-medium">Previous Role:</span> 
                    <span class="${getRoleColor(
                      currentRole
                    )}">${currentRole}</span>
                  </p>
                  <p><span class="font-medium">New Role:</span> 
                    <span class="${getRoleColor(newRole)}">${newRole}</span>
                  </p>
                </div>
              </div>
            `,
                confirmButtonColor: "#ef4343",
              }).then(() => {
                fetchUsers();
              });
            }
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text: error.response?.data?.message || "Failed to update role",
              icon: "error",
              confirmButtonColor: "#ef4343",
            });
          });
      } else {
        e.target.value = currentRole;
      }
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="text-base-100 space-y-6">
      <h2 className="text-2xl font-bold text-center text-[#ef4343] mb-6">
        Admin Dashboard
      </h2>
      {users.map((user) => (
        <div
          key={user._id}
          className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto"
        >
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center">
              <FaEnvelope className="text-[#ef4343] mr-3" />
              <div className="text-gray-700">
                <span className="font-semibold">Email:</span> {user.email}
              </div>
            </div>

            {/* Name */}
            <div className="flex items-center">
              <FaUser className="text-[#ef4343] mr-3" />
              <div className="text-gray-700">
                <span className="font-semibold">Name:</span>{" "}
                {user.name || "Not provided"}
              </div>
            </div>

            {/* Current Role */}
            <div className="flex items-center">
              <FaUserShield className="text-[#ef4343] mr-3" />
              <div className="text-gray-700">
                <span className="font-semibold">Current Role:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded-md text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "volunteer"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {user.role || "donor"}
                </span>
              </div>
            </div>

            {/* Role Selection */}
            <div className="flex items-center mt-4">
              <FaUserCog className="text-[#ef4343] mr-3" />
              <div className="flex-1">
                <label
                  htmlFor="role-select"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Change Role
                </label>
                <select
                  id="role-select"
                  name="role"
                  value={user.role || "donor"}
                  onChange={(e) =>
                    handleRoleChange(e, user.email, user.role || "donor")
                  }
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ef4343] focus:border-[#ef4343] sm:text-sm rounded-md"
                >
                  <option value="admin">Admin</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="donor">Donor</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
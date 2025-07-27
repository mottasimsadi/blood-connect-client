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

  const handleRoleChange = (e, email) => {
    const role = e.target.value;
    axiosSecure.patch("/update-role", { role, email }).then(({ data }) => {
      if (data.modifiedCount) {
        Swal.fire({
          title: "Success!",
          text: "User role updated successfully.",
          icon: "success",
          confirmButtonColor: "#ef4343",
        }).then(() => {
          fetchUsers(); // Refresh the user list
        });
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
                  onChange={(e) => handleRoleChange(e, user.email)}
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
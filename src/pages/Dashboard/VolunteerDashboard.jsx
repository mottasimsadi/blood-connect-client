import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useRole from "../../hooks/useRole";
import { FaUsers, FaDollarSign, FaHandHoldingMedical } from "react-icons/fa";
import Loading from "../Loading";

const VolunteerDashboard = () => {
  const { user } = useContext(AuthContext);
  const { role } = useRole();
  const axiosSecure = useAxiosSecure();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/admin-stats");
      return data;
    },
    enabled: role === "admin" || role === "volunteer",
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-8 p-4">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-[#ef4343] to-[#ff6b8b] text-white shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-3xl">
            Welcome back, {user?.displayName}!
          </h1>
          <p>
            Thank you for your dedication. Help coordinate blood donations in
            your community. Here's an overview of the platform's activity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Total Users */}
        <div className="card bg-white shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
          <div className="card-body flex flex-row items-center gap-4 p-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center shadow-md">
              <FaUsers className="text-white text-3xl" />
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500">
                {stats?.totalUsers || 0}
              </div>
              <div className="text-lg text-[#64748b] mt-1">Total Users</div>
            </div>
          </div>
        </div>

        {/* Card 2: Total Funding */}
        <div className="card bg-white shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
          <div className="card-body flex flex-row items-center gap-4 p-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center shadow-md">
              <FaDollarSign className="text-white text-3xl" />
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500">
                ${stats?.totalFunding.toLocaleString() || 0}
              </div>
              <div className="text-lg text-[#64748b] mt-1">Total Funding</div>
            </div>
          </div>
        </div>

        {/* Card 3: Total Blood Donation Requests  */}
        <div className="card bg-white border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="card-body flex flex-row items-center gap-4 p-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-tr from-[#ef4343] to-[#ff6b8b] flex items-center justify-center shadow-md">
              <FaHandHoldingMedical className="text-white text-3xl" />
            </div>
            <div>
              <div className="text-4xl font-bold text-[#ef4343]">
                {stats?.totalRequests || 0}
              </div>
              <div className="text-lg text-[#64748b] mt-1">
                Total Blood Donation Requests
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
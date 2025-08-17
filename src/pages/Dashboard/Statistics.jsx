import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../pages/Loading";
import {
  FaUsers,
  FaTint,
  FaDollarSign,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";

const Statistics = () => {
  const axiosSecure = useAxiosSecure();

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Single query to fetch all statistics data at once
  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["full-admin-stats"],
    queryFn: async () => (await axiosSecure.get("/dashboard-stats")).data,
  });

  // Render States

  if (isLoading) {
    return <Loading />;
  }

  // Render an error message if query fails
  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-96"
      >
        <FaExclamationTriangle className="text-5xl text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Failed to Load Statistics
        </h2>
        <p className="text-gray-600">
          Error: {error.message || "An unknown error occurred."}
        </p>
      </motion.div>
    );
  }

  // Render a "No Data" message if the query succeds but returns No Data
  if (!stats) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-96"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          No Statistics Available
        </h2>
        <p className="text-gray-600">
          There is no data to display at the moment.
        </p>
      </motion.div>
    );
  }

  const PIE_COLORS = [
    "#ef4343",
    "#ff6b8b",
    "#3498db",
    "#f1c40f",
    "#2ecc71",
    "#9b59b6",
    "#e74c3c",
    "#1abc9c",
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-[#ef4343]">
          Platform Statistics
        </h1>
        <p className="text-gray-500 mt-1">
          An overview of all platform activity.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div
          variants={itemVariants}
          className="card bg-white shadow-lg border border-gray-200"
        >
          <div className="card-body flex-row items-center gap-4">
            <div className="bg-[#ef4343]/10 p-3 rounded-full">
              <FaUsers className="text-xl text-[#ef4343]" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">
                {stats.totalUsers || 0}
              </div>
              <div className="text-gray-500">Total Users</div>
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="card bg-white shadow-lg border border-gray-200"
        >
          <div className="card-body flex-row items-center gap-4">
            <div className="bg-[#ef4343]/10 p-3 rounded-full">
              <FaDollarSign className="text-xl text-[#ef4343]" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">
                ${(stats.totalFunding || 0).toFixed(2)}
              </div>
              <div className="text-gray-500">Total Funding</div>
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="card bg-white shadow-lg border border-gray-200"
        >
          <div className="card-body flex-row items-center gap-4">
            <div className="bg-[#ef4343]/10 p-3 rounded-full">
              <FaTint className="text-xl text-[#ef4343]" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">
                {stats.totalRequests || 0}
              </div>
              <div className="text-gray-500">Total Requests</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart: Blood Group Distribution */}
        <motion.div
          variants={itemVariants}
          className="card bg-white shadow-xl border border-gray-200"
        >
          <div className="card-body">
            <h2 className="card-title text-gray-700">
              Requests by Blood Group
            </h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={stats.bloodTypeDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {stats.bloodTypeDistribution?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Bar Chart: Donation Status Breakdown */}
        <motion.div
          variants={itemVariants}
          className="card bg-white shadow-xl border border-gray-200"
        >
          <div className="card-body">
            <h2 className="card-title text-gray-700">
              Donation Status Breakdown
            </h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={stats.statusDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#ef4343" name="Requests" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Line Chart: Monthly Donations */}
        <motion.div
          variants={itemVariants}
          className="card bg-white shadow-xl border border-gray-200 lg:col-span-2"
        >
          <div className="card-body">
            <h2 className="card-title text-gray-700">
              New Donation Requests Over Time
            </h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={stats.monthlyDonations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#ef4343"
                    strokeWidth={2}
                    name="New Requests"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Statistics;

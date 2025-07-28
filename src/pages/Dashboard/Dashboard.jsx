import { Navigate } from "react-router";
import useRole from "../../hooks/useRole";
import Loading from "../Loading";
import AdminDashboard from "./AdminDashboard";
import VolunteerDashboard from "./VolunteerDashboard";
import DonorDashboard from "./DonorDashboard";

export default function Dashboard() {
  const { role, loading } = useRole();

  if (loading) {
    return <Loading></Loading>;
  }

  if (role === "donor") {
    return <DonorDashboard />;
  }

  if (role === "volunteer") {
    return <VolunteerDashboard />;
  }

  if (role === "admin") {
    return <AdminDashboard />;
  }

  return <Navigate to={"/"} />;
}

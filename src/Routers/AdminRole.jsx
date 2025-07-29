import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../providers/AuthProvider";
import useRole from "../hooks/useRole"; 
import Loading from "../pages/Loading";

const AdminRoute = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { role, loading: roleLoading } = useRole();
  const location = useLocation();

  if (authLoading || roleLoading) {
    return <Loading />;
  }

  if (user && role === "admin") {
    return children;
  }

  return (
    <Navigate
      to={user ? "/dashboard" : "/login"}
      state={{ from: location }}
      replace
    />
  );
};

export default AdminRoute;
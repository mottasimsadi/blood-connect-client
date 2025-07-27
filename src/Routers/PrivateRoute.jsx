import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate, useLocation } from "react-router";
import Loading from "../pages/Loading";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  // console.log(user);

  const location = useLocation();
  // console.log(location);

  if (loading) {
    return <Loading></Loading>;
  }

  if (user && user?.email) {
    return children;
  }
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;

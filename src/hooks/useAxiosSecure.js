import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const useAxiosSecure = () => {
  const { user } = useContext(AuthContext);

  const instance = axios.create({
    baseURL: "http://localhost:3000",
  });

  // Add request interceptor to include token only if user exists
  instance.interceptors.request.use((config) => {
    if (user?.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  });

  return instance;
};

export default useAxiosSecure;

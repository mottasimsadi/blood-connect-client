import axios from "axios";

const useAxiosPublic = () => {
  const instance = axios.create({
    baseURL: "https://blood-connect-server.vercel.app",
  });

  return instance;
};

export default useAxiosPublic;

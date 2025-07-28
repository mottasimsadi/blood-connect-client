import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

export default function useRole() {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure("/get-user-role")
      .then((res) => {
        setRole(res.data.role);
      })
      .catch((error) => {
        console.error("Error fetching role:", error);
        setRole("donor"); // Default role for unauthenticated users
      })
      .finally(() => {
        setLoading(false);
      });
  }, [axiosSecure]);

  return { role, loading };
}

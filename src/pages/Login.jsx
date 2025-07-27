import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { motion } from "framer-motion";
import {
  FaRegHeart,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { signIn, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn(formData.email, formData.password);
      await Swal.fire({
        icon: "success",
        title: `Welcome back, ${result.user.displayName || "User"}!`,
        html: `
          <div class="text-center">
            <p>You've successfully logged in to BloodConnect</p>
            <div class="mt-2 text-sm text-gray-500">
              Redirecting you now...
            </div>
          </div>
        `,
        showConfirmButton: false,
        timer: 2000,
        background: "#ffffff",
        backdrop: "rgba(0,0,0,0.1)",
      });
      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Invalid email or password",
        background: "#ffffff",
        backdrop: "rgba(0,0,0,0.1)",
        confirmButtonColor: "#ef4343",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await googleSignIn();
      await Swal.fire({
        icon: "success",
        title: `Welcome, ${result.user.displayName || "User"}!`,
        html: `
          <div class="text-center">
            <p>Your Google login to BloodConnect was successful</p>
            <div class="mt-2 text-sm text-gray-500">
              Redirecting you now...
            </div>
          </div>
        `,
        showConfirmButton: false,
        timer: 2000,
        background: "#ffffff",
        backdrop: "rgba(0,0,0,0.1)",
      });
      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error.message || "Something went wrong",
        background: "#ffffff",
        backdrop: "rgba(0,0,0,0.1)",
        confirmButtonColor: "#ef4343",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Feature Coming Soon",
      text: "The password recovery feature is currently under development.",
      icon: "info",
      confirmButtonColor: "#ef4343",
      confirmButtonText: "OK",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ef4343]/5 via-white to-[#ef4343]/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-4"
          >
            <div className="p-3 bg-gradient-to-tr from-[#ef4343] to-[#ff6b8b] rounded-full shadow-md">
              <FaRegHeart className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-[#ef4343]"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#64748b]"
          >
            Sign in to your BloodConnect account
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white shadow-lg rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#64748b] mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-4 w-4 text-[#64748b]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="w-full text-base-100 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4343] focus:border-transparent"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#64748b] mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-[#64748b]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full text-base-100 pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4343] focus:border-transparent"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4 text-[#64748b] cursor-pointer" />
                  ) : (
                    <FaEye className="h-4 w-4 text-[#64748b] cursor-pointer" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              type="submit"
              className={`w-full mt-4 cursor-pointer bg-[#ef4343] hover:bg-[#d13838] text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4343] focus:ring-offset-2 transition-colors ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="relative my-6"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#64748b]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#64748b]">OR</span>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full cursor-pointer flex items-center justify-center gap-2 py-2 px-4 rounded-md border border-[#ef4343] focus:outline-none focus:ring-2 focus:ring-[#ef4343] focus:ring-offset-2 transition-colors ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "text-[#ef4343] hover:text-white hover:bg-[#ef4343]"
            }`}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm text-[#ef4343]"></span>
            ) : (
              <>
                <FaGoogle />
                <span>Continue with Google</span>
              </>
            )}
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-6 text-center"
          >
            <a
              href="#"
              onClick={handleForgotPassword}
              className="text-sm text-[#ef4343] hover:underline"
            >
              Forgot your password?
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-4 pt-4 border-t border-gray-200 text-center"
          >
            <p className="text-sm text-[#64748b]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#ef4343] font-medium hover:underline"
              >
                Join as a donor
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;

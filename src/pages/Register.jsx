import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FaRegHeart,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaMapMarkerAlt,
  FaTint,
  FaEnvelope,
  FaGoogle,
  FaCity,
  FaImage,
} from "react-icons/fa";
import { districts, upazilas, bloodGroups } from "../data/bangladeshData";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosPublic from "../hooks/axiosPublic";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bloodGroup: "",
    district: "",
    upazila: "",
    photoURL: "",
  });

  const { createUser, googleSignIn } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    const passwordValidationError = validatePassword(formData.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      Swal.fire("Error", passwordValidationError, "error");
      return;
    }

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    setLoading(true);

    try {
      const result = await createUser(
        formData.email,
        formData.password,
        formData.name,
        formData.photoURL ||
          "https://img.icons8.com/?size=100&id=H101gtpJBVoh&format=png&color=000000"
      );

      // Create the complete user profile object for the MongoDB database.
      const userInfo = {
        name: formData.name,
        email: formData.email,
        photoURL: result.user.photoURL,
        role: "donor",
        status: "active",
        bloodGroup: formData.bloodGroup,
        district: formData.district,
        upazila: formData.upazila,
      };

      // Send the complete user object to the backend to be saved in MongoDB.
      const { data: serverResponse } = await axiosPublic.post(
        "/add-user",
        userInfo
      );

      if (
        serverResponse.result?.insertedId ||
        serverResponse.msg === "User updated"
      ) {
        await Swal.fire({
          position: "center",
          icon: "success",
          title: `<span style="color: #ef4343">Welcome to BloodConnect!</span>`,
          text: "Your account was created successfully.",
          showConfirmButton: true,
          confirmButtonText: "Go to Dashboard",
          confirmButtonColor: "#ef4343",
          timer: 3000,
        });
        navigate("/dashboard");
      } else {
        throw new Error("Failed to save user data to the database.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        title: "Registration Failed",
        text:
          error.response?.data?.msg ||
          error.message ||
          "Failed to create account.",
        icon: "error",
        confirmButtonColor: "#ef4343",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    googleSignIn()
      .then((result) => {
        // Create user info for backend
        const userInfo = {
          email: result.user.email,
          name: result.user.displayName,
          role: "donor",
          status: "active",
          photoURL: result.user.photoURL,
        };
        // Save/update user in DB
        return axiosPublic.post("/add-user", userInfo);
      })
      .then(() => {
        Swal.fire("Success!", "Logged in successfully!", "success");
        navigate("/dashboard");
      })
      .catch((error) => {
        Swal.fire("Login Failed", error.message, "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
      ...(name === "district" && { upazila: "" }),
    }));

    if (name === "password") {
      setPasswordError("");
    }
  };

  const handleSelectChange = (name, value) => {
    if (name === "district") {
      if (value && (!upazilas[value] || upazilas[value].length === 0)) {
        Swal.fire({
          icon: "info",
          title: "No Upazilas Found",
          text: `No upazilas are currently listed for ${value} district. Please contact support if this is incorrect.`,
          confirmButtonColor: "#ef4343",
        });
      }

      setFormData((prev) => ({
        ...prev,
        district: value,
        upazila: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#ef4343]/5 via-white to-[#ef4343]/10 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gradient-to-tr from-[#ef4343] to-[#ff6b8b] rounded-full shadow-md"
            >
              <FaRegHeart className="h-8 w-8 text-white" />
            </motion.div>
          </div>
          <h1 className="text-2xl font-bold text-[#ef4343]">Join as a Donor</h1>
          <p className="text-[#64748b]">
            Create your account and start saving lives
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Register
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-[#64748b]">
                  Full Name *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 h-4 w-4 text-[#64748b]" />
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="w-full text-base-100 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4343] focus:border-transparent"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-[#64748b]">
                  Email Address *
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 h-4 w-4 text-[#64748b]" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    className="w-full text-base-100 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4343] focus:border-transparent"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-[#64748b]">
                Profile Photo URL (Optional)
              </label>
              <div className="relative">
                <FaImage className="absolute left-3 top-3 h-4 w-4 text-[#64748b] z-10" />
                <input
                  name="photoURL"
                  type="url"
                  value={formData.photoURL}
                  onChange={handleChange}
                  placeholder="Enter your photo URL"
                  className="w-full text-base-100 pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4343] focus:border-transparent"
                />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-[#64748b]">
                  Blood Group *
                </label>
                <div className="relative">
                  <FaTint className="absolute left-3 top-3 h-4 w-4 text-[#64748b] z-10" />
                  <select
                    className="w-full text-base-100 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4343] focus:border-transparent"
                    value={formData.bloodGroup}
                    onChange={(e) =>
                      handleSelectChange("bloodGroup", e.target.value)
                    }
                    name="bloodGroup"
                  >
                    <option value="">Select blood group</option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-[#64748b]">
                  District *
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 h-4 w-4 text-[#64748b] z-10" />
                  <select
                    className="w-full text-base-100 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4343] focus:border-transparent"
                    value={formData.district}
                    onChange={(e) =>
                      handleSelectChange("district", e.target.value)
                    }
                    name="district"
                  >
                    <option value="">Select district</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-[#64748b]">
                Upazila *
              </label>
              <div className="relative">
                <FaCity className="absolute left-3 top-3 h-4 w-4 text-[#64748b] z-10" />
                <select
                  className="w-full text-base-100 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4343] focus:border-transparent"
                  value={formData.upazila}
                  onChange={(e) =>
                    handleSelectChange("upazila", e.target.value)
                  }
                  name="upazila"
                  disabled={
                    !formData.district ||
                    !upazilas[formData.district] ||
                    upazilas[formData.district].length === 0
                  }
                >
                  <option value="">
                    {formData.district &&
                    (!upazilas[formData.district] ||
                      upazilas[formData.district].length === 0)
                      ? "No upazilas available for this district"
                      : "Select upazila"}
                  </option>
                  {formData.district &&
                    upazilas[formData.district]?.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                </select>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-[#64748b]">
                  Password *
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 h-4 w-4 text-[#64748b]" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter password"
                    className="w-full text-base-100 pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4343] focus:border-transparent"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4 text-[#64748b] cursor-pointer" />
                    ) : (
                      <FaEye className="h-4 w-4 text-[#64748b] cursor-pointer" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Password must contain:
                  <ul className="list-disc pl-5">
                    <li>Minimum 8 characters</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one lowercase letter</li>
                    <li>At least one number</li>
                    <li>At least one special character</li>
                  </ul>
                </div>
              </motion.div>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-[#64748b]">
                  Confirm Password *
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 h-4 w-4 text-[#64748b]" />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Confirm password"
                    className="w-full text-base-100 pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4343] focus:border-transparent"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-4 w-4 text-[#64748b] cursor-pointer" />
                    ) : (
                      <FaEye className="h-4 w-4 text-[#64748b] cursor-pointer" />
                    )}
                  </button>
                </div>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`w-full mt-4 cursor-pointer bg-[#ef4343] hover:bg-[#d13838] text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4343] focus:ring-offset-2 transition-colors ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Create Account"
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
            transition={{ delay: 1.2 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-[#64748b]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#ef4343] font-medium hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Register;

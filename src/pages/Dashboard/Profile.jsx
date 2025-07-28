import { useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../providers/AuthProvider";
import { districts, upazilas, bloodGroups } from "../../data/bangladeshData";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useRole from "../../hooks/useRole";
import {
  FaUserEdit,
  FaSave,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTint,
  FaCity,
  FaImage,
} from "react-icons/fa";

const Profile = () => {
  const { user, updateUser, loading: authLoading } = useContext(AuthContext);
  const { role, loading: roleLoading } = useRole();
  const axiosSecure = useAxiosSecure();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState(null);

  // Configure SweetAlert theme
  const showSuccessAlert = (message) => {
    Swal.fire({
      title: "Success!",
      text: message,
      icon: "success",
      confirmButtonColor: "#ef4343",
      background: "#ffffff",
      color: "#333333",
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: "Error!",
      text: message,
      icon: "error",
      confirmButtonColor: "#ef4343",
      background: "#ffffff",
      color: "#333333",
    });
  };

  useEffect(() => {
    if (user?.email && !formData) {
      axiosSecure
        .get(`/users/${user.email}`)
        .then((res) => {
          const profile = res.data;
          setUserProfile(profile);
          setFormData({
            name: profile.name || user.displayName || "",
            email: profile.email || user.email || "",
            photoURL: profile.photoURL || user.photoURL || "",
            bloodGroup: profile.bloodGroup || "",
            district: profile.district || "",
            upazila: profile.upazila || "",
          });
        })
        .catch((error) => {
          console.error("Failed to fetch user profile:", error);
          showErrorAlert("Could not load your profile data.");
        });
    }
  }, [user, axiosSecure, formData]);

  const handleCancel = () => {
    setFormData({
      name: userProfile.name,
      email: userProfile.email,
      photoURL: userProfile.photoURL,
      bloodGroup: userProfile.bloodGroup,
      district: userProfile.district,
      upazila: userProfile.upazila,
    });
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    setIsSaving(true);
    try {
      // Update Firebase auth
      await updateUser({
        displayName: formData.name,
        photoURL: formData.photoURL,
      });

      // Update database
      const { data: updatedProfile } = await axiosSecure.patch(
        `/users/${user.email}`,
        {
          name: formData.name,
          photoURL: formData.photoURL,
          bloodGroup: formData.bloodGroup,
          district: formData.district,
          upazila: formData.upazila,
        }
      );

      // Update state with the new data
      setUserProfile(updatedProfile);
      setIsEditing(false);
      showSuccessAlert("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);
      showErrorAlert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    if (name === "district") {
      // Check if selected district has upazilas
      if (value && (!upazilas[value] || upazilas[value].length === 0)) {
        Swal.fire({
          icon: "info",
          title: "No Upazilas Found",
          text: `No upazilas are currently listed for ${value} district. Please contact support if this is incorrect.`,
          confirmButtonColor: "#ef4343",
          background: "#ffffff",
          color: "#333333",
        });
      }

      setFormData((prev) => ({
        ...prev,
        district: value,
        upazila: "", // Reset upazila when district changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (authLoading || roleLoading || !userProfile || !formData) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-500 mt-1">
            View and manage your account information.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn bg-[#ef4343] hover:bg-[#d13838] text-white border-none gap-2"
          >
            <FaUserEdit /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="btn text-[#ef4343] bg-transparent border-[#ef4343] hover:bg-[#ef4343] hover:text-white shadow-none"
            >
              <FaTimes /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn bg-[#ef4343] hover:bg-[#d13838] text-white border-[#ef4343]"
            >
              {isSaving ? (
                <span className="loading loading-spinner loading-sm text-[#ef4343]"></span>
              ) : (
                <FaSave />
              )}
              &nbsp;
              {isSaving ? (
                <span className="text-[#ef4343]">Saving...</span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSave}>
        <div className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="card-body p-6 md:p-8">
            <h2 className="card-title text-xl text-gray-700 font-semibold mb-6">
              Personal Information
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="avatar">
                <div className="w-24 rounded-full ring-2 ring-[#ef4343] hover:ring-[#64748b]">
                  <img
                    src={
                      formData.photoURL ||
                      "https://img.icons8.com/?size=100&id=H101gtpJBVoh&format=png&color=000000"
                    }
                    alt={formData.name}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              {isEditing && (
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    <span className="label-text text-gray-700">
                      Profile Photo URL
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="photoURL"
                      value={formData.photoURL}
                      onChange={handleChange}
                      placeholder="https://example.com/photo.jpg"
                      className="input text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 pl-10 w-full"
                    />
                    <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Name Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700">Full Name</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="input w-full text-base-100 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 pl-10 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                </div>
              </div>

              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700">
                    Email Address
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="input border border-gray-300 rounded-md w-full pl-10 disabled:bg-gray-100 disabled:text-gray-500 cursor-not-allowed"
                  />
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Blood Group Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700">Blood Group</span>
                </label>
                <div className="relative">
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleSelectChange}
                    disabled={!isEditing}
                    className="select border border-gray-300 rounded-md focus:outline-none focus:ring-1 w-full pl-10 bg-white text-base-100 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="">Select blood group</option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                  <FaTint className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                </div>
              </div>

              {/* District Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-700">District</span>
                </label>
                <div className="relative">
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleSelectChange}
                    disabled={!isEditing}
                    className="select border border-gray-300 rounded-md focus:outline-none focus:ring-1 w-full pl-10 bg-white text-base-100 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="">Select district</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                </div>
              </div>

              {/* Upazila Field */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text text-gray-700">Upazila</span>
                </label>
                <div className="relative">
                  <select
                    name="upazila"
                    value={formData.upazila}
                    onChange={handleSelectChange}
                    disabled={
                      !isEditing ||
                      !formData.district ||
                      !upazilas[formData.district]?.length
                    }
                    className="select border border-gray-300 rounded-md focus:outline-none focus:ring-1 w-full pl-10 bg-white text-base-100 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="">Select upazila</option>
                    {formData.district &&
                      upazilas[formData.district]?.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                  </select>
                  <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="card-body p-6 md:p-8">
          <h2 className="card-title text-xl text-gray-700 font-semibold mb-4">
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Your Role
              </p>
              <span
                className={`ml-2 px-2 py-1 rounded-md text-xs font-medium ${
                  role === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : role === "volunteer"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {role || "donor"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Account Status
              </p>
              <p
                className={`badge badge-${
                  userProfile?.status === "Blocked" ? "error" : "success"
                } badge-outline mt-1 capitalize`}
              >
                {userProfile?.status || "Active"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
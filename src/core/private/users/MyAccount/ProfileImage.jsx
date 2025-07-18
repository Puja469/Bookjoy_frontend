import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchUserDetails, updateUser } from "../../../../services/apiServices";

const ProfileImage = () => {
  const [editMode, setEditMode] = useState(false);
  const [userDetails, setUserDetails] = useState({
    fname: "",
    email: "",
    city: "",
    image: "",
  });
  const [profileImage, setProfileImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");


  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching user details...");
        const data = await fetchUserDetails(userId, token);
        if (!data) throw new Error("No data returned from fetchUserDetails");

        setUserDetails(data);

        const profileImgUrl = data.image?.startsWith("http")
          ? data.image
          : `http://localhost:3000${data.image}`;

        setProfileImage(profileImgUrl);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        toast.error("Failed to load user details.");
      }
    };

    fetchData();
  }, [userId, token]);


  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Uploading file:", file);
      setSelectedFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };


  const handleInputChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fname", userDetails.fname);
    formData.append("city", userDetails.city);

    if (selectedFile) {
      console.log("Appending new profile image:", selectedFile);
      formData.append("image", selectedFile);
    } else if (userDetails.image) {
      console.log("Appending existing profile image:", userDetails.image);
      formData.append("image", userDetails.image);
    }

    console.log("Submitting update request with:", formData);

    try {
      const response = await updateUser(userId, token, formData);
      if (!response) throw new Error("No response from updateUser");

      console.log("Update response:", response);

      if (response.user) {
        setUserDetails(response.user);
        const newProfileImageUrl = response.user.image.startsWith("http")
          ? response.user.image
          : `http://localhost:3000${response.user.image}`;

        setProfileImage(`${newProfileImageUrl}?t=${new Date().getTime()}`);
        setSelectedFile(null);
        toast.success("Profile updated successfully!", { autoClose: 2000 });
        setEditMode(false);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Profile Image Section */}
      <div className="relative group">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {profileImage ? (
            <img
              src={profileImage}
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Edit Icon Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-full flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* User Info Section */}
      <div className="mt-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {userDetails.fname || "User Name"}
        </h2>
        <div className="space-y-1 mb-6">
          <p className="text-gray-600 flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {userDetails.email || "No email provided"}
          </p>
          <p className="text-gray-600 flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {userDetails.city || "No city provided"}
          </p>
        </div>

        <button
          className="inline-flex items-center px-6 py-3 bg-[#F87171] text-white font-medium rounded-xl hover:bg-[#F87171]/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          onClick={() => setEditMode(true)}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Profile
        </button>
      </div>

      {/* Edit Modal */}
      {editMode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 z-50">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#F87171] to-[#F87171]/90 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </h3>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <input
                      type="text"
                      name="fname"
                      placeholder="Enter your full name"
                      value={userDetails.fname}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F87171] focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* City Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter your city"
                      value={userDetails.city}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F87171] focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Profile Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F87171] focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#F87171] file:text-white hover:file:bg-[#F87171]/90"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-[#F87171] text-white font-medium rounded-xl hover:bg-[#F87171]/90 transition-all duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;

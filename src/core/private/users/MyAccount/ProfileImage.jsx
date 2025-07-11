import { useState, useEffect } from "react";
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
    <div className="flex flex-col items-center justify-center mt-4">
  
  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white overflow-hidden aspect-square">
    <img
      src={profileImage}
      alt="User Profile"
      className="w-full h-full rounded-full object-cover p-1"
    />
  </div>

     
      <div className="mt-4 text-center">
        <h2 className="text-xl sm:text-2xl font-bold">{userDetails.fname || "User Name"}</h2>
        <p className="text-gray-500 text-sm sm:text-base">{userDetails.email || "No email provided"}</p>
        <p className="text-gray-500 text-sm sm:text-base">{userDetails.city || "No city provided"}</p>
        <button
          className="mt-3 bg-[#F87171] text-white px-4 py-2 rounded-md text-sm sm:text-base"
          onClick={() => setEditMode(true)}
        >
          Edit Profile
        </button>
      </div>

     
      {editMode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="fname"
                placeholder="Full Name"
                value={userDetails.fname}
                onChange={handleInputChange}
                className="w-full p-2 mb-3 border rounded-md"
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={userDetails.city}
                onChange={handleInputChange}
                className="w-full p-2 mb-3 border rounded-md"
                required
              />
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="w-full p-2 mb-4 border rounded-md"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#F87171] text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;

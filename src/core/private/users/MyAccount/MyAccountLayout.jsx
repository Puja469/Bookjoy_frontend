import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { useAuth } from "../../../../context/AuthContext";

const MyAccountLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-[110vh] bg-white">
    
      <Header />

     
      <main className="flex-1 flex justify-center px-4 mt-28 mb-16">
        <div className="w-full max-w-6xl bg-white border rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-8 text-gray-800">My Account</h1>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Menu */}
            <div className="w-full md:w-1/4 border-r pr-6">
              <div className="flex flex-col gap-4">
                <NavLink
                  to="/my-account/profile"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded text-sm border font-medium ${
                      isActive
                        ? "bg-[#F87171] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  Profile
                </NavLink>

                <NavLink
                  to="/my-account/bookings"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded text-sm border font-medium ${
                      isActive
                        ? "bg-[#F87171] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  Bookings
                </NavLink>

                <NavLink
                  to="/my-account/favorites"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded text-sm border font-medium ${
                      isActive
                        ? "bg-[#F87171] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  Favorites
                </NavLink>

                <div className="flex justify-center items-center mt-6">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md text-sm sm:text-base font-medium text-red-600 border border-red-500 hover:bg-red-100 transition"
                >
                  Logout
                </button>

                </div>
                
              </div>
            </div>

           
            <div className="w-full md:w-3/4">
              <Outlet />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MyAccountLayout;

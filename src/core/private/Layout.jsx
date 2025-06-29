import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaClipboardList,
  FaHotel,
  FaUserCog,
  FaChartPie,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Layout = () => {
  const navigate = useNavigate();
  const { logout, fname } = useAuth(); // Get fname from AuthContext

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen">
      <nav className="w-full md:w-1/5 bg-white text-black flex flex-col h-full fixed top-0 left-0 z-10">
        <div className="p-6 flex items-center justify-center">
          <img 
            src="/assets/images/logo.png" 
            alt="BookJoy Logo" 
            className="h-16 md:h-24 lg:h-32 w-auto" 
          />
        </div>

        {/* Admin Info Section */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div 
            className="flex items-center p-3 rounded hover:bg-red-100 transition-colors cursor-pointer group"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center mr-3">
              <FaUser className="text-white text-lg" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-gray-800">
                {fname || "Admin"}
              </span>
              <span className="text-xs text-gray-500">
                Administrator
              </span>
            </div>
          </div>
        </div>

        <ul className="flex-1 space-y-6 p-4">
          <li>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="w-full text-left px-4 py-2 rounded flex items-center text-lg transition-colors"
              style={{
                ':hover': {
                  backgroundColor: '#F87171',
                  color: 'white'
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F87171';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'black';
              }}
            >
              <FaTachometerAlt className="mr-3 text-gray-600" />
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/admin/users")}
              className="w-full text-left px-4 py-2 rounded flex items-center text-lg transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F87171';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'black';
              }}
            >
              <FaClipboardList className="mr-3 text-gray-600" />
              Booking Management
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/admin/venues")}
              className="w-full text-left px-4 py-2 rounded flex items-center text-lg transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F87171';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'black';
              }}
            >
              <FaHotel className="mr-3 text-gray-600" />
              Venue Management
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/admin/users")}
              className="w-full text-left px-4 py-2 rounded flex items-center text-lg transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F87171';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'black';
              }}
            >
              <FaUserCog className="mr-3 text-gray-600" />
              User Management
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/admin/analytics")}
              className="w-full text-left px-4 py-2 rounded flex items-center text-lg transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F87171';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'black';
              }}
            >
              <FaChartPie className="mr-3 text-gray-600" />
              Analytics
            </button>
          </li>
        </ul>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded flex items-center bg-red-600 hover:bg-red-700 hover:text-white text-lg"
          >
            <FaSignOutAlt className="mr-3 text-white" />
            Logout
          </button>
        </div>
      </nav>

      <main className="ml-auto md:ml-[20%] w-full md:w-[80%] bg-gray-100 h-screen overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
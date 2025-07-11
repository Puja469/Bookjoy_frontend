import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaClipboardList,
  FaHotel,
  FaUserCog,
  FaSignOutAlt,
  FaUser,
  FaBell,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import socket from "../../socket/socket";
import axios from "axios";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, fname, token, userId } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // Fetch unread notifications on mount
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/notifications?userId=${userId}`);
        const unread = res.data.filter((n) => !n.isRead);
        setUnreadCount(unread.length);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    if (userId) fetchUnreadCount();
  }, [userId]);

  // Socket.IO: join admin room and listen for new notifications
  useEffect(() => {
    socket.emit("joinAdmin");

    socket.on("newNotification", (notification) => {
      console.log("📥 New notification received:", notification);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  // Sidebar button styling helpers
  const isActive = (path) => location.pathname === path;
  const activeStyle = {
    backgroundColor: "#F87171",
    color: "white",
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="w-full md:w-1/5 bg-white text-black flex flex-col h-full fixed top-0 left-0 z-10">
        {/* Logo */}
        <div className="p-6 flex items-center justify-center">
          <img
            src="/assets/images/logo.png"
            alt="BookJoy Logo"
            className="h-16 md:h-24 lg:h-32 w-auto"
          />
        </div>

        {/* Admin Profile */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center p-3 rounded hover:bg-red-100 transition-colors cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center mr-3">
              <FaUser className="text-white text-lg" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-gray-800">{fname || "Admin"}</span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <ul className="flex-1 space-y-6 p-4">
          <li>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="w-full text-left px-4 py-2 rounded flex items-center text-lg transition-colors"
              style={isActive("/admin/dashboard") ? activeStyle : {}}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F87171")}
              onMouseLeave={(e) => {
                if (!isActive("/admin/dashboard")) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <FaTachometerAlt className="mr-3" />
              Dashboard
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/admin/booking")}
              className="w-full text-left px-4 py-2 rounded flex items-center text-lg transition-colors"
              style={isActive("/admin/booking") ? activeStyle : {}}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F87171")}
              onMouseLeave={(e) => {
                if (!isActive("/admin/booking")) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <FaClipboardList className="mr-3" />
              Booking Management
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/admin/venues")}
              className="w-full text-left px-4 py-2 rounded flex items-center text-lg transition-colors"
              style={isActive("/admin/venues") ? activeStyle : {}}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F87171")}
              onMouseLeave={(e) => {
                if (!isActive("/admin/venues")) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <FaHotel className="mr-3" />
              Venue Management
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate("/admin/users")}
              className="w-full text-left px-4 py-2 rounded flex items-center text-lg transition-colors"
              style={isActive("/admin/users") ? activeStyle : {}}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F87171")}
              onMouseLeave={(e) => {
                if (!isActive("/admin/users")) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <FaUserCog className="mr-3" />
              User Management
            </button>
          </li>

          <li>
            <button
              onClick={() => {
                setUnreadCount(0);
                navigate("/admin/notifications");
              }}
              className="w-full text-left px-4 py-2 rounded flex items-center text-lg transition-colors relative"
              style={isActive("/admin/notifications") ? activeStyle : {}}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F87171")}
              onMouseLeave={(e) => {
                if (!isActive("/admin/notifications")) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <FaBell className="mr-3" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white rounded-full text-xs px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </button>
          </li>
        </ul>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded flex items-center bg-red-600 hover:bg-red-700 text-white text-lg"
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="ml-auto md:ml-[20%] w-full md:w-[80%] bg-gray-100 h-screen overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

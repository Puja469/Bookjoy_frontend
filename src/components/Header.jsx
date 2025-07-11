import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchUserDetails,
  fetchNotifications,
  markNotificationsAsRead,
} from "../services/apiServices";
import socket from "../socket/socket";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const { data: user } = useQuery({
    queryKey: ["userDetails", userId],
    queryFn: () => fetchUserDetails(userId, token),
    enabled: !!userId && !!token,
  });

  const {
    data: notifications = [],
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => fetchNotifications(userId, token),
    enabled: !!userId && !!token,
    onSuccess: (data) => {
      const unread = data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) => {
      if (notificationId) {
        // Mark single notification as read
        return markNotificationsAsRead(userId, token, notificationId);
      } else {
        // Mark all notifications as read
        return markNotificationsAsRead(userId, token);
      }
    },
    onSuccess: () => {
      refetchNotifications();
    },
  });

  const handleLogout = () => {
    logout();
    navigate("/register");
  };

  const toggleNotificationDropdown = () => {
    setNotificationOpen((prev) => !prev);
    // Don't auto-mark as read when opening dropdown
  };

  const markAllAsRead = () => {
    if (userId && token) {
      markAsReadMutation.mutate();
    }
  };

  const markSingleAsRead = (notificationId) => {
    if (userId && token && notificationId) {
      markAsReadMutation.mutate(notificationId);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (userId) {
      socket.emit("joinRoom", userId);
      socket.on("notification", () => {
        refetchNotifications();
      });
      return () => socket.off("notification");
    }
  }, [userId, refetchNotifications]);

  // Update unread count whenever notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      const unread = notifications.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    }
  }, [notifications]);

  return (
    <header className="fixed top-0 left-0 w-full bg-white text-gray-900 shadow-md py-1 px-4 z-50 h-20 flex items-center">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <button
            className="lg:hidden text-gray-600 hover:text-[#F87171] focus:outline-none mr-2"
            onClick={toggleMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <Link to="/">
            <img
              src="/assets/images/logo.png"
              alt="Logo"
              className="h-24 w-auto max-w-[320px] object-contain cursor-pointer"
            />
          </Link>
        </div>

        <div className="hidden lg:flex flex-grow justify-center">
          <form
            onSubmit={handleSearch}
            className="relative w-full max-w-xl shadow-md rounded-md"
          >
            <input
              type="text"
              placeholder="Search .............."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-2.5 pr-12 border-none rounded-md bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F87171]"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#F87171]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M16.65 16.65a7 7 0 111.4-1.4L21 21z" />
              </svg>
            </button>
          </form>
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          <div className="relative">
            <button
              className="relative text-gray-600 hover:text-[#F87171] focus:outline-none"
              onClick={toggleNotificationDropdown}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#F87171]"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3.001 3.001 0 01-6 0m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 inline-block w-5 h-5 bg-red-600 rounded-full text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg overflow-hidden z-20">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-gray-800">Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-[#F87171] hover:text-[#f76565] font-medium"
                      disabled={markAsReadMutation.isLoading}
                    >
                      {markAsReadMutation.isLoading ? "Marking..." : "Mark All Read"}
                    </button>
                  )}
                </div>
                <ul className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    [...notifications]
                      .sort((a, b) => {
                        if (a.isRead === b.isRead) {
                          return new Date(b.createdAt) - new Date(a.createdAt);
                        }
                        return a.isRead ? 1 : -1; // unread first
                      })
                      .map((notification) => (
                        <li 
                          key={notification.id || notification._id || `${notification.createdAt}-${notification.message.substring(0, 20)}`} 
                          className={`p-4 border-b border-gray-200 last:border-none ${notification.isRead ? "bg-gray-50" : "bg-white"} relative group`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{
                                __html: notification.message.replace(
                                  /(http:\/\/[^\s]+)/g,
                                  '<a href="$1" class="text-[#F87171] hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
                                ),
                              }} />
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <button
                                onClick={() => markSingleAsRead(notification.id || notification._id)}
                                className="ml-2 text-xs text-[#F87171] hover:text-[#f76565] opacity-0 group-hover:opacity-100 transition-opacity"
                                disabled={markAsReadMutation.isLoading}
                              >
                                ✓
                              </button>
                            )}
                          </div>
                          {!notification.isRead && (
                            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#F87171] rounded-full"></div>
                          )}
                        </li>
                      ))
                  ) : (
                    <li className="p-4 text-sm text-gray-500">No notifications yet.</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center space-x-2 relative">
              <div className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setDropdownOpen((prev) => !prev)}>
                <span className="text-sm font-medium">{user.fname}</span>
                <img src={user.image ? `http://localhost:3000${user.image}` : "https://via.placeholder.com/150"}
                  alt={user.fname} className="h-8 w-8 rounded-full" />
              </div>
              {dropdownOpen && (
                <div className="absolute top-full mt-2 right-0 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-20">
                  <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => navigate("/my-account")}>👤 My Account</button>
                  <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button className="px-4 py-2 text-sm bg-[#F87171] text-white rounded-md hover:bg-[#f76565] transition"
              onClick={() => navigate("/register")}>Login/Signup</button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
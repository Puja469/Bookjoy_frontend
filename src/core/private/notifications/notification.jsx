// core/private/notifications/AdminNotifications.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

const AdminNotifications = () => {
  const { userId } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/notifications?userId=${userId}`);
        setNotifications(res.data);
        await axios.put(`http://localhost:3000/api/notifications/markAsRead?userId=${userId}`);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    if (userId) fetchNotifications();
  }, [userId]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`p-4 rounded shadow-sm ${n.isRead ? "bg-white" : "bg-red-50"}`}
            >
              <p className="text-gray-800">{n.message}</p>
              <p className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminNotifications;

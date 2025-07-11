import React, { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaHotel,
  FaUser,
  FaBell,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/dashboard/summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      }
    };

    fetchDashboardSummary();
  }, [token]);

  if (loading || !summary) return <div className="p-6 text-gray-700">Loading...</div>;

  const {
    totalBookings,
    totalVenues,
    totalUsers,
    newNotifications,
    recentBookings,
    bookingsOverTime,
    topVenues,
  } = summary;

  return (
    <div className="p-6 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard icon={<FaClipboardList />} label="Total Bookings" value={totalBookings} />
        <SummaryCard icon={<FaHotel />} label="Total Venues" value={totalVenues} />
        <SummaryCard icon={<FaUser />} label="Registered Users" value={totalUsers} />
        <SummaryCard icon={<FaBell />} label="New Notifications" value={newNotifications} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Bookings Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={bookingsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#F87171" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Top Venues by Bookings</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topVenues}>
              <XAxis dataKey="venue" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#F87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 border">Booking ID</th>
                <th className="p-2 border">Customer</th>
                <th className="p-2 border">Venue</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b._id} className="text-center">
                  <td className="p-2 border">{b._id}</td>
                  <td className="p-2 border">{b.customerName}</td>
                  <td className="p-2 border">{b.venueName}</td>
                  <td className="p-2 border">{new Date(b.date).toLocaleDateString()}</td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        b.status === "Confirmed"
                          ? "bg-green-500"
                          : b.status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => alert(`View booking ${b._id}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-xl shadow flex items-center p-4 space-x-4">
    <div className="bg-red-100 text-red-600 p-3 rounded-full text-xl">{icon}</div>
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  </div>
);

export default Dashboard;

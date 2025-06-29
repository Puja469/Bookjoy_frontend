import React from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Weekly Activity",
        data: [20, 40, 30, 50, 60, 70, 90],
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: ["Resolved", "Pending"],
    datasets: [
      {
        data: [80, 20],
        backgroundColor: ["#4f46e5", "#a5b4fc"],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-base font-semibold">Active Users</h2>
          <p className="text-2xl font-bold">4</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-base font-semibold">Products Resolved</h2>
          <p className="text-2xl font-bold">5%</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-base font-semibold">Pending Products</h2>
          <p className="text-2xl font-bold">8</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-base font-semibold">Total Products</h2>
          <p className="text-2xl font-bold">20</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm font-semibold mb-3">Weekly Activity</h3>
          <Line data={lineData} />
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-sm font-semibold mb-3">Dispute Overview</h3>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

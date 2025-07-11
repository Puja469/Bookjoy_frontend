import React, { useEffect, useState } from "react";
import Table from "./Table";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const adminId = localStorage.getItem("adminId");
  const token = localStorage.getItem("token"); 

  
  const fetchBookings = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/booking/admin/${adminId}`, {
        headers: {
          "Authorization": `Bearer ${token}`, 
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Fetch failed:", errorData.message);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        console.error("Unexpected bookings response:", data);
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    if (adminId && token) {
      fetchBookings();
    }
  }, [adminId, token]);

  // Admin confirms or cancels a booking
  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3000/api/booking/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({
          status,
          payment_status: status === "Confirmed" ? "Paid" : "Cancelled",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Update failed:", errorData.message);
        return;
      }

      fetchBookings(); 
    } catch (err) {
      console.error(`Failed to update booking status to ${status}:`, err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Bookings</h2>
      <Table bookings={bookings} onUpdateStatus={handleUpdateStatus} />
    </div>
  );
}

export default ManageBookings;

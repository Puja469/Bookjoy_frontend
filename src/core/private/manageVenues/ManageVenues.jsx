import React, { useEffect, useState } from "react";
import VenueTable from "./Table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const ManageVenues = () => {
  const [venues, setVenues] = useState([]);
  const navigate = useNavigate();

  const { token, adminId } = useAuth(); 

  const fetchVenues = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/venue", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(res.data)) {
       
        const filtered = res.data.filter(
          (venue) => venue.admin_id?._id === adminId
        );
        setVenues(filtered);
      } else {
        console.error("Invalid venue response:", res.data);
        setVenues([]);
      }
    } catch (err) {
      console.error("Error fetching venues:", err);
      setVenues([]);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleEdit = (venue) => {
    navigate(`/admin/venues/edit/${venue._id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/venue/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVenues((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      console.error("Error deleting venue:", err);
    }
  };

  const handleView = (venue) => {
    alert(`Viewing venue: ${venue.name}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Venues</h2>
      <button
        className="mb-4 bg-[#F87171] text-white px-4 py-2 rounded hover:opacity-90"
        onClick={() => navigate("/admin/venues/create")}
      >
        Add New Venue
      </button>

      <VenueTable
        venues={venues}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    </div>
  );
};

export default ManageVenues;

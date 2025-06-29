import React, { useState } from "react";
import { FaEdit, FaTrash, FaEye, FaStar } from "react-icons/fa";

const VenueTable = ({ venues = [], onEdit, onDelete, onView }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 5;

  const totalPages = Math.ceil(venues.length / venuesPerPage);
  const startIndex = (currentPage - 1) * venuesPerPage;
  const currentVenues = venues.slice(startIndex, startIndex + venuesPerPage);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
    }).format(price || 0);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const truncateText = (text, length = 50) =>
    text?.length <= length ? text : text?.substring(0, length) + "...";

  if (!Array.isArray(venues)) {
    return (
      <div className="text-center p-10 bg-white shadow rounded">
        <p className="text-red-600 font-semibold">
          Error: 'venues' is not an array.
        </p>
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="text-center p-10 bg-white shadow rounded">
        <p className="text-gray-600 text-xl">No venues found.</p>
      </div>
    );
  }

  return (
    <>
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Image</th>
            <th className="p-3">Details</th>
            <th className="p-3">Location</th>
            <th className="p-3">Capacity</th>
            <th className="p-3">Pricing</th>
            <th className="p-3">Rating</th>
            <th className="p-3">Views</th>
            <th className="p-3">Created</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentVenues.map((venue) => (
            <tr key={venue._id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                <img
                  src={
                    venue.image_url
                      ? `http://localhost:3000/venue_images/${venue.image_url}`
                      : "/placeholder-image.jpg"
                  }
                  alt={venue.name}
                  className="h-16 w-16 object-cover rounded"
                  onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                />
              </td>
              <td className="p-3">
                <div className="font-semibold">{venue.name}</div>
                <div className="text-gray-500 text-sm">
                  {truncateText(venue.info)}
                </div>
              </td>
              <td className="p-3">{venue.location}</td>
              <td className="p-3">{venue.capacity} people</td>
              <td className="p-3">
                <div>Plate: {formatPrice(venue.price_per_plate)}</div>
                <div className="text-sm text-gray-500">
                  Day: {formatPrice(venue.full_day_price)}
                </div>
              </td>
              <td className="p-3 flex items-center">
                <FaStar className="text-yellow-500 mr-1" />
                {venue.rating?.toFixed(1) ?? "0.0"}
              </td>
              <td className="p-3">{venue.view_count ?? 0}</td>
              <td className="p-3">{formatDate(venue.createdAt)}</td>
              <td className="p-3 flex space-x-2">
                <button
                  onClick={() => onView(venue)}
                  className="text-blue-600 hover:underline"
                  title="View"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => onEdit(venue)}
                  className="text-green-600 hover:underline"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => setDeleteConfirm(venue)}
                  className="text-red-600 hover:underline"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-2 text-sm">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-red-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md text-center max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Delete Confirmation</h3>
            <p className="mb-4">
              Are you sure you want to delete "{deleteConfirm.name}"?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(deleteConfirm._id);
                  setDeleteConfirm(null);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VenueTable;

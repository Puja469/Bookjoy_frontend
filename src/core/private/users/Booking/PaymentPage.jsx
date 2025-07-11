import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { fetchVenueById } from "../../../../services/apiServices";
import { FaArrowLeft } from "react-icons/fa";

function PaymentPage() {
  const [bookingData, setBookingData] = useState(null);
  const [venue, setVenue] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("bookingForm");
    if (stored) {
      const parsed = JSON.parse(stored);
      const guests = parseInt(parsed.guests || 0);
      const pricePerGuest = parsed.selectedTierDetails?.price || 0;
      const totalCost = guests * pricePerGuest;
      const updated = { ...parsed, total_cost: totalCost };
      localStorage.setItem("bookingForm", JSON.stringify(updated));
      setBookingData(updated);

      if (parsed.venue_id) {
        fetchVenueById(parsed.venue_id).then(setVenue).catch(console.error);
      }
    }
  }, []);

  const handleKhaltiPay = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/khalti/initiate-khalti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: bookingData.user_id,
          venueId: bookingData.venue_id,
          totalCost: bookingData.total_cost * 100, // in paisa
          returnUrl: "http://localhost:5173/payment/success",
          customer: {
            name: bookingData.name,
            email: bookingData.email,
            phone: bookingData.phone,
          },
        }),
      });

      const data = await res.json();
      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        console.error("Khalti response:", data);
        throw new Error("Failed to get Khalti payment URL.");
      }
    } catch (err) {
      console.error("Khalti init error:", err);
      alert("Khalti payment initiation failed.");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen pt-28 pb-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto border p-6 rounded bg-gray-50 relative">
          <button onClick={() => navigate(-1)} className="absolute top-4 left-4 text-[#F87171] flex items-center gap-1">
            <FaArrowLeft /> Back
          </button>

          <h2 className="text-3xl font-bold mb-6 text-center">Review & Pay</h2>

          {venue && (
            <img
              src={`http://localhost:3000/venue_images/${venue.image_url}`}
              alt={venue.name}
              className="w-full h-64 object-cover rounded mb-6"
            />
          )}

          {bookingData && (
            <div className="space-y-4 text-gray-700">
              <p><strong>Venue:</strong> {venue?.name}</p>
              <p><strong>Tier:</strong> {bookingData.selectedTierDetails?.name}</p>
              <p><strong>Guests:</strong> {bookingData.guests}</p>
              <p><strong>Function:</strong> {bookingData.function_type} at {bookingData.function_time}</p>
              <p><strong>Dates:</strong> {bookingData.check_in_date} to {bookingData.check_out_date}</p>

              <div className="bg-white border p-4 rounded mt-4">
                <h3 className="text-lg font-semibold mb-2">Cost Breakdown</h3>
                <p>Price per guest: Rs. {bookingData.selectedTierDetails?.price}</p>
                <p>Total guests: {bookingData.guests}</p>
                <hr className="my-2" />
                <p className="text-xl font-bold">Total = Rs. {bookingData.total_cost?.toLocaleString()}</p>
              </div>

              <div className="text-center mt-6">
                <h3 className="text-lg font-semibold mb-4">Confirm Payment</h3>

                {/* ✅ Display Khalti logo from public folder */}
                <img
                  src="/assets/images/khalti.png"
                  alt="Khalti Logo"
                  className="mx-auto mb-4 h-12 w-auto"
                />

                <button
                  onClick={handleKhaltiPay}
                  className="px-8 py-3 text-lg font-semibold rounded-full bg-[#F87171] text-white hover:bg-[#F87171]"
                >
                  Pay with KHALTI
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PaymentPage;

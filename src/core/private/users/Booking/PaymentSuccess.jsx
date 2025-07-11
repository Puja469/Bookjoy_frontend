import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { createBooking } from "../../../../services/apiServices";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  const createBookingRequest = async () => {
    const stored = localStorage.getItem("bookingForm");
    const token = localStorage.getItem("token");
    if (!stored || !token) {
      setStatus("error");
      return;
    }

    const parsed = JSON.parse(stored);
    const booking = {
      user_id: parsed.user_id,
      venue_id: parsed.venue_id,
      event_id: parsed.event_id || undefined,
      name: parsed.name,
      email: parsed.email,
      guests: parseInt(parsed.guests),
      check_in_date: parsed.check_in_date,
      check_out_date: parsed.check_out_date,
      function_type: parsed.function_type || undefined,
      function_time: parsed.function_time || undefined,
      menu_tier: parsed.menu_tier || parsed.selectedTierDetails?._id,
      menu_items: parsed.menu_items || parsed.selectedTierDetails?.items?.map(i => i._id) || [],
      total_cost: parseFloat(parsed.total_cost),
      payment_status: "Paid",
      status: "Pending",
    };

    try {
      await createBooking(booking, token);
      localStorage.removeItem("bookingForm");
      setStatus("success");
    } catch (err) {
      console.error("Booking creation failed:", err);
      setStatus("error");
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const pidx = query.get("pidx");

    if (!pidx) {
      setStatus("error");
      return;
    }

    fetch("http://localhost:3000/api/khalti/verify-khalti", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pidx }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          createBookingRequest();
        } else {
          setStatus("error");
        }
      })
      .catch((err) => {
        console.error("Payment verification failed:", err);
        setStatus("error");
      });
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen pt-28 pb-16 px-6 bg-white flex justify-center items-center">
        <div className="max-w-md text-center bg-gray-50 p-8 border rounded-lg shadow">
          {status === "loading" && <p className="text-lg">Verifying payment...</p>}

          {status === "success" && (
            <>
              <FaCheckCircle className="text-green-600 text-5xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h2>
              <p className="mb-4">Your booking has been confirmed. Thank you!</p>
              <Link
                to="/my-account/bookings"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700"
              >
                View My Bookings
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <FaTimesCircle className="text-red-600 text-5xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-700 mb-2">Something went wrong!</h2>
              <p className="mb-4">Payment verification failed or booking was not created.</p>
              <Link
                to="/"
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-full font-medium hover:bg-red-700"
              >
                Back to Home
              </Link>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PaymentSuccess;

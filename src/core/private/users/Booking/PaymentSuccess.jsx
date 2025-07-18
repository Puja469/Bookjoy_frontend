import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaCheckCircle, FaReceipt, FaSpinner, FaTimesCircle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../../../../components/Footer";
import Header from "../../../../components/Header";
import { createBooking } from "../../../../services/apiServices";

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Loading State */}
          {status === "loading" && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
              <div className="animate-spin text-4xl text-blue-600 mb-6">
                <FaSpinner className="mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Processing Your Payment</h2>
              <p className="text-gray-600 mb-6">Please wait while we verify your payment and create your booking...</p>
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {/* Success Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
                <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-4xl" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-green-100 text-lg">Your booking has been confirmed</p>
              </div>

              {/* Success Content */}
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <FaCheckCircle className="text-2xl text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Booking Confirmed</h2>
                  <p className="text-gray-600">Thank you for choosing our service. Your booking details have been sent to your email.</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Link
                    to="/my-account/bookings"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <FaCalendarAlt />
                    <span>View My Bookings</span>
                  </Link>

                  <Link
                    to="/"
                    className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <FaReceipt />
                    <span>Back to Home</span>
                  </Link>
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-800 text-center">
                    <strong>Need help?</strong> Contact our support team at support@bookjoy.com
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {/* Error Header */}
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-8 text-center text-white">
                <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <FaTimesCircle className="text-4xl" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
                <p className="text-red-100 text-lg">Something went wrong with your payment</p>
              </div>

              {/* Error Content */}
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <FaTimesCircle className="text-2xl text-red-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Verification Failed</h2>
                  <p className="text-gray-600">We couldn't verify your payment or create your booking. Please try again or contact support.</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Link
                    to="/"
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <FaReceipt />
                    <span>Back to Home</span>
                  </Link>

                  <button
                    onClick={() => window.history.back()}
                    className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <FaCalendarAlt />
                    <span>Try Again</span>
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-4 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-sm text-red-800 text-center">
                    <strong>Need assistance?</strong> Contact our support team at support@bookjoy.com
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PaymentSuccess;

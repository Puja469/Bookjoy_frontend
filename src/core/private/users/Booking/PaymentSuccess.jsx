import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";

function PaymentSuccess() {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-28 pb-16 px-6 bg-white flex justify-center items-center">
        <div className="bg-green-50 border border-green-300 rounded-lg p-8 text-center max-w-lg w-full shadow-lg">
          <div className="flex justify-center mb-4">
            <FaCheckCircle className="text-green-600 text-5xl" />
          </div>

          <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h2>
          <p className="text-gray-700 mb-4">
            Thank you for booking with us. Your payment has been processed and your event is confirmed.
          </p>

          <Link
            to="/my-account/bookings"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition"
          >
            View My Bookings
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PaymentSuccess;

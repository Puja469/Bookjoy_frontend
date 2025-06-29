import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { fetchVenueById, createBooking } from "../../../../services/apiServices";
import { FaArrowLeft, FaTimes, FaCheckCircle } from "react-icons/fa";

function PaymentPage() {
  const [bookingData, setBookingData] = useState(null);
  const [venue, setVenue] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [showKhaltiModal, setShowKhaltiModal] = useState(false);
  const [khaltiStep, setKhaltiStep] = useState(1);
  const [formData, setFormData] = useState({ mobile: "", pin: "" });
  const [isProcessing, setIsProcessing] = useState(false);
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

  const createBookingRequest = async () => {
    const stored = localStorage.getItem("bookingForm");
    const token = localStorage.getItem("token");

    if (!stored) throw new Error("No booking data found.");
    if (!token) throw new Error("Access denied: No token provided");

    const parsed = JSON.parse(stored);

    const booking = {
      user_id: parsed.user_id,
      venue_id: parsed.venue_id,
      event_id: parsed.event_id || undefined,
      name: parsed.name?.trim(),
      email: parsed.email?.trim(),
      guests: parseInt(parsed.guests),
      check_in_date: parsed.check_in_date,
      check_out_date: parsed.check_out_date,
      function_type: parsed.function_type || undefined,
      function_time: parsed.function_time || undefined,
      menu_tier: parsed.menu_tier || parsed.selectedTierDetails?._id || undefined,
      menu_items: parsed.menu_items || (parsed.selectedTierDetails?.items?.map(item => item._id) || []),
      total_cost: parseFloat(parsed.total_cost),
      payment_status: "Paid",
      status: "Confirmed"
    };

    // Clean up payload
    Object.keys(booking).forEach(key => {
      if (
        booking[key] === undefined ||
        booking[key] === null ||
        booking[key] === "" ||
        (Array.isArray(booking[key]) && booking[key].length === 0)
      ) {
        delete booking[key];
      }
    });

    try {
      const result = await createBooking(booking, token);
      console.log("✅ Booking success:", result);
      localStorage.removeItem("bookingForm");
      navigate("/payment-success");
    } catch (err) {
      console.error("❌ Booking error:", err.response?.data || err.message);
      alert("Booking failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handlePay = async () => {
    if (paymentMethod === "khalti") {
      setShowKhaltiModal(true);
    } else {
      setIsProcessing(true);
      try {
        await new Promise((res) => setTimeout(res, 2000));
        await createBookingRequest();
        alert("eSewa payment completed successfully!");
      } catch (err) {
        alert("eSewa Payment failed. " + err.message);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const KhaltiModal = () => {
    const handleMobileSubmit = (e) => {
      e.preventDefault();
      if (formData.mobile.length === 10) {
        setKhaltiStep(2);
      } else {
        alert("Enter a valid 10-digit mobile number.");
      }
    };

    const handlePinSubmit = async (e) => {
      e.preventDefault();
      if (formData.pin.length === 4) {
        setKhaltiStep(3);
        setIsProcessing(true);
        setTimeout(async () => {
          setKhaltiStep(4);
          setIsProcessing(false);
          try {
            await createBookingRequest();
          } catch (err) {
            alert("Payment succeeded but booking failed.");
          }
        }, 3000);
      } else {
        alert("Enter a 4-digit PIN");
      }
    };

    const closeModal = () => {
      setShowKhaltiModal(false);
      setKhaltiStep(1);
      setFormData({ mobile: "", pin: "" });
      setIsProcessing(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-md">
          <div className="bg-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src="/assets/images/khalti.png" className="h-8 w-8 bg-white p-1 rounded" />
              <span className="font-bold text-lg">Khalti</span>
            </div>
            <button onClick={closeModal}><FaTimes /></button>
          </div>

          {khaltiStep === 1 && (
            <form onSubmit={handleMobileSubmit} className="p-6">
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full border p-3 rounded mb-4"
                placeholder="98XXXXXXXX"
                maxLength={10}
              />
              <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg">
                Continue
              </button>
            </form>
          )}

          {khaltiStep === 2 && (
            <form onSubmit={handlePinSubmit} className="p-6 text-center">
              <input
                type="password"
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                className="w-full border p-3 text-center text-xl rounded mb-4"
                maxLength={4}
                placeholder="••••"
              />
              <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg">
                Pay Rs. {bookingData?.total_cost?.toLocaleString()}
              </button>
            </form>
          )}

          {khaltiStep === 3 && (
            <div className="p-6 text-center">
              <div className="animate-spin h-12 w-12 border-b-4 border-purple-600 rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-medium">Processing payment...</p>
            </div>
          )}

          {khaltiStep === 4 && (
            <div className="p-6 text-center">
              <div className="text-green-600 text-5xl mb-4"><FaCheckCircle /></div>
              <p className="text-lg font-semibold">Payment Successful!</p>
              <p className="text-sm text-gray-600">Booking confirmed. Redirecting...</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen pt-28 pb-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto border p-6 rounded bg-gray-50 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 text-[#F87171] flex items-center gap-1"
          >
            <FaArrowLeft /><span>Back</span>
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
                <p>Price per guest: <strong>Rs. {bookingData.selectedTierDetails?.price}</strong></p>
                <p>Total guests: <strong>{bookingData.guests}</strong></p>
                <hr className="my-2" />
                <p className="text-xl font-bold">Total = Rs. {bookingData.total_cost?.toLocaleString()}</p>
              </div>

              <div className="text-center mt-6">
                <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
                <div className="flex justify-center gap-6">
                  <div
                    onClick={() => setPaymentMethod("khalti")}
                    className={`cursor-pointer border-2 px-6 py-3 rounded-lg flex items-center gap-2 ${
                      paymentMethod === "khalti" ? "border-purple-600 bg-purple-50" : "border-gray-300"
                    }`}
                  >
                    <img src="/assets/images/khalti.png" className="w-8 h-8" />
                    <span className="text-purple-700 font-semibold">Khalti</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("esewa")}
                    className={`cursor-pointer border-2 px-6 py-3 rounded-lg flex items-center gap-2 ${
                      paymentMethod === "esewa" ? "border-green-600 bg-green-50" : "border-gray-300"
                    }`}
                  >
                    <img src="/assets/images/esewa.png" className="w-8 h-8" />
                    <span className="text-green-700 font-semibold">eSewa</span>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={handlePay}
                  disabled={isProcessing}
                  className={`px-8 py-3 text-lg font-semibold rounded-full ${
                    isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-[#F87171] text-white hover:bg-red-500"
                  }`}
                >
                  {isProcessing ? "Processing..." : `Pay with ${paymentMethod.toUpperCase()}`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showKhaltiModal && <KhaltiModal />}
      <Footer />
    </>
  );
}

export default PaymentPage;

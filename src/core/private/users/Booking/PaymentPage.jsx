import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaCalculator, FaCalendarAlt, FaCheckCircle, FaClock, FaCreditCard, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../../../../components/Footer";
import Header from "../../../../components/Header";
import { fetchVenueById } from "../../../../services/apiServices";

function PaymentPage() {
  const [bookingData, setBookingData] = useState(null);
  const [venue, setVenue] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("bookingForm");
    if (stored) {
      const parsed = JSON.parse(stored);
      const guests = parseInt(parsed.guests || 0);
      const pricePerGuest = parseInt(parsed.selectedTierDetails?.price || 0);

      // Calculate number of days
      const checkIn = new Date(parsed.check_in_date);
      const checkOut = new Date(parsed.check_out_date);

      // Handle same-day bookings (minimum 1 day)
      let daysDiff = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      if (daysDiff === 0) {
        daysDiff = 1; // Same day booking counts as 1 day
      }

      console.log("Date calculation:", {
        checkIn: parsed.check_in_date,
        checkOut: parsed.check_out_date,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        daysDiff: daysDiff
      });

      // Calculate total cost: price per guest × total guests × number of days
      const totalCost = guests * pricePerGuest * daysDiff;

      console.log("Cost calculation:", {
        guests: guests,
        pricePerGuest: pricePerGuest,
        daysDiff: daysDiff,
        totalCost: totalCost
      });

      const updated = {
        ...parsed,
        total_cost: totalCost,
        days_diff: daysDiff,
        price_per_guest: pricePerGuest,
        total_guests: guests
      };
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

  const handleCancelBooking = () => {
    // Clear booking data from localStorage
    localStorage.removeItem("bookingForm");
    // Navigate back to venue details page
    navigate(`/venue/${bookingData.venue_id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!bookingData || !venue) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-28 pb-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-28 pb-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-3 text-[#F87171] hover:text-[#ef4444] transition-colors duration-200 mb-6 group"
            >
              <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back to Menu Selection</span>
            </button>
            <div className="text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">Review & Payment</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Please review your booking details before proceeding to payment</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left Column - Venue Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Venue Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
                <div className="relative">
                  <img
                    src={`http://localhost:3000/venue_images/${venue.image_url}`}
                    alt={venue.name}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <h2 className="text-4xl font-bold mb-3">{venue.name}</h2>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <FaMapMarkerAlt className="text-white" />
                      </div>
                      <span className="text-lg font-medium">{venue.city}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#F87171] to-[#F87171] rounded-2xl flex items-center justify-center shadow-lg">
                          <FaUsers className="text-white text-xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Total Guests</p>
                          <p className="text-2xl font-bold text-gray-900">{bookingData.guests} people</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <FaCalendarAlt className="text-white text-xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Duration</p>
                          <p className="text-2xl font-bold text-gray-900">{bookingData.days_diff} day{bookingData.days_diff > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <FaClock className="text-white text-xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Function Time</p>
                          <p className="text-2xl font-bold text-gray-900">{bookingData.function_time}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-[#F87171] rounded-2xl flex items-center justify-center shadow-lg">
                          <FaCheckCircle className="text-white text-xl" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Function Type</p>
                          <p className="text-2xl font-bold text-gray-900">{bookingData.function_type}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#F87171] to-[#F87171] rounded-xl flex items-center justify-center">
                    <FaCalendarAlt className="text-white" />
                  </div>
                  Event Schedule
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                    <p className="text-sm text-gray-500 mb-2 font-medium">Check-in Date</p>
                    <p className="text-xl font-bold text-gray-900">{formatDate(bookingData.check_in_date)}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                    <p className="text-sm text-gray-500 mb-2 font-medium">Check-out Date</p>
                    <p className="text-xl font-bold text-gray-900">{formatDate(bookingData.check_out_date)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payment Summary */}
            <div className="space-y-8">
              {/* Menu Tier Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Selected Menu Tier</h3>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">{bookingData.selectedTierDetails?.name}</h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">{bookingData.selectedTierDetails?.description}</p>
                  <div className="flex justify-between items-center bg-white/50 p-3 rounded-xl">
                    <span className="text-sm text-gray-600 font-medium">Price per guest</span>
                    <span className="font-bold text-[#F87171] text-lg">Rs. {bookingData.selectedTierDetails?.price?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#F87171] to-[#F87171] rounded-xl flex items-center justify-center">
                    <FaCalculator className="text-white" />
                  </div>
                  Cost Breakdown
                </h3>

                <div className="space-y-6">
                  {/* Basic Calculation */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Calculation Details</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
                        <span className="text-gray-600">Price per guest</span>
                        <span className="font-semibold">Rs. {bookingData.price_per_guest?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
                        <span className="text-gray-600">× Number of guests</span>
                        <span className="font-semibold">{bookingData.total_guests}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/50 p-3 rounded-lg">
                        <span className="text-gray-600">× Number of days</span>
                        <span className="font-semibold">{bookingData.days_diff}</span>
                      </div>
                      <hr className="border-blue-200 my-3" />
                      <div className="flex justify-between items-center font-bold text-blue-700 bg-white/70 p-3 rounded-lg">
                        <span>Total Amount</span>
                        <span>Rs. {(bookingData.total_cost || (bookingData.price_per_guest * bookingData.total_guests * bookingData.days_diff))?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Final Total */}
                  <div className="bg-gradient-to-br from-[#F87171] to-[#F87171] p-6 rounded-2xl text-white shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xl font-bold">Final Total Amount</span>
                      <span className="text-3xl font-bold">Rs. {(bookingData.total_cost || (bookingData.price_per_guest * bookingData.total_guests * bookingData.days_diff))?.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-red-100">
                      Includes all applicable charges and taxes
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500">
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 mb-6">
                    <img
                      src="/assets/images/khalti.png"
                      alt="Khalti Logo"
                      className="mx-auto mb-4 h-20 w-auto"
                    />
                    <p className="text-sm text-gray-600 font-medium">Secure payment powered by Khalti</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleKhaltiPay}
                    className="w-full bg-gradient-to-r from-[#F87171] to-[#F87171] text-white py-5 px-8 rounded-2xl font-bold text-xl hover:from-[#F87171] hover:to-[#F87171] transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
                  >
                    <FaCreditCard className="text-2xl" />
                    Pay Rs. {(bookingData.total_cost || (bookingData.price_per_guest * bookingData.total_guests * bookingData.days_diff))?.toLocaleString()}
                  </button>

                  <button
                    onClick={handleCancelBooking}
                    className="w-full bg-gray-100 text-gray-700 py-4 px-8 rounded-2xl font-semibold text-lg hover:bg-gray-200 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300"
                  >
                    Cancel Booking
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By clicking "Pay", you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PaymentPage;

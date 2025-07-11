import React, { useEffect, useState } from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { useNavigate } from "react-router-dom";
import { fetchMenuItemsByTier } from "../../../../services/apiServices";
import { FaArrowLeft } from "react-icons/fa";

function ReviewMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [bookingData, setBookingData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("bookingForm");
    if (stored) {
      const parsed = JSON.parse(stored);
      setBookingData(parsed);

      if (parsed.menu_tier) {
        fetchMenuItemsByTier(parsed.menu_tier)
          .then(setMenuItems)
          .catch((err) => console.error("Error fetching menu items:", err));
      }
    }
  }, []);

  const goToPayment = () => {
    const updatedData = {
      ...bookingData,
      menu_items: menuItems.map((item) => item._id),           
      selected_menu_items: menuItems                         
    };
    localStorage.setItem("bookingForm", JSON.stringify(updatedData));
    console.log("Saving to localStorage:", updatedData);
    navigate("/booking/payment");
  };

  const groupedByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item.name);
    return acc;
  }, {});

  return (
    <>
      <Header />
      <div className="min-h-screen pt-28 pb-10 px-6 bg-white">
       
        <div className="max-w-7xl mx-auto border-2 border-gray-300 rounded-3xl p-8 bg-white shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate(-1)} className="text-gray-600 text-xl hover:text-red-500">
              <FaArrowLeft />
            </button>
            <h2 className="text-3xl font-bold text-center w-full">
              Menu for {bookingData?.selectedTierDetails?.name} Tier
            </h2>
          </div>

          {menuItems.length === 0 ? (
            <p className="text-center text-gray-500">Loading menu items...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {Object.entries(groupedByCategory).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-[#F87171] mb-2">{category}</h3>
                  <ul className="space-y-1 text-sm text-gray-800">
                    {items.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <button
              onClick={goToPayment}
              className="bg-[#F87171] text-white rounded-full px-6 py-3 text-lg font-semibold"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ReviewMenu;
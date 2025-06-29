import React, { useEffect, useState } from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { fetchMenuTiersByVenue } from "../../../../services/apiServices";

function MenuTier() {
  const [selectedTier, setSelectedTier] = useState("");
  const [menuTiers, setMenuTiers] = useState([]);
  const [bookingData, setBookingData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("bookingForm");
    if (stored) {
      const parsed = JSON.parse(stored);
      setBookingData(parsed);
      if (parsed.venue_id) {
        fetchMenuTiersByVenue(parsed.venue_id).then(setMenuTiers);
      }
    }
  }, []);

  const handleTierSelect = (tierName) => {
    setSelectedTier(tierName);
  };

  const getTierData = (tierName) => {
    return menuTiers.find(
      (tier) => tier.name.toLowerCase().trim() === tierName.toLowerCase().trim()
    );
  };

  const handleReviewMenu = () => {
    const matched = getTierData(selectedTier);
    if (!matched) {
      alert("Please select a menu tier before proceeding.");
      return;
    }

    const updatedData = {
      ...bookingData,
      menu_tier: matched._id,
      selectedTierDetails: matched,
    };

    console.log("Saving to localStorage:", updatedData);
    localStorage.setItem("bookingForm", JSON.stringify(updatedData));
    navigate("/booking/review-menu");
  };

  const tierCards = [
    {
      backendKey: "Silver",
      details: "Snacks [5], Main Course [7], Pickle [3], Salad [1], Dessert [2]",
      color: "bg-gray-100",
      image: "/assets/images/menu.jpeg",
    },
    {
      backendKey: "Gold",
      details: "Snacks [8], Main Course [8], Pickle [3], Salad [3], Dessert [3]",
      color: "bg-yellow-100",
      image: "/assets/images/menu2.jpeg",
    },
    {
      backendKey: "Diamond",
      details: "Snacks [10], Main Course [8], Pickle [5], Salad [5], Dessert [5]",
      color: "bg-cyan-100",
      image: "/assets/images/menu3.jpeg",
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen pt-28 pb-10 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-700 hover:text-red-500 text-xl"
            >
              <FaArrowLeft />
            </button>
            <h2 className="text-3xl font-bold">Menu Tier</h2>
          </div>

          <h3 className="text-xl font-semibold text-center mb-8">BEST SELLERS</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {tierCards.map((card) => {
              const backendTier = getTierData(card.backendKey);
              const isSelected = selectedTier === card.backendKey;

              return (
                <div
                  key={card.backendKey}
                  className={`rounded shadow-lg p-4 ${card.color} border-2 cursor-pointer transition-all duration-300 ${
                    isSelected ? "border-red-500" : "border-transparent"
                  }`}
                  onClick={() => handleTierSelect(card.backendKey)}
                >
                  <img
                    src={card.image}
                    alt={`${card.backendKey} tier`}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                  <h4 className="text-xl font-semibold mb-1">
                    {backendTier?.name || card.backendKey} Joy
                  </h4>
                  <p className="text-lg font-bold mb-2">
                    NPR {backendTier?.price ?? "Loading..."}
                  </p>
                  <p className="text-sm mb-2">{card.details}</p>
                  <p className="text-xs text-gray-600 mb-3">*conditions apply</p>
                  <button className="mt-auto px-4 py-1 bg-[#F87171] text-white rounded-full text-sm">
                    View Menu
                  </button>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={handleReviewMenu}
              className="bg-[#F87171] text-white rounded-full px-6 py-3 text-lg font-semibold"
            >
              Review Menu
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MenuTier;

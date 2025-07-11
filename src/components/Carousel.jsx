import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    image: "/assets/images/bann2.jpeg",
    title: "Plan the Perfect Wedding",
    subtitle: "Discover romantic venues for your big day",
    button: "Browse Wedding Venues",
    event: "Wedding", 
  },
  {
    image: "/assets/images/bann5.webp",
    title: "Celebrate with Style",
    subtitle: "From birthdays to baby showers – find it all here",
    button: "Explore Party Halls",
    event: "Party",
  },
  {
    image: "/assets/images/banner2.jpeg",
    title: "Professional & Polished",
    subtitle: "Corporate venues for your next big meeting or seminar",
    button: "View Corporate Spaces",
    event: "Corporate",
  },
];

const Carousel = () => {
  const navigate = useNavigate();

  const handleButtonClick = (eventType) => {
    navigate(`/venues?event=${encodeURIComponent(eventType)}`);
  };

  return (
    <div className="relative w-full h-[600px] px-5">
      <Swiper
        spaceBetween={20}
        effect="fade"
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>

              <div className="absolute top-1/2 -translate-y-1/2 left-12 text-white z-10 max-w-xl space-y-6 animate-fade-in-up">
                <h2 className="text-4xl md:text-6xl font-bold">{slide.title}</h2>
                <p className="text-lg md:text-xl">{slide.subtitle}</p>
                <button
                  className="bg-[#F87171] hover:bg-[#ef4444] px-6 py-3 rounded-xl text-lg font-semibold transition-all"
                  onClick={() => handleButtonClick(slide.event)}
                >
                  {slide.button}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom arrow color */}
      <style jsx="true">{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #F87171 !important;
        }
      `}</style>
    </div>
  );
};

export default Carousel;

import React from "react";

const Carousel = () => {
  return (
    <div className="carousel w-full h-[400px] mx-0 overflow-hidden">
      {/* Slide 1 */}
      <div id="slide1" className="carousel-item relative w-full h-full">
        <img
          src="/assets/images/banner1.webp"
          className="w-full h-full object-cover"
          alt="Slide 1"
        />
        <div className="absolute left-5 right-5 top-1/2 transform -translate-y-1/2 flex justify-between">
          <a href="#slide4" className="btn btn-circle bg-[#F87171] text-white border-none hover:bg-red-500">❮</a>
          <a href="#slide2" className="btn btn-circle bg-[#F87171] text-white border-none hover:bg-red-500">❯</a>
        </div>
      </div>

      {/* Slide 2 */}
      <div id="slide2" className="carousel-item relative w-full h-full">
        <img
          src="/assets/images/banner2.jpeg"
          className="w-full h-full object-cover"
          alt="Slide 2"
        />
        <div className="absolute left-5 right-5 top-1/2 transform -translate-y-1/2 flex justify-between">
          <a href="#slide1" className="btn btn-circle bg-[#F87171] text-white border-none hover:bg-red-500">❮</a>
          <a href="#slide3" className="btn btn-circle bg-[#F87171] text-white border-none hover:bg-red-500">❯</a>
        </div>
      </div>

      {/* Slide 3 */}
      <div id="slide3" className="carousel-item relative w-full h-full">
        <img
          src="/assets/images/banner3.webp"
          className="w-full h-full object-cover"
          alt="Slide 3"
        />
        <div className="absolute left-5 right-5 top-1/2 transform -translate-y-1/2 flex justify-between">
          <a href="#slide2" className="btn btn-circle bg-[#F87171] text-white border-none hover:bg-red-500">❮</a>
          <a href="#slide4" className="btn btn-circle bg-[#F87171] text-white border-none hover:bg-red-500">❯</a>
        </div>
      </div>

      {/* Slide 4 */}
      <div id="slide4" className="carousel-item relative w-full h-full">
        <img
          src="/assets/images/banner4.jpg"
          className="w-full h-full object-cover"
          alt="Slide 4"
        />
        <div className="absolute left-5 right-5 top-1/2 transform -translate-y-1/2 flex justify-between">
          <a href="#slide3" className="btn btn-circle bg-[#F87171] text-white border-none hover:bg-red-500">❮</a>
          <a href="#slide1" className="btn btn-circle bg-[#F87171] text-white border-none hover:bg-red-500">❯</a>
        </div>
      </div>
    </div>
  );
};

export default Carousel;

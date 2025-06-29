import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#FF8C8C] text-white py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold mb-3 text-white">Get Connected</h4>
          <div className="flex gap-4 justify-center md:justify-start text-xl text-white">
            <a href="#"><FaFacebookF className="hover:text-gray-200" /></a>
            <a href="#"><FaInstagram className="hover:text-gray-200" /></a>
            <a href="#"><FaTiktok className="hover:text-gray-200" /></a>
          </div>
        </div>

       
        <div className="text-center">
          <h4 className="text-lg font-semibold mb-3 text-white">Payment Partner</h4>
          <div className="flex gap-6 items-center justify-center">
            <img src="/assets/images/khalti.png" alt="Khalti" className="h-10 md:h-12 object-contain" />
            <img src="/assets/images/esewa.png" alt="eSewa" className="h-10 md:h-12 object-contain" />
          </div>
        </div>

       
        <div className="text-center md:text-right text-white">
          <h4 className="text-lg font-semibold mb-3 text-white">Contact Us</h4>
          <div className="space-y-1 text-sm">
            <p className="flex items-center justify-center md:justify-end gap-2">
              <FaMapMarkerAlt /> Thapathali, kathmandu
            </p>
            <p className="flex items-center justify-center md:justify-end gap-2">
              <FaEnvelope /> poojapurbey469@gmail.com
            </p>
            <p className="flex items-center justify-center md:justify-end gap-2">
              <FaPhoneAlt /> +977 9805953190
            </p>
          </div>
        </div>
      </div>

     
      <div className="mt-8 text-center">
      <img src="/assets/images/logo.png" alt="BookJoy Logo" className="mx-auto h-28 md:h-32 object-contain mb-2" />

        <p className="text-sm text-white">Copyright © 2025 Book Joy. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

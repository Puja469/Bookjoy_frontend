import React from "react";
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

function Footer() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <footer className="text-white py-8 px-6" style={{ backgroundColor: '#FF8C8C' }}>
      <div className="max-w-6xl mx-auto">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          
          {/* Social Icons */}
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-bold mb-4 text-white">Get Connected</h4>
            <div className="flex gap-3 justify-center md:justify-start">
              <a href="#" className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors">
                <FaFacebookF className="text-white text-lg" />
              </a>
              <a href="#" className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors">
                <FaInstagram className="text-white text-lg" />
              </a>
              <a href="#" className="w-12 h-12 bg-black rounded flex items-center justify-center hover:bg-gray-800 transition-colors">
                <SiTiktok className="text-white text-xl" />
              </a>
            </div>
          </div>
          
          {/* Payment Partners */}
          <div className="flex-1 text-center">
            <h4 className="text-xl font-bold mb-4 text-white">Payment Partner</h4>
            <div className="flex gap-4 items-center justify-center">
              <img 
                src="/assets/images/khalti.png" 
                alt="Khalti" 
                className="h-10 md:h-12 object-contain"
              />
            </div>
          </div>
          
          {/* About & Help */}
          <div className="flex-1 text-center">
            <h4 className="text-xl font-bold mb-4 text-white">About & Help</h4>
            <div className="space-y-2 text-sm text-white">
              <p>
                <button 
                  onClick={() => scrollToSection('about-us')}
                  className="hover:underline cursor-pointer bg-transparent border-none text-white"
                >
                  About Us
                </button>
              </p>
              <p>
                <button 
                  onClick={() => scrollToSection('help-center')}
                  className="hover:underline cursor-pointer bg-transparent border-none text-white"
                >
                  Help Center
                </button>
              </p>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="flex-1 text-center md:text-right">
            <h4 className="text-xl font-bold mb-4 text-white">Contact Us</h4>
            <div className="space-y-2 text-white">
              <p className="flex items-center justify-center md:justify-end gap-2 text-sm">
                <FaMapMarkerAlt className="text-red-200" />
                Thapathali, Kathmandu
              </p>
              <p className="flex items-center justify-center md:justify-end gap-2 text-sm">
                <FaEnvelope className="text-red-200" />
                poojapurbey469@gmail.com
              </p>
              <p className="flex items-center justify-center md:justify-end gap-2 text-sm">
                <FaPhoneAlt className="text-red-200" />
                +977 9805953190
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="text-center border-t border-red-300 pt-6">
          <div className="mb-4">
            <img 
              src="/assets/images/logo.png" 
              alt="BookJoy Logo" 
              className="mx-auto h-28 md:h-32 object-contain mb-2"
            />
          </div>
          <p className="text-sm text-white font-medium">
            Copyright © 2025 Book Joy. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
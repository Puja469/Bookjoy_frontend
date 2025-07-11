import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Carousel from "../../components/Carousel";
import { fetchAllEvents } from "../../services/apiServices";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchAllEvents()
      .then((data) => setEvents(data))
      .catch((err) => console.error("Failed to fetch events:", err));
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <Header />

      {/* Carousel Section */}
      <div className="pt-20 bg-white">
        <Carousel />
      </div>

      {/* Events Section */}
      <div className="px-6 py-10 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Events</h2>
          <a href="/events" className="text-sm text-blue-500 hover:underline">
            View All
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-x-20 gap-y-14">
          {events.map((event) => (
            <Link
              to={`/venues?event=${encodeURIComponent(event.eventName)}`}
              key={event._id}
              className="flex flex-col items-center text-center"
            >
              <div className="w-28 h-28 rounded-full border-4 border-gray-200 shadow flex items-center justify-center">
                <img
                  src={`http://localhost:3000/event_images/${event.image}`}
                  alt={event.eventName}
                  className="w-24 h-24 object-cover rounded-full"
                />
              </div>
              <p className="mt-5 text-sm font-medium">{event.eventName}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Find Your Venue Section */}
      <div className="px-6 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-14">Find Your Venue</h2>

        <div className="flex flex-wrap justify-center gap-10">
          {[
            {
              title: "Party Venue",
              description:
                "Find a party venue for you anniversary, birthday party, office party, or a reunion of family and friends.",
              bg: "bg-[#FDE68A]",
              img: "/assets/images/party.jpeg",
              icon: "/assets/images/wedicon.jpeg",
            },
            {
              title: "Wedding Venue",
              description:
                "Find a wedding venue for your reception. Banquet halls are popular, Barn weddings are a hot trend, and there are many unique venues .",
              bg: "bg-[#E9D5FF]",
              img: "/assets/images/wed.png",
              icon: "/assets/images/biricon.jpeg",
            },
            {
              title: "Meeting Venue",
              description:
                "Find a meeting venue for any business gathering that can range from a small group in a hotel board room to a large conference at an event center.",
              bg: "bg-[#A7F3D0]",
              img: "/assets/images/met.jpeg",
              icon: "/assets/images/groupicon.jpeg",
            },
          ].map((venue, index) => (
            <div
              key={index}
              className={`relative w-80 rounded-[20px] overflow-hidden shadow transition duration-300 ease-in-out ${venue.bg}`}
            >
              <img
                src={venue.img}
                alt={venue.title}
                className="w-full h-44 object-cover rounded-t-[20px]"
              />
              <div className="absolute top-[172px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow">
                  <img
                    src={venue.icon}
                    alt="icon"
                    className="w-7 h-7 object-contain"
                  />
                </div>
              </div>
              <div className="pt-12 px-6 pb-6 text-center">
                <h3 className="text-lg font-bold text-black mb-2">{venue.title}</h3>
                <p className="text-sm text-gray-700 mb-4">{venue.description}</p>
                <button className="bg-[#F87171] hover:bg-[#f75e5e] text-white text-sm px-6 py-2 rounded-full transition-all duration-200">
                  Find Your Venue
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="px-6 py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-14">How it works?</h2>

        <div className="flex flex-wrap justify-center gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: "📅",
              title: "Book a venue",
              description: "Select and book the perfect venue",
            },
            {
              icon: "🔍",
              title: "Browse Venues",
              description: "Check out the best suited venues",
            },
            {
              icon: "📝",
              title: "Event Planning",
              description: "Plan your event effortlessly with expert guidance",
            },
            {
              icon: "➕",
              title: "Create event",
              description: "Create and manage your own event easily",
            },
          ].map((step, index) => (
            <div
              key={index}
              className="w-64 sm:w-60 bg-white p-6 rounded-xl border border-gray-200 text-center"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h4 className="text-base font-semibold mb-1 text-gray-900">
                {step.title}
              </h4>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About Us Section - Enhanced Design */}
      <div id="about-us" className="px-6 py-20 bg-gradient-to-br from-[#FDE68A] via-[#E9D5FF] to-[#A7F3D0]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About Us</h2>
            <div className="w-16 h-1 bg-[#F87171] mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#F87171] rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  We connect people with ideal venues for their special events. Whether it's a wedding, party, or meeting, our platform helps you discover and book spaces easily, quickly, and with confidence.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl text-center shadow-md">
                <div className="text-2xl font-bold text-[#F87171] mb-2">500+</div>
                <div className="text-sm text-gray-700">Venues Listed</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl text-center shadow-md">
                <div className="text-2xl font-bold text-[#F87171] mb-2">1000+</div>
                <div className="text-sm text-gray-700">Happy Customers</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl text-center shadow-md">
                <div className="text-2xl font-bold text-[#F87171] mb-2">50+</div>
                <div className="text-sm text-gray-700">Cities Covered</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl text-center shadow-md">
                <div className="text-2xl font-bold text-[#F87171] mb-2">24/7</div>
                <div className="text-sm text-gray-700">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Center Section - Enhanced Design */}
      <div id="help-center" className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h2>
            <div className="w-16 h-1 bg-[#F87171] mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Need assistance? Find answers to your questions and ways to get in touch with our support team.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center gap-3">
                  <span className="text-2xl">❓</span>
                  Frequently Asked Questions
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      question: "How do I book a venue?",
                      answer: "Browse venues, select dates, and confirm booking securely through our platform."
                    },
                    {
                      question: "Can I cancel my booking?",
                      answer: "Yes. Cancellations are subject to each venue's policy. Please review the details before confirming."
                    },
                    {
                      question: "How do I list my venue?",
                      answer: "Reach out to our team via email to get started with your venue listing."
                    }
                  ].map((faq, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border-l-4 border-[#F87171] shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-3 text-lg">{faq.question}</h4>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#F87171] to-[#f75e5e] p-8 rounded-2xl text-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📧</span>
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Email Support</h4>
                  <p className="text-white/90 mb-4">Get help via email</p>
                  <a href="mailto:poojapurbey469@gmail.com" className="text-white font-medium hover:underline">
                    poojapurbey469@gmail.com
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#A7F3D0] to-[#6EE7B7] p-8 rounded-2xl text-gray-900">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📞</span>
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Phone Support</h4>
                  <p className="text-gray-700 mb-4">Call us directly</p>
                  <a href="tel:+9779805953190" className="text-gray-900 font-medium hover:underline">
                    +977 9805953190
                  </a>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
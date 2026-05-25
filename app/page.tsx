"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Check,
  Menu,
  X,
  Phone,
  Utensils,
  Wifi,
  Bell,
  Clock,
  Share2,
  Star,
  Award,
  Sparkles,
  Play,
  Volume2,
  Trash2,
  CheckCircle,
  Smartphone,
} from "lucide-react";

// Image assets matching the database exactly
const hotelExteriorImage =
  "/src/assets/images/hotel_exterior_1779716287291.png";
const deluxeRoomImage = "/src/assets/images/deluxe_room_1779716306191.png";
const executiveSuiteImage =
  "/src/assets/images/executive_suite_1779716324308.png";
const twinRoomImage = "/src/assets/images/twin_room_1779716342283.png";

const roomsData = [
  {
    id: "deluxe-room",
    name: "Deluxe Room",
    type: "deluxe",
    price: 3200,
    image: deluxeRoomImage,
    description:
      "Indulge in spacious elegance with our Deluxe Room, featuring high-end custom bedding, premium ambient illumination, and magnificent city views.",
    capacity: { adults: 2, children: 1 },
    amenities: [
      "King Bed",
      "High-speed Wi-Fi",
      "Flat Screen TV",
      "Mini Bar",
      "Premium Bath Amenities",
      "Room Service",
    ],
    rating: 4.8,
  },
  {
    id: "executive-suite",
    name: "Executive Suite",
    type: "suite",
    price: 5500,
    image: executiveSuiteImage,
    description:
      "Our expansive Executive Suite offers independent living and working zones, custom modern velvet furnishings, and elite VIP privileges.",
    capacity: { adults: 3, children: 2 },
    amenities: [
      "Plush Lounge",
      "Working Desk",
      "King Bed",
      "Private Balcony",
      "Espresso Machine",
      "Exclusive Access",
    ],
    rating: 4.9,
  },
  {
    id: "standard-twin",
    name: "Standard Twin Room",
    type: "twin",
    price: 2800,
    image: twinRoomImage,
    description:
      "Designed for seamless comfort, our Standard Twin Room features two premium single beds with high-thread-count white linens.",
    capacity: { adults: 2, children: 1 },
    amenities: [
      "Twin Beds",
      "High-speed Wi-Fi",
      "Writing Desk",
      "In-room Safe",
      "Modern En Suite Bathroom",
    ],
    rating: 4.7,
  },
];

export default function App() {
  // Mobile menu control
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active section tracker
  const [activeTab, setActiveTab] = useState("home");

  // Slide indexes for Hero images and Rooms carousel
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);
  const [roomSliderIdx, setRoomSliderIdx] = useState(0);

  // Cinematic Video state
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Search details states
  const [checkInDate, setCheckInDate] = useState("Select Date");
  const [checkOutDate, setCheckOutDate] = useState("Select Date");
  const [guestsCount, setGuestsCount] = useState("2 Adults, 0 Children");

  // Custom date drop downs
  const [showCheckInDropdown, setShowCheckInDropdown] = useState(false);
  const [showCheckOutDropdown, setShowCheckOutDropdown] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

  // Dynamic guest detail counters
  const [numAdults, setNumAdults] = useState(2);
  const [numChildren, setNumChildren] = useState(0);

  // Booking process states
  const [selectedRoomToBook, setSelectedRoomToBook] = useState(null);
  const [renterName, setRenterName] = useState("");
  const [renterEmail, setRenterEmail] = useState("");
  const [renterPhone, setRenterPhone] = useState("");
  const [savedReservations, setSavedReservations] = useState([]);
  const [showReservationsModal, setShowReservationsModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // Date selection pickers helper
  const todayHex = () => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  };

  const getDayOffset = (offset = 1) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split("T")[0];
  };

  // On initial mount, load bookings
  useEffect(() => {
    const stored = localStorage.getItem("diredawa_ras_reservations");
    if (stored) {
      try {
        setSavedReservations(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading reservations: ", e);
      }
    }
  }, []);

  const triggerToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle checking availability action
  const handleCheckAvailability = (e) => {
    e.preventDefault();
    if (checkInDate === "Select Date" || checkOutDate === "Select Date") {
      // Auto assign standard dates
      setCheckInDate(todayHex());
      setCheckOutDate(getDayOffset(2));
      triggerToast("Checking room availability for the requested dates!");
    } else {
      triggerToast(
        `Fabulous! Rooms are available from ${checkInDate} to ${checkOutDate}.`,
      );
    }

    // Scroll smoothly to rooms section
    const target = document.getElementById("rooms-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Open reservation form modal
  const handleOpenBooking = (room) => {
    setSelectedRoomToBook(room);
    // Auto populate dates if empty
    if (checkInDate === "Select Date") setCheckInDate(todayHex());
    if (checkOutDate === "Select Date") setCheckOutDate(getDayOffset(2));
  };

  const handleConfirmReservation = (e) => {
    e.preventDefault();
    if (!renterName.trim() || !renterEmail.trim() || !renterPhone.trim()) {
      triggerToast("Please fill in all details to secure your boarding slip.");
      return;
    }

    if (!selectedRoomToBook) return;

    // Calculation total stay price
    const inDate = checkInDate === "Select Date" ? todayHex() : checkInDate;
    const outDate =
      checkOutDate === "Select Date" ? getDayOffset(2) : checkOutDate;
    const daysCount = Math.max(
      1,
      Math.ceil(
        (new Date(outDate).getTime() - new Date(inDate).getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    );
    const totalPrice = selectedRoomToBook.price * daysCount;

    const newRes = {
      id: `DR-${Math.floor(100000 + Math.random() * 900000)}`,
      roomId: selectedRoomToBook.id,
      roomName: selectedRoomToBook.name,
      checkIn: inDate,
      checkOut: outDate,
      guestName: renterName,
      guestEmail: renterEmail,
      guestPhone: renterPhone,
      adults: numAdults,
      children: numChildren,
      totalPrice: totalPrice,
      status: "confirmed",
      bookingDate: new Date().toISOString().split("T")[0],
    };

    const updated = [...savedReservations, newRes];
    setSavedReservations(updated);
    localStorage.setItem("diredawa_ras_reservations", JSON.stringify(updated));

    triggerToast(
      `Reservation confirmed! Your slot in ${selectedRoomToBook.name} is reserved.`,
    );
    setSelectedRoomToBook(null);
    setRenterName("");
    setRenterEmail("");
    setRenterPhone("");
    setShowReservationsModal(true);
  };

  const handleCancelReservation = (id) => {
    if (
      window.confirm(
        "Do you wish to cancel this hotel booking reservation ticket?",
      )
    ) {
      const filtered = savedReservations.filter((r) => r.id !== id);
      setSavedReservations(filtered);
      localStorage.setItem(
        "diredawa_ras_reservations",
        JSON.stringify(filtered),
      );
      triggerToast("Booking cancelation complete.");
    }
  };

  const applyAdultCount = (val) => {
    const current = Math.max(1, Math.min(6, numAdults + val));
    setNumAdults(current);
    setGuestsCount(
      `${current} Adult${current > 1 ? "s" : ""}, ${numChildren} Child${numChildren !== 1 ? "ren" : ""}`,
    );
  };

  const applyChildCount = (val) => {
    const current = Math.max(0, Math.min(6, numChildren + val));
    setNumChildren(current);
    setGuestsCount(
      `${numAdults} Adult${numAdults > 1 ? "s" : ""}, ${current} Child${current !== 1 ? "ren" : ""}`,
    );
  };

  return (
    <div
      id="hotel-app"
      className="min-h-screen bg-[#faf9f6] text-gray-800 font-sans selection:bg-[#bd902f] selection:text-white antialiased flex flex-col justify-between"
    >
      {/* Dynamic Native Elegant Toast Alert */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#0a2315] border border-[#bd902f]/40 text-white px-6 py-3.5 rounded-full shadow-2xl z-50 flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-[#caa75d]" />
          <span className="text-xs font-semibold tracking-wide font-sans">
            {notification}
          </span>
        </div>
      )}

      {/* Elegant Crown Logo Definition for easy code re-use */}
      {/* SVG Path of a luxurious heritage hotel Crown & initials */}
      <header
        id="main-header"
        className="sticky top-0 z-40 bg-[#061f12] text-white border-b border-[#bd902f]/10 shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* LOGO CONTAINER */}
          <a
            href="#"
            className="flex items-center gap-3 hover:opacity-95 transition-all"
          >
            <div className="w-12 h-12 rounded-full border border-[#caa75d]/50 bg-gradient-to-br from-[#0a2315] to-[#04110a] flex items-center justify-center relative shrink-0">
              {/* Gold vector crown */}
              <svg
                className="w-8 h-8 text-[#caa75d]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M5 18L3 9L9 12L12 4L15 12L21 9L19 18H5Z"
                  fill="currentColor"
                  fillOpacity="0.15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="14"
                  r="2.5"
                  className="stroke-[#caa75d] fill-[#0a2315]"
                />
                <path
                  d="M11 13.5H13M12 12V15.5"
                  stroke="#caa75d"
                  strokeWidth="1.2"
                />
              </svg>
              {/* Floating Mini text badge */}
              <span className="absolute bottom-[-1px] right-[-1px] text-[7px] bg-[#bd902f] text-white px-1 font-bold rounded-sm border border-black scale-90">
                FR
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-serif font-bold text-base tracking-widest text-[#caa75d] uppercase leading-none">
                Diredawa Ras Hotel
              </span>
              <span className="text-[9px] text-gray-300 font-light tracking-wide uppercase mt-0.5">
                Comfort. Hospitality. Diredawa.
              </span>
            </div>
          </a>

          {/* DESKTOP NAV BAR */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-widest text-gray-200">
            {[
              "HOME",
              "ABOUT US",
              "ROOMS",
              "SERVICES",
              "GALLERY",
              "OFFERS",
              "CONTACT",
            ].map((item) => (
              <a
                key={item}
                href={
                  item === "HOME"
                    ? "#"
                    : `#${item.toLowerCase().replace(" ", "-")}`
                }
                onClick={() => setActiveTab(item.toLowerCase())}
                className={`transition-colors hover:text-[#caa75d] py-1 relative ${
                  activeTab === item.toLowerCase()
                    ? "text-[#caa75d] border-b-2 border-[#caa75d]/80"
                    : "text-gray-200"
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href="tel:+251251111223"
              className="flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-100 hover:text-[#caa75d] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#caa75d]" />
              <span>+251 251 111 223</span>
            </a>

            <button
              onClick={() => {
                const sec = document.getElementById("rooms-section");
                if (sec) sec.scrollIntoView({ behavior: "smooth" });
              }}
              className="border border-[#bd902f] hover:bg-[#bd902f] text-white hover:text-black font-bold uppercase py-2 px-5 tracking-widest text-[10px] rounded transition-all duration-300 cursor-pointer"
            >
              BOOK NOW
            </button>
          </div>

          {/* MOBILE NAV BUTTON ACTION */}
          <div className="flex lg:hidden items-center gap-4">
            <a
              href="tel:+251251111223"
              className="p-2 text-gray-200 hover:text-[#caa75d] transition-colors"
              title="Call Reservations"
            >
              <Phone className="w-5 h-5 text-[#caa75d]" />
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-200 hover:text-[#caa75d] transition-colors focus:outline-none focus:ring-1 focus:ring-[#caa75d]/50 rounded cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN LINKS */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#0a2315] border-t border-[#bd902f]/10 px-4 py-4 space-y-2.5 animate-in fade-in duration-200">
            {[
              "HOME",
              "ABOUT US",
              "ROOMS",
              "SERVICES",
              "GALLERY",
              "OFFERS",
              "CONTACT",
            ].map((item) => (
              <a
                key={item}
                href={
                  item === "HOME"
                    ? "#"
                    : `#${item.toLowerCase().replace(" ", "-")}`
                }
                onClick={() => {
                  setActiveTab(item.toLowerCase());
                  setIsMobileMenuOpen(false);
                }}
                className="block py-2 text-xs font-bold tracking-widest text-gray-300 hover:text-[#caa75d] border-b border-white/5"
              >
                {item}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-3">
              <a
                href="tel:+251251111223"
                className="flex items-center gap-2 text-xs text-gray-300"
              >
                <Phone className="w-4 h-4 text-[#caa75d]" />
                <span>+251 251 111 223</span>
              </a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const sec = document.getElementById("rooms-section");
                  if (sec) sec.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full bg-[#bd902f] text-black font-bold uppercase py-2.5 tracking-wider text-[11px] rounded text-center cursor-pointer"
              >
                BOOK NOW
              </button>
            </div>
          </div>
        )}
      </header>

      {/* BANNER HERO */}
      <main id="main-content" className="flex-grow">
        {/* HERO BANNER SECTION */}
        <section
          id="hero"
          className="relative bg-[#061f12] overflow-hidden"
        >
          {/* MOBILE-ONLY: image as full background */}
          <img
            src="/image/home.avif"
            className="absolute inset-0 w-full h-full object-cover lg:hidden select-none"
            alt="Diredawa Ras Hotel Exterior"
            referrerPolicy="no-referrer"
          />
          {/* MOBILE-ONLY: dark overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061f12] via-[#061f12]/75 to-[#061f12]/20 lg:hidden" />

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[520px] lg:min-h-[640px] relative">
            {/* HERO LEFT SIDE */}
            <div
              id="hero-left"
              className="w-full lg:w-[45%] flex flex-col justify-center px-6 sm:px-12 py-12 lg:py-20 text-white z-10"
            >
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest font-bold text-[#caa75d] block">
                  WELCOME TO
                </span>
                <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none text-white max-w-lg">
                  Diredawa Ras
                  <br className="hidden sm:inline" />
                  Hotel
                </h1>
                <hr className="bg-[#caa75d] border-1 w-[40px]"></hr>
                <p className="text-gray-200 text-sm sm:text-base font-light font-sans tracking-wide leading-relaxed max-w-sm pt-2">
                  Experience comfort, elegance and exceptional hospitality in
                  the heart of Dire Dawa.
                </p>
              </div>

              {/* TWO ACTIONS BUTTONS ROW */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 mt-8 sm:mt-10">
                <button
                  onClick={() => {
                    const sec = document.getElementById("rooms-section");
                    if (sec) sec.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-[#dcb56d] hover:bg-[#bd902f] text-white font-bold tracking-widest text-[11px] sm:text-xs uppercase px-7 sm:px-9 py-3.5 sm:py-4 rounded shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] duration-200 select-none cursor-pointer w-full sm:w-auto max-w-[280px]"
                >
                  BOOK NOW
                </button>
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="border border-white/60 hover:bg-white/10 text-white font-bold tracking-widest text-[11px] sm:text-xs uppercase px-7 sm:px-9 py-3.5 sm:py-4 rounded flex items-center justify-center gap-2 transition-colors duration-200 select-none cursor-pointer w-full sm:w-auto max-w-[280px]"
                >
                  <Play className="w-4 h-4 text-white fill-white" />
                  <span>WATCH VIDEO</span>
                </button>
              </div>

              {/* THREE NAVIGATION HERO SLIDER DOTS */}
              <div className="flex items-center justify-center lg:justify-start gap-2 mt-10 sm:mt-16">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroSlideIdx(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      heroSlideIdx === idx
                        ? "bg-[#bd902f] w-7"
                        : "bg-gray-400/70 hover:bg-gray-300"
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* HERO RIGHT SIDE - DESKTOP ONLY */}
            <div
              id="hero-right"
              className="hidden lg:block w-full lg:w-[55%] relative min-h-[300px] lg:min-h-full"
            >
              <img
                src="/image/home.avif"
                className="absolute inset-0 w-full h-full object-cover select-none object-center"
                alt="Diredawa Ras Hotel Exterior Dusk Facade"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#061f12] via-[#061f12]/40 to-transparent" />
              <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-2 bg-[#04110a]/80 border border-[#caa75d]/30 text-[#caa75d] px-4 py-2 rounded shadow-xl backdrop-blur-xs select-none">
                <Award className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
                  ESTABLISHED HERITAGE SINCE 1934
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* BOOKING BAR WIDGET SECTION */}
        <section
          id="booking"
          className="relative -mt-16 sm:-mt-20 px-4 sm:px-6 z-20"
        >
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={handleCheckAvailability}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-7 space-y-5 md:space-y-0 relative"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:divide-x md:divide-gray-150">
                {/* CHECK-IN COMPONENT */}
                <div className="relative flex flex-col justify-center px-2 py-1">
                  <div
                    onClick={() => {
                      setShowCheckInDropdown(!showCheckInDropdown);
                      setShowCheckOutDropdown(false);
                      setShowGuestsDropdown(false);
                    }}
                    className="flex justify-between items-center cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded bg-gray-50 text-gray-700 group-hover:bg-[#0a2315] group-hover:text-white transition-all duration-300">
                        <Calendar className="w-5 h-5 text-inherit" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                          CHECK-IN
                        </span>
                        <span className="text-xs font-semibold text-gray-800 tracking-wide mt-0.5 block">
                          {checkInDate}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#bd902f] transition-all" />
                  </div>

                  {showCheckInDropdown && (
                    <div className="absolute top-full left-0 mt-3 w-64 bg-white border border-gray-150 rounded-lg shadow-2xl p-4 z-30 animate-in fade-in duration-150">
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2">
                        Set Checkin Travel Date
                      </label>
                      <input
                        type="date"
                        min={todayHex()}
                        className="w-full text-xs border border-gray-200 rounded p-2 focus:ring-1 focus:ring-[#bd902f] outline-none"
                        onChange={(e) => {
                          setCheckInDate(e.target.value);
                          setShowCheckInDropdown(false);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* CHECK-OUT COMPONENT */}
                <div className="relative flex flex-col justify-center md:pl-6 px-2 py-1">
                  <div
                    onClick={() => {
                      setShowCheckOutDropdown(!showCheckOutDropdown);
                      setShowCheckInDropdown(false);
                      setShowGuestsDropdown(false);
                    }}
                    className="flex justify-between items-center cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded bg-gray-50 text-gray-700 group-hover:bg-[#0a2315] group-hover:text-white transition-all duration-300">
                        <Calendar className="w-5 h-5 text-inherit" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                          CHECK-OUT
                        </span>
                        <span className="text-xs font-semibold text-gray-800 tracking-wide mt-0.5 block">
                          {checkOutDate}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#bd902f] transition-all" />
                  </div>

                  {showCheckOutDropdown && (
                    <div className="absolute top-full left-0 mt-3 w-64 bg-white border border-gray-150 rounded-lg shadow-2xl p-4 z-30 animate-in fade-in duration-150">
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-2">
                        Set Checkout Travel Date
                      </label>
                      <input
                        type="date"
                        min={
                          checkInDate !== "Select Date"
                            ? checkInDate
                            : todayHex()
                        }
                        className="w-full text-xs border border-gray-200 rounded p-2 focus:ring-1 focus:ring-[#bd902f] outline-none"
                        onChange={(e) => {
                          setCheckOutDate(e.target.value);
                          setShowCheckOutDropdown(false);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* GUESTS SELECTOR COMPONENT */}
                <div className="relative flex flex-col justify-center md:pl-6 px-2 py-1">
                  <div
                    onClick={() => {
                      setShowGuestsDropdown(!showGuestsDropdown);
                      setShowCheckInDropdown(false);
                      setShowCheckOutDropdown(false);
                    }}
                    className="flex justify-between items-center cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded bg-gray-50 text-gray-700 group-hover:bg-[#0a2315] group-hover:text-white transition-all duration-300">
                        <Users className="w-5 h-5 text-inherit" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                          GUESTS
                        </span>
                        <span className="text-xs font-semibold text-gray-800 tracking-wide mt-0.5 block">
                          {guestsCount}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#bd902f] transition-all" />
                  </div>

                  {showGuestsDropdown && (
                    <div className="absolute top-full left-0 mt-3 w-64 bg-white border border-gray-150 rounded-lg shadow-2xl p-4 z-30 space-y-4 animate-in fade-in duration-150">
                      {/* ADULTS */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-semibold text-gray-800">
                            Adults
                          </span>
                          <span className="text-[10px] text-gray-400">
                            Ages 13 or above
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => applyAdultCount(-1)}
                            className="w-7 h-7 border border-gray-200 rounded-full text-xs font-bold hover:bg-gray-50 flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold text-gray-800 w-4 text-center">
                            {numAdults}
                          </span>
                          <button
                            type="button"
                            onClick={() => applyAdultCount(1)}
                            className="w-7 h-7 border border-gray-200 rounded-full text-xs font-bold hover:bg-gray-50 flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* CHILDREN */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-semibold text-gray-800">
                            Children
                          </span>
                          <span className="text-[10px] text-gray-400">
                            Ages 2 to 12
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => applyChildCount(-1)}
                            className="w-7 h-7 border border-gray-200 rounded-full text-xs font-bold hover:bg-gray-50 flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold text-gray-800 w-4 text-center">
                            {numChildren}
                          </span>
                          <button
                            type="button"
                            onClick={() => applyChildCount(1)}
                            className="w-7 h-7 border border-gray-200 rounded-full text-xs font-bold hover:bg-gray-50 flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowGuestsDropdown(false)}
                          className="px-3 py-1.5 bg-[#0a2315] text-white text-[10px] font-semibold uppercase rounded hover:bg-[#bd902f] cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full bg-[#0a2315] hover:bg-[#0e351f] text-white font-bold tracking-widest text-[11px] sm:text-xs uppercase py-3.5 sm:py-4 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 block cursor-pointer"
                  >
                    CHECK AVAILABILITY
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* FIVE COZY PROPOSITIONS / AMENITIES AREA */}
        <section
          id="services-grid"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
        >
          <div className="grid grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-1 divide-y md:divide-y-0 lg:divide-x divide-gray-200/60">
            {/* COLUMN 1 */}
            <div className="flex flex-col items-center justify-center text-center px-4 space-y-3 pt-6 lg:pt-0">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-950 flex items-center justify-center shadow-xs">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 7.5l-.625 10.125a3.75 3.75 0 01-3.75 3.75H8.125a3.75 3.75 0 01-3.75-3.75L3.75 7.5M10 3.75h4M12 21V3.75"
                  />
                </svg>
              </div>
              <h3 className="font-serif font-bold text-sm tracking-wide text-gray-900">
                Comfortable Rooms
              </h3>
              <p className="text-gray-500 font-light text-[11px] leading-relaxed max-w-[150px]">
                Relax in our stylish and spacious rooms
              </p>
            </div>

            {/* COLUMN 2 */}
            <div className="flex flex-col items-center justify-center text-center px-4 space-y-3 pt-6 lg:pt-0">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-950 flex items-center justify-center shadow-xs">
                <Utensils className="w-5 h-5 text-amber-950" />
              </div>
              <h3 className="font-serif font-bold text-sm tracking-wide text-gray-900">
                Fine Dining
              </h3>
              <p className="text-gray-500 font-light text-[11px] leading-relaxed max-w-[150px]">
                Enjoy delicious local and international cuisine
              </p>
            </div>

            {/* COLUMN 3 */}
            <div className="flex flex-col items-center justify-center text-center px-4 space-y-3 pt-6 lg:pt-0">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-950 flex items-center justify-center shadow-xs">
                <Wifi className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm tracking-wide text-gray-900">
                Free Wi-Fi
              </h3>
              <p className="text-gray-500 font-light text-[11px] leading-relaxed max-w-[150px]">
                Stay connected with high speed internet
              </p>
            </div>

            {/* COLUMN 4 - hidden on mobile to match design */}
            <div className="hidden lg:flex flex-col items-center justify-center text-center px-4 space-y-3 pt-6 lg:pt-0">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-950 flex items-center justify-center shadow-xs">
                <Users className="w-5 h-5 text-amber-950" />
              </div>
              <h3 className="font-serif font-bold text-sm tracking-wide text-gray-900">
                Meeting & Events
              </h3>
              <p className="text-gray-500 font-light text-[11px] leading-relaxed max-w-[150px]">
                Perfect space for your meetings and events
              </p>
            </div>

            {/* COLUMN 5 */}
            <div className="flex flex-col items-center justify-center text-center px-4 space-y-3 pt-6 lg:pt-0">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-950 flex items-center justify-center shadow-xs">
                <Bell className="w-5 h-5 text-amber-950" />
              </div>
              <h3 className="font-serif font-bold text-sm tracking-wide text-gray-900">
                24/7 Service
              </h3>
              <p className="text-gray-500 font-light text-[11px] leading-relaxed max-w-[150px]">
                We are here for you around the clock
              </p>
            </div>
          </div>
        </section>

        {/* ROOMS SELECTION BARN */}
        <section
          id="rooms-section"
          className="bg-[#f3f1eb] py-16 lg:py-24 border-t border-b border-gray-200/40"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2 mb-12 sm:mb-16">
              <span className="text-[11px] uppercase tracking-widest text-[#bd902f] font-bold block">
                OUR ROOMS
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-4.5xl text-gray-900 tracking-tight leading-none">
                Find Your Perfect Stay
              </h2>
            </div>

            {/* DESKTOP VERSION VIEW */}
            <div
              id="desktop-rooms"
              className="hidden lg:grid grid-cols-3 gap-8"
            >
              {roomsData.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden group flex flex-col justify-between transition-all duration-300"
                >
                  <div className="relative overflow-hidden aspect-[4/3] w-full bg-gray-100 shrink-0">
                    <img
                      src={room.image}
                      className="absolute inset-0 w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-500"
                      alt={room.name}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
                  </div>

                  <div className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-xl text-gray-900 mb-1 leading-snug">
                        {room.name}
                      </h3>
                      <div className="flex items-baseline gap-1 mt-1 text-xs">
                        <span className="text-gray-400 font-medium">From</span>
                        <strong className="text-[#bd902f] font-bold text-base">
                          ETB {room.price.toLocaleString()}
                        </strong>
                        <span className="text-gray-400 font-medium">
                          / Night
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenBooking(room)}
                      className="w-11 h-11 rounded-full bg-[#0a2315] hover:bg-[#bd902f] text-white hover:text-black flex items-center justify-center transition-colors duration-300 cursor-pointer shadow-md"
                      title={`Book ${room.name}`}
                      aria-label={`Secure slot for ${room.name}`}
                    >
                      <ChevronRight className="w-5 h-5 text-inherit" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* MOBILE INTERACTIVE SLIDER/CAROUSEL */}
            <div
              id="mobile-rooms-slider"
              className="block lg:hidden flex flex-col items-center"
            >
              {(() => {
                const activeRoom = roomsData[roomSliderIdx];
                return (
                  <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-gray-100 overflow-hidden flex flex-row items-stretch aspect-[18/10] sm:aspect-[16/7]">
                    <div className="w-[45%] relative bg-gray-150">
                      <img
                        src={activeRoom.image}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt={activeRoom.name}
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="w-[55%] p-4 flex flex-col justify-between bg-white relative">
                      <div className="space-y-1">
                        <h3 className="font-serif font-bold text-sm sm:text-base text-gray-900 leading-tight">
                          {activeRoom.name}
                        </h3>
                        <div className="pt-2">
                          <span className="text-[10px] text-gray-400 font-medium block">
                            From
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-[#bd902f]">
                            ETB {activeRoom.price.toLocaleString()}{" "}
                            <span className="text-[9px] text-gray-400 font-normal">
                              / Night
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleOpenBooking(activeRoom)}
                          className="w-8 h-8 rounded-full bg-[#0a2315] hover:bg-[#bd902f] text-white flex items-center justify-center shadow cursor-pointer"
                          title={`Secure ${activeRoom.name} slot`}
                          aria-label={`Prebook ${activeRoom.name}`}
                        >
                          <ChevronRight className="w-4 h-4 text-[#caa75d]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center gap-2 mt-6">
                {roomsData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setRoomSliderIdx(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      roomSliderIdx === idx ? "bg-[#0a2315] w-5" : "bg-gray-300"
                    }`}
                    aria-label={`Room slider indexing page ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FLOATING TICKET WIDGET FOR PERSISTED BOOKING */}
      {savedReservations.length > 0 && (
        <div id="floating-tickets-slip" className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setShowReservationsModal(true)}
            className="flex items-center gap-2 py-3 px-5 bg-[#0a2315] border border-[#bd902f]/40 hover:border-[#caa75d] text-[#caa75d] rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs font-bold tracking-widest cursor-pointer font-serif animate-pulse"
          >
            <span className="w-5 h-5 rounded-full bg-[#bd902f] text-black text-[10px] font-sans font-black flex items-center justify-center">
              {savedReservations.length}
            </span>
            <span>MY TICKETS</span>
          </button>
        </div>
      )}

      {/* BOARDING SLIPS DRAWER MODAL */}
      {showReservationsModal && (
        <div className="fixed inset-0 bg-[#04110a]/85 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 relative animate-in fade-in duration-200">
            <div className="bg-[#0a2315] text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[#caa75d]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
                <h3 className="font-serif text-base font-bold text-white">
                  Your Saved Boarding Slips
                </h3>
              </div>
              <button
                onClick={() => setShowReservationsModal(false)}
                className="text-gray-300 hover:text-white transition-colors p-1 cursor-pointer"
                aria-label="Close Tickets Modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {savedReservations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-xs">
                    No reservations booked yet. Your tickets will be shown here!
                  </p>
                </div>
              ) : (
                savedReservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-100 relative group space-y-2"
                  >
                    <button
                      onClick={() => handleCancelReservation(res.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                      title="Cancel Booking"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="text-xs">
                      <span className="text-[9px] uppercase tracking-widest text-[#bd902f] font-bold block">
                        {res.id}
                      </span>
                      <h4 className="font-serif font-black text-gray-900 pr-6 text-sm mt-0.5">
                        {res.roomName}
                      </h4>
                      <p className="text-gray-500 font-medium mt-1">
                        Guest: {res.guestName}
                      </p>
                      <p className="text-gray-400 text-[11px]">
                        {res.adults} Adults, {res.children} Children
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-dashed border-gray-200 text-[11px] text-gray-600">
                      <div>
                        <span className="block font-medium">
                          In:{" "}
                          {new Date(res.checkIn).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="block font-medium">
                          Out:{" "}
                          {new Date(res.checkOut).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[8px] text-[#caa75d] font-bold uppercase tracking-wider">
                          CONFIRMED SECURED
                        </span>
                        <strong className="text-gray-900 font-bold text-sm">
                          ETB {res.totalPrice.toLocaleString()}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-150 bg-gray-50 flex justify-end shrink-0">
              <button
                onClick={() => setShowReservationsModal(false)}
                className="px-5 py-2 bg-[#0a2315] hover:bg-[#bd902f] hover:text-black text-white text-[11px] font-bold uppercase rounded transition-colors duration-200 cursor-pointer"
              >
                Close Slips
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOKING RESERVATION OVERLAY FORM */}
      {selectedRoomToBook && (
        <div className="fixed inset-0 bg-[#04110a]/90 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 relative max-h-[92vh] flex flex-col justify-between animate-in fade-in duration-200">
            <div className="bg-[#0a2315] text-white p-5 flex justify-between items-center shrink-0">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#caa75d] block">
                  SECURE BOARDING PASS
                </span>
                <h3 className="font-serif font-bold text-base text-white mt-0.5">
                  Booking {selectedRoomToBook.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRoomToBook(null)}
                className="text-gray-300 hover:text-white transition-colors p-1 cursor-pointer"
                aria-label="Dismiss booking pass generator"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={handleConfirmReservation}
              className="p-6 overflow-y-auto space-y-4 flex-grow"
            >
              <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-200/40 text-xs text-amber-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#bd902f] shrink-0" />
                <p>
                  Securing a room slip in <strong>Diredawa Ras Hotel</strong>{" "}
                  using current travel itinerary dates.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 divide-y divide-gray-200/60 space-y-2 text-xs">
                <div className="flex justify-between pb-2">
                  <span className="text-gray-400">Nightly Rate:</span>
                  <span className="text-gray-800 font-semibold">
                    ETB {selectedRoomToBook.price.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Lodging Dates:</span>
                  <span className="text-gray-800 font-semibold">
                    {checkInDate} to {checkOutDate}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Total Travelers:</span>
                  <span className="text-gray-800 font-semibold">
                    {numAdults} Adult{numAdults > 1 ? "s" : ""}, {numChildren}{" "}
                    Kid{numChildren !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="text-gray-400 font-bold block">
                    Estimated Total:
                  </span>
                  <strong className="text-gray-900 text-sm font-black text-right block">
                    ETB{" "}
                    {(
                      selectedRoomToBook.price *
                      Math.max(
                        1,
                        Math.ceil(
                          (new Date(
                            checkOutDate === "Select Date"
                              ? getDayOffset(2)
                              : checkOutDate,
                          ).getTime() -
                            new Date(
                              checkInDate === "Select Date"
                                ? todayHex()
                                : checkInDate,
                            ).getTime()) /
                            (1000 * 60 * 60 * 24),
                        ),
                      )
                    ).toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Almaz Abraham Abebe"
                  value={renterName}
                  onChange={(e) => setRenterName(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-lg p-3 outline-none focus:ring-1 focus:ring-[#bd902f]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  placeholder="almaz.abebe@example.com"
                  value={renterEmail}
                  onChange={(e) => setRenterEmail(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-lg p-3 outline-none focus:ring-1 focus:ring-[#bd902f]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+251 911 234 567"
                  value={renterPhone}
                  onChange={(e) => setRenterPhone(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-lg p-3 outline-none focus:ring-1 focus:ring-[#bd902f]"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedRoomToBook(null)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg py-3 text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0a2315] hover:bg-[#bd902f] hover:text-black text-white rounded-lg py-3 text-xs font-bold transition-all uppercase cursor-pointer"
                >
                  CONFIRM SLIP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CINEMATIC WATCH VIDEO OVERLAY */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="relative max-w-4xl w-full aspect-video rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/90 text-white rounded-full p-2 transition-colors border border-white/10 cursor-pointer"
              title="Close Tour video"
            >
              <X className="w-5 h-5" />
            </button>

            <iframe
              src="https://www.youtube.com/embed/A8SAn7g_Ets?autoplay=1"
              title="Diredawa Ras Hotel Cinematic Tour Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="no-referrer"
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer
        id="contact"
        className="bg-[#04110a] text-gray-400 border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-6 text-center">
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-[#caa75d]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M5 18L3 9L9 12L12 4L15 12L21 9L19 18H5Z"
                fill="currentColor"
                fillOpacity="0.15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-serif font-black text-xs text-white uppercase tracking-widest">
              Diredawa Ras Hotel
            </span>
          </div>

          <div className="text-[11px] font-medium tracking-wide space-y-1">
            <p className="text-gray-300">
              Established 1934 in Dire Dawa, Ethiopia
            </p>
            <p className="text-gray-500">
              Genuine Hospitality, Absolute Comfort, Royal Legacy.
            </p>
          </div>

          <div className="flex items-center gap-6 text-[10px] font-bold tracking-widest">
            <a href="#" className="hover:text-white transition-colors">
              HOME
            </a>
            <a
              href="#rooms-section"
              className="hover:text-white transition-colors"
            >
              ROOMS
            </a>
            <a
              href="#services-grid"
              className="hover:text-white transition-colors"
            >
              SERVICES
            </a>
            <a
              href="tel:+251251111223"
              className="hover:text-white transition-colors"
            >
              RESERVATIONS
            </a>
          </div>

          <p className="text-[10px] text-gray-600 pt-3">
            &copy; {new Date().getFullYear()} Diredawa Ras Hotel. All
            hospitality rights protected.
          </p>
        </div>
      </footer>
    </div>
  );
}

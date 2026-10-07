export const hotelLocations = [
  {
    state: "Kerala",
    cities: ["Kochi", "Munnar", "Thiruvananthapuram"]
  },
  {
    state: "Tamil Nadu",
    cities: ["Chennai", "Ooty", "Coimbatore", "Madurai"]
  },
  {
    state: "Goa",
    cities: ["Goa", "North Goa", "South Goa"]
  },
  {
    state: "Karnataka",
    cities: ["Bengaluru", "Mysuru"]
  }
];

export const initialHotels = [
  {
    id: 1,
    name: "Kerala Heritage Resort",
    city: "Kochi",
    state: "Kerala",
    destination: "Kerala",
    rating: 4.8,
    price: 3200,
    rooms: 14,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    description: "Surrounded by lush heritage gardens and fresh spice aromas, Kerala Heritage Resort offers serene backwaters and authentic Kerala architecture.",
    amenities: ["Free Wi-Fi", "Breakfast", "Heritage Walk", "Swimming Pool", "Air conditioning"],
    latitude: 9.965628,
    longitude: 76.242104
  },
  {
    id: 2,
    name: "Grand Chennai Palace",
    city: "Chennai",
    state: "Tamil Nadu",
    destination: "Tamil Nadu",
    rating: 4.8,
    price: 3800,
    rooms: 16,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    description: "Luxury stay in central Chennai offering refined coastal architecture, multi-cuisine dining, and rooftop pool.",
    amenities: ["Free Wi-Fi", "Breakfast", "Swimming Pool", "Air conditioning", "Fitness Center"],
    latitude: 13.082680,
    longitude: 80.270718
  },
  {
    id: 3,
    name: "Ooty Misty Hills Resort",
    city: "Ooty",
    state: "Tamil Nadu",
    destination: "Tamil Nadu",
    rating: 4.7,
    price: 4200,
    rooms: 12,
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
    description: "Scenic hillside resort in the Nilgiri hills surrounded by tea gardens and misty mountain views.",
    amenities: ["Free Wi-Fi", "Breakfast", "Mountain View", "Fireplace", "Spa"],
    latitude: 11.410000,
    longitude: 76.695000
  },
  {
    id: 4,
    name: "Palm Shore Beach Resort",
    city: "Goa",
    state: "Goa",
    destination: "Goa",
    rating: 4.9,
    price: 4500,
    rooms: 20,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    description: "Direct beach access with private cabanas, tropical gardens, and oceanfront dining in Goa.",
    amenities: ["Free Wi-Fi", "Breakfast", "Beachfront", "Swimming Pool", "Bar"],
    latitude: 15.543940,
    longitude: 73.755330
  },
  {
    id: 5,
    name: "Goa Coastal Serenity Villa",
    city: "Goa",
    state: "Goa",
    destination: "Goa",
    rating: 4.6,
    price: 3900,
    rooms: 10,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    description: "Peaceful coastal retreat surrounded by swaying coconut palms and serene white-sand beaches.",
    amenities: ["Free Wi-Fi", "Breakfast", "Air conditioning", "Bicycle Rental"],
    latitude: 15.278500,
    longitude: 73.916800
  },
  {
    id: 6,
    name: "Bengaluru Royal Palace Hotel",
    city: "Bengaluru",
    state: "Karnataka",
    destination: "Karnataka",
    rating: 4.8,
    price: 4900,
    rooms: 22,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
    description: "Opulent urban sanctuary in the Silicon Valley of India with lavish suites and fine dining.",
    amenities: ["Free Wi-Fi", "Breakfast", "Air conditioning", "Spa", "Business Center"],
    latitude: 12.971599,
    longitude: 77.594566
  }
];

export const initialRooms = [
  {
    id: 1,
    name: "Standard Room",
    price: 1800,
    available: 8,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
    facilities: ["Wi-Fi", "Breakfast", "AC"]
  },
  {
    id: 2,
    name: "Deluxe Room",
    price: 2600,
    available: 5,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    facilities: ["Wi-Fi", "Breakfast", "AC", "TV"]
  },
  {
    id: 3,
    name: "Family Room",
    price: 3600,
    available: 4,
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80",
    facilities: ["2 Beds", "Kitchen", "Balcony"]
  },
  {
    id: 4,
    name: "Suite Room",
    price: 5200,
    available: 2,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
    facilities: ["Private Lounge", "Jacuzzi", "Premium Service"]
  }
];

export const initialBookings = [
  {
    id: 1,
    booking_id: "STAY-1710000001",
    full_name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 9876543210",
    selected_hotel: "Kerala Heritage Resort",
    selected_room: "Deluxe Room",
    check_in: "2026-10-15",
    check_out: "2026-10-18",
    guests: 2,
    payment_method: "UPI",
    status: "Confirmed",
    total_price: 7800
  }
];

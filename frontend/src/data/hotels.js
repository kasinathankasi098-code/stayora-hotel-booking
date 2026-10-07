import hotelExteriorImage from "../assets/images/hotel-exterior.jpg";
import hotelBedroomImage from "../assets/images/hotel-bedroom.jpg";
import hotelCityImage from "../assets/images/hotel-city.jpg";
import greenResortImage from "../assets/images/green-resort.jpg";
import hotelLobbyImage from "../assets/images/hotel-lobby.jpg";
import keralaImage from "../assets/images/kerala-backwaters.jpg";
import goaImage from "../assets/images/goa-beach.jpg";

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
    image: keralaImage,
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
    image: hotelExteriorImage,
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
    image: greenResortImage,
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
    image: goaImage,
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
    image: hotelBedroomImage,
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
    image: hotelCityImage,
    description: "Opulent urban sanctuary in the Silicon Valley of India with lavish suites and fine dining.",
    amenities: ["Free Wi-Fi", "Breakfast", "Air conditioning", "Spa", "Business Center"],
    latitude: 12.971599,
    longitude: 77.594566
  }
];

export const roomOptions = [
  {
    id: 1,
    name: "Standard Room",
    price: 1800,
    available: 8,
    image: hotelBedroomImage,
    facilities: ["Wi-Fi", "Breakfast", "AC"]
  },
  {
    id: 2,
    name: "Deluxe Room",
    price: 2600,
    available: 5,
    image: hotelCityImage,
    facilities: ["Wi-Fi", "Breakfast", "AC", "TV"]
  },
  {
    id: 3,
    name: "Family Room",
    price: 3600,
    available: 4,
    image: greenResortImage,
    facilities: ["2 Beds", "Kitchen", "Balcony"]
  },
  {
    id: 4,
    name: "Suite Room",
    price: 5200,
    available: 2,
    image: hotelLobbyImage,
    facilities: ["Private Lounge", "Jacuzzi", "Premium Service"]
  }
];

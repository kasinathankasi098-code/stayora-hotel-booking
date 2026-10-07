import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";
import Hotels from "./pages/hotel";
import HotelDetails from "./pages/HotelDetails";
import ManageHotels from "./pages/ManageHotels";
import Register from "./pages/register";
import Confirmation from "./pages/confirmation";
import Bookings from "./pages/bookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelDetails />} />
        <Route path="/manage-hotels" element={<ManageHotels />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/bookings" element={<Bookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

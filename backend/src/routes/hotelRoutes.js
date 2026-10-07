import { Router } from "express";
import {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel
} from "../controllers/hotelController.js";

const router = Router();

// /api/hotels
router.route("/")
  .get(getHotels)
  .post(createHotel);

// /api/hotels/:id
router.route("/:id")
  .get(getHotelById)
  .put(updateHotel)
  .delete(deleteHotel);

export default router;

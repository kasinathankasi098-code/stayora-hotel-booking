import { Router } from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
} from "../controllers/bookingController.js";

const router = Router();

// /api/bookings
router.route("/")
  .get(getBookings)
  .post(createBooking);

// /api/bookings/:id
router.route("/:id")
  .get(getBookingById)
  .put(updateBooking)
  .delete(deleteBooking);

export default router;

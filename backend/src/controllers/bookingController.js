import { BookingModel } from "../models/bookingModel.js";

export const getBookings = async (req, res, next) => {
  try {
    const { search, email, hotel, status } = req.query;
    const bookings = await BookingModel.findAll({ search, email, hotel, status });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await BookingModel.findByIdOrBookingId(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking with ID '${req.params.id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const {
      fullName,
      full_name,
      email,
      phone,
      selectedHotel,
      selected_hotel,
      selectedRoom,
      selected_room,
      checkIn,
      check_in,
      checkOut,
      check_out
    } = req.body;

    const name = fullName || full_name;
    const hotel = selectedHotel || selected_hotel;
    const room = selectedRoom || selected_room;
    const cIn = checkIn || check_in;
    const cOut = checkOut || check_out;

    if (!name || !email || !phone || !hotel || !room || !cIn || !cOut) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: full name, email, phone, hotel, room, check-in, and check-out dates."
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    // Date validation
    const inDate = new Date(cIn);
    const outDate = new Date(cOut);
    if (outDate < inDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date cannot be earlier than check-in date."
      });
    }

    const createdBooking = await BookingModel.create(req.body);

    res.status(201).json({
      success: true,
      message: "Booking confirmed successfully",
      data: createdBooking
    });
  } catch (error) {
    next(error);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const updatedBooking = await BookingModel.update(req.params.id, req.body);

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: `Booking with ID '${req.params.id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const deletedBooking = await BookingModel.delete(req.params.id);

    if (!deletedBooking) {
      return res.status(404).json({
        success: false,
        message: `Booking with ID '${req.params.id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted/cancelled successfully",
      data: deletedBooking
    });
  } catch (error) {
    next(error);
  }
};

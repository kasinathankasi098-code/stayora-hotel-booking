import { HotelModel } from "../models/hotelModel.js";

export const getHotels = async (req, res, next) => {
  try {
    const { search, city, destination, state, minPrice, maxPrice } = req.query;
    const hotels = await HotelModel.findAll({
      search,
      city,
      destination,
      state,
      minPrice,
      maxPrice
    });

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    next(error);
  }
};

export const getHotelById = async (req, res, next) => {
  try {
    const hotel = await HotelModel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: `Hotel with ID ${req.params.id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    next(error);
  }
};

export const createHotel = async (req, res, next) => {
  try {
    const { name, city, price, rooms } = req.body;

    if (!name || !city || price === undefined || rooms === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide hotel name, city, price, and rooms count."
      });
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number."
      });
    }

    if (isNaN(Number(rooms)) || Number(rooms) < 0) {
      return res.status(400).json({
        success: false,
        message: "Rooms must be a valid non-negative integer."
      });
    }

    const createdHotel = await HotelModel.create(req.body);

    res.status(201).json({
      success: true,
      message: "Hotel created successfully",
      data: createdHotel
    });
  } catch (error) {
    next(error);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const { price, rooms } = req.body;

    if (price !== undefined && (isNaN(Number(price)) || Number(price) <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number."
      });
    }

    if (rooms !== undefined && (isNaN(Number(rooms)) || Number(rooms) < 0)) {
      return res.status(400).json({
        success: false,
        message: "Rooms must be a valid non-negative integer."
      });
    }

    const updatedHotel = await HotelModel.update(req.params.id, req.body);

    if (!updatedHotel) {
      return res.status(404).json({
        success: false,
        message: `Hotel with ID ${req.params.id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: "Hotel updated successfully",
      data: updatedHotel
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    const deletedHotel = await HotelModel.delete(req.params.id);

    if (!deletedHotel) {
      return res.status(404).json({
        success: false,
        message: `Hotel with ID ${req.params.id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: "Hotel deleted successfully",
      data: deletedHotel
    });
  } catch (error) {
    next(error);
  }
};

import { LocationModel } from "../models/locationModel.js";

export const getLocations = async (req, res, next) => {
  try {
    const locations = await LocationModel.findAll();
    res.status(200).json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    next(error);
  }
};

export const getDestinations = async (req, res, next) => {
  try {
    const destinations = await LocationModel.getDestinations();
    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations
    });
  } catch (error) {
    next(error);
  }
};

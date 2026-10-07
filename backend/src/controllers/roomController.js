import { RoomModel } from "../models/roomModel.js";

export const getRooms = async (req, res, next) => {
  try {
    const { hotelId } = req.query;
    const rooms = await RoomModel.findAll({ hotelId });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};

export const getRoomById = async (req, res, next) => {
  try {
    const room = await RoomModel.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: `Room with ID ${req.params.id} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

export const createRoom = async (req, res, next) => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide room name and price."
      });
    }

    const createdRoom = await RoomModel.create(req.body);

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: createdRoom
    });
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await RoomModel.update(req.params.id, req.body);

    if (!updatedRoom) {
      return res.status(404).json({
        success: false,
        message: `Room with ID ${req.params.id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: updatedRoom
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const deletedRoom = await RoomModel.delete(req.params.id);

    if (!deletedRoom) {
      return res.status(404).json({
        success: false,
        message: `Room with ID ${req.params.id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
      data: deletedRoom
    });
  } catch (error) {
    next(error);
  }
};

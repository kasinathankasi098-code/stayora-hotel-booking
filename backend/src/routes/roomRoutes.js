import { Router } from "express";
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
} from "../controllers/roomController.js";

const router = Router();

// /api/rooms
router.route("/")
  .get(getRooms)
  .post(createRoom);

// /api/rooms/:id
router.route("/:id")
  .get(getRoomById)
  .put(updateRoom)
  .delete(deleteRoom);

export default router;

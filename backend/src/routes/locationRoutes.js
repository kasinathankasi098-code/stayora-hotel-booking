import { Router } from "express";
import { getLocations, getDestinations } from "../controllers/locationController.js";

const router = Router();

// /api/locations
router.get("/", getLocations);
router.get("/destinations", getDestinations);

export default router;

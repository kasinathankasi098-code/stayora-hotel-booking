import { Router } from "express";
import hotelRoutes from "./hotelRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import roomRoutes from "./roomRoutes.js";
import locationRoutes from "./locationRoutes.js";
import db from "../config/db.js";

const apiRouter = Router();

// Health check endpoint
apiRouter.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Stayora Hotel Booking API",
    database: db.getStatus()
  });
});

// Resource routes
apiRouter.use("/hotels", hotelRoutes);
apiRouter.use("/bookings", bookingRoutes);
apiRouter.use("/rooms", roomRoutes);
apiRouter.use("/locations", locationRoutes);

export default apiRouter;

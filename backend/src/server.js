import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import apiRoutes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup to allow frontend requests
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  "http://127.0.0.1:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev mode for smooth development
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Body parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// HTTP Request Logger
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Stayora Hotel Booking API",
    version: "1.0.0",
    docs: {
      health: "/api/health",
      hotels: "/api/hotels",
      bookings: "/api/bookings",
      rooms: "/api/rooms",
      locations: "/api/locations"
    }
  });
});

// API Routes
app.use("/api", apiRoutes);

// 404 Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

// Start Server and Database
async function startServer() {
  await connectDB();

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n=================================================`);
    console.log(` Stayora Hotel Booking Backend Server is Running!`);
    console.log(` Base URL: http://localhost:${PORT}`);
    console.log(` API Health: http://localhost:${PORT}/api/health`);
    console.log(` Hotels API: http://localhost:${PORT}/api/hotels`);
    console.log(` Bookings API: http://localhost:${PORT}/api/bookings`);
    console.log(` Rooms API: http://localhost:${PORT}/api/rooms`);
    console.log(` Locations API: http://localhost:${PORT}/api/locations`);
    console.log(`=================================================\n`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\n[Server Error]: Port ${PORT} is already in use.`);
      console.error(`Close the terminal currently running the backend, or free port ${PORT} using:\n  Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force\n`);
    } else {
      console.error("[Server Error]:", err.message);
    }
    process.exit(1);
  });
}

startServer();

export default app;

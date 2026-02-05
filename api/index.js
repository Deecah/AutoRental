import express from "express";
import dotenv from "dotenv";
import carRoutes from "../routes/car.routes.js";
import bookingRoutes from "../routes/booking.routes.js";
import userRoutes from "../routes/user.routes.js";
import contractRoutes from "../routes/contract.routes.js";
import { connectDB } from "../config/db.js";

// Load environment variables
dotenv.config();

const app = express();

// Initialize DB connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Home endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Car Rental API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      cars: "/cars",
      bookings: "/bookings",
      users: "/users",
      contracts: "/contracts"
    }
  });
});

// API Routes
app.use("/cars", carRoutes);
app.use("/bookings", bookingRoutes);
app.use("/users", userRoutes);
app.use("/contracts", contractRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    status: err.status || 500
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    status: 404
  });
});

export default app;

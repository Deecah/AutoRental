import express from "express";
import dotenv from "dotenv";
import { engine } from "express-handlebars";
import carRoutes from "./routes/car.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import userRoutes from "./routes/user.routes.js";
import contractRoutes from "./routes/contract.routes.js";
import { connectDB } from "./config/db.js";
import { helpers } from "./views/helpers/hbs-helpers.js";

const app = express();

// Load environment variables safely
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

connectDB();

// Cấu hình Handlebars
app.engine("hbs", engine({
  extname: ".hbs",
  defaultLayout: "main",
  layoutsDir: "./views/layouts",
  partialsDir: "./views/partials",
  helpers: helpers
}));
app.set("view engine", "hbs");
app.set("views", "./views");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Home endpoint (API response instead of rendering)
app.get("/", (req, res) => {
  res.json({ 
    message: "Car Rental API",
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
    error: err.message || "Internal Server Error",
    status: err.status || 500
  });
});

// Vercel serverless handler
export default app;

// Local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

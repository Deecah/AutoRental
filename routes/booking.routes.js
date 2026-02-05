import express from "express";
import * as bookingController from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/", bookingController.getBookings);
router.post("/", bookingController.createBooking);
router.get("/:bookingId", bookingController.getBookingById);
router.get("/user/:userId/bookings", bookingController.viewBooked);
router.get("/owner/bookings", bookingController.getOwnerCarBookings);
router.get("/admin/bookings/summary", bookingController.getBookings);

export default router;

import * as bookingService from "../services/booking.service.js";

function normalizeBookingsForView(bookings) {
  if (!Array.isArray(bookings)) return [];
  return bookings.map((b) => ({
    ...b,
    _id: b._id?.toString?.() ?? b._id,
    userId: b.userId
      ? { ...b.userId, _id: b.userId._id?.toString?.() }
      : null,
    carId: b.carId ? { ...b.carId, _id: b.carId._id?.toString?.() } : null
  }));
}

export async function getBookings(req, res) {
  try {
    const { userId } = req.query;

    const filter = {};
    if (userId) filter.userId = userId;

    const bookings = await bookingService.getBookings(filter);
    const bookingsForView = normalizeBookingsForView(bookings);

    res.render("bookings/list", {
      title: "Quản lý Đặt xe",
      bookings: bookingsForView,
      query: req.query || {}
    });
  } catch (err) {
    console.error("Error in getBookings:", err);
    res.status(500).render("error", {
      title: "Lỗi",
      message: err.message
    });
  }
}

export async function getBookingById(req, res) {
  try {
    const { bookingId } = req.params;

    const booking = await bookingService.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).render("error", {
        title: "Không tìm thấy",
        message: "Không tìm thấy đặt xe"
      });
    }
    const bookingForView = booking
      ? {
          ...booking,
          _id: booking._id?.toString?.() ?? booking._id,
          userId: booking.userId
            ? { ...booking.userId, _id: booking.userId._id?.toString?.() }
            : null,
          carId: booking.carId
            ? { ...booking.carId, _id: booking.carId._id?.toString?.() }
            : null
        }
      : null;

    res.render("bookings/detail", {
      title: "Chi tiết Đặt xe",
      booking: bookingForView
    });
  } catch (err) {
    res.status(500).render("error", {
      title: "Lỗi",
      message: err.message
    });
  }
}

export async function createBooking(req, res) {
  try {
    const { userId, carId, startDate, endDate } = req.body;

    const result = await bookingService.createBooking(userId, carId, startDate, endDate);

    res.redirect("/bookings");
  } catch (err) {
    if (err.message === "Car not found") {
      return res.status(404).render("error", {
        title: "Lỗi",
        message: err.message
      });
    }
    if (err.message === "Car is already booked") {
      return res.status(400).render("error", {
        title: "Lỗi",
        message: err.message
      });
    }
    res.status(500).render("error", {
      title: "Lỗi",
      message: err.message
    });
  }
}

export async function viewBooked(req, res) {
  try {
    const { userId } = req.params;
    const bookings = await bookingService.viewBooked(userId);
    const bookingsForView = normalizeBookingsForView(bookings);

    res.render("bookings/list", {
      title: "Đặt xe của Người dùng",
      bookings: bookingsForView,
      query: req.query || {}
    });
  } catch (err) {
    res.status(500).render("error", {
      title: "Lỗi",
      message: err.message
    });
  }
}

export async function getOwnerCarBookings(req, res) {
  try {
    const ownerId = req.user?._id || req.query.ownerId;
    const bookings = await bookingService.getOwnerCarBookings(ownerId);
    const bookingsForView = normalizeBookingsForView(bookings);

    res.render("bookings/list", {
      title: "Đặt xe của Chủ xe",
      bookings: bookingsForView,
      query: req.query || {}
    });
  } catch (err) {
    res.status(500).render("error", {
      title: "Lỗi",
      message: err.message
    });
  }
}
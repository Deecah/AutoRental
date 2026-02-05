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

    if (req.accepts('json') && !req.accepts('html')) {
      return res.json({
        success: true,
        data: bookingsForView,
        count: bookingsForView.length
      });
    }

    if (res.render) {
      return res.render("bookings/list", {
        title: "Quản lý Đặt xe",
        bookings: bookingsForView,
        query: req.query || {}
      });
    }

    res.json({ success: true, data: bookingsForView, count: bookingsForView.length });
  } catch (err) {
    console.error("Error in getBookings:", err);
    
    if (req.accepts('json') && !req.accepts('html')) {
      return res.status(500).json({
        success: false,
        error: err.message,
        status: 500
      });
    }

    if (res.render) {
      return res.status(500).render("error", {
        title: "Lỗi",
        message: err.message
      });
    }

    res.status(500).json({ success: false, error: err.message, status: 500 });
  }
}

export async function getBookingById(req, res) {
  try {
    const { bookingId } = req.params;

    const booking = await bookingService.getBookingById(bookingId);
    if (!booking) {
      if (req.accepts('json') && !req.accepts('html')) {
        return res.status(404).json({
          success: false,
          error: "Không tìm thấy đặt xe",
          status: 404
        });
      }
      if (res.render) {
        return res.status(404).render("error", {
          title: "Không tìm thấy",
          message: "Không tìm thấy đặt xe"
        });
      }
      return res.status(404).json({ success: false, error: "Không tìm thấy đặt xe", status: 404 });
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

    if (req.accepts('json') && !req.accepts('html')) {
      return res.json({
        success: true,
        data: bookingForView
      });
    }

    if (res.render) {
      return res.render("bookings/detail", {
        title: "Chi tiết Đặt xe",
        booking: bookingForView
      });
    }

    res.json({ success: true, data: bookingForView });
  } catch (err) {
    console.error("Error in getBookingById:", err);
    
    if (req.accepts('json') && !req.accepts('html')) {
      return res.status(500).json({
        success: false,
        error: err.message,
        status: 500
      });
    }

    if (res.render) {
      return res.status(500).render("error", {
        title: "Lỗi",
        message: err.message
      });
    }

    res.status(500).json({ success: false, error: err.message, status: 500 });
  }
}

export async function createBooking(req, res) {
  try {
    const { userId, carId, startDate, endDate } = req.body;

    if (!userId || !carId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: "userId, carId, startDate, and endDate are required",
        status: 400
      });
    }

    const result = await bookingService.createBooking(userId, carId, startDate, endDate);

    if (req.accepts('json') && !req.accepts('html')) {
      return res.status(201).json({
        success: true,
        data: result,
        message: "Booking created successfully"
      });
    }

    res.redirect("/bookings");
  } catch (err) {
    console.error("Error in createBooking:", err);
    const statusCode = err.message === "Car not found" ? 404 : 
                       err.message === "Car is already booked" ? 400 : 500;

    if (req.accepts('json') && !req.accepts('html')) {
      return res.status(statusCode).json({
        success: false,
        error: err.message,
        status: statusCode
      });
    }

    if (res.render) {
      return res.status(statusCode).render("error", {
        title: "Lỗi",
        message: err.message
      });
    }

    res.status(statusCode).json({ success: false, error: err.message, status: statusCode });
  }
}

export async function viewBooked(req, res) {
  try {
    const { userId } = req.params;
    const bookings = await bookingService.viewBooked(userId);
    const bookingsForView = normalizeBookingsForView(bookings);

    if (req.accepts('json') && !req.accepts('html')) {
      return res.json({
        success: true,
        data: bookingsForView,
        count: bookingsForView.length
      });
    }

    if (res.render) {
      return res.render("bookings/list", {
        title: "Đặt xe của Người dùng",
        bookings: bookingsForView,
        query: req.query || {}
      });
    }

    res.json({ success: true, data: bookingsForView, count: bookingsForView.length });
  } catch (err) {
    console.error("Error in viewBooked:", err);
    
    if (req.accepts('json') && !req.accepts('html')) {
      return res.status(500).json({
        success: false,
        error: err.message,
        status: 500
      });
    }

    if (res.render) {
      return res.status(500).render("error", {
        title: "Lỗi",
        message: err.message
      });
    }

    res.status(500).json({ success: false, error: err.message, status: 500 });
  }
}

export async function getOwnerCarBookings(req, res) {
  try {
    const ownerId = req.user?._id || req.query.ownerId;
    const bookings = await bookingService.getOwnerCarBookings(ownerId);
    const bookingsForView = normalizeBookingsForView(bookings);

    if (req.accepts('json') && !req.accepts('html')) {
      return res.json({
        success: true,
        data: bookingsForView,
        count: bookingsForView.length
      });
    }

    if (res.render) {
      return res.render("bookings/list", {
        title: "Đặt xe của Chủ xe",
        bookings: bookingsForView,
        query: req.query || {}
      });
    }

    res.json({ success: true, data: bookingsForView, count: bookingsForView.length });
  } catch (err) {
    console.error("Error in getOwnerCarBookings:", err);
    
    if (req.accepts('json') && !req.accepts('html')) {
      return res.status(500).json({
        success: false,
        error: err.message,
        status: 500
      });
    }

    if (res.render) {
      return res.status(500).render("error", {
        title: "Lỗi",
        message: err.message
      });
    }

    res.status(500).json({ success: false, error: err.message, status: 500 });
  }
}
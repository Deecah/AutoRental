import Car from "../models/car.model.js";
import Booking from "../models/booking.model.js";
import Contract from "../models/contract.model.js";

export function calculateRentalCost(startDate, endDate, pricePerDay) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDay = Math.ceil((end - start) / msPerDay);
  return totalDay * pricePerDay;
}

export async function checkCarAvailability(carId, startDate, endDate) {
  const conflict = await Booking.findOne({
    carId,
    startDate: { $lte: new Date(endDate) },
    endDate: { $gte: new Date(startDate) }
  });
  return !conflict;
}

export async function getBookings(filter) {
  const bookings = await Booking.find(filter)
    .populate("carId", "name pricePerDay status")
    .populate("userId", "name email phone")
    .lean();
  return Array.isArray(bookings) ? bookings : [];
}

export async function getBookingById(bookingId) {
  const booking = await Booking.findById(bookingId)
    .populate("carId", "name pricePerDay status")
    .populate("userId", "name email phone")
    .lean();
  return booking;
}

export async function createBooking(userId, carId, startDate, endDate) {
  const car = await Car.findById(carId);
  if (!car) {
    throw new Error("Car not found");
  }

  const isAvailable = await checkCarAvailability(carId, startDate, endDate);
  if (!isAvailable) {
    throw new Error("Car is already booked");
  }

  const totalCost = calculateRentalCost(startDate, endDate, car.pricePerDay);
  const status = "confirmed";

  const newBooking = await Booking.create({
    userId,
    carId,
    startDate,
    endDate,
    status,
    totalCost
  });
  let contract = null;
  const vat = totalCost * 0.1;
  console.log("VAT:", vat);
  const pay = totalCost + vat;
  console.log("Total Payable Amount:", pay);
  if (status === "confirmed") {
    contract = await Contract.create({
      bookingId: newBooking._id,
      totalCost
    });
  }

  return {
    booking: newBooking,
    contract: contract,
    vat: vat,
    pay: pay
  };
}

export async function viewBooked(userId) {
  const bookings = await Booking.find({ userId })
    .populate("carId", "name pricePerDay status")
    .populate("userId", "name email phone")
    .lean();
  return Array.isArray(bookings) ? bookings : [];
}

export async function getOwnerCarBookings(ownerId) {
  const ownerCars = await Car.find({ ownerId }).select("_id").lean();
  const ownerCarIds = ownerCars.map(car => car._id);
  const bookings = await Booking.find({ carId: { $in: ownerCarIds } })
    .populate("carId", "name pricePerDay status")
    .populate("userId", "name email phone")
    .lean();
  return Array.isArray(bookings) ? bookings : [];
}
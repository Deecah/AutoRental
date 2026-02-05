import Car from "../models/car.model.js";

export async function getCars(filter) {
  const cars = await Car.find(filter)
    .populate("ownerId", "name email phone")
    .lean();
  return Array.isArray(cars) ? cars : [];
}

export async function getCarById(carId) {
  const car = await Car.findById(carId)
    .populate("ownerId", "name email phone")
    .lean();
  return car;
}

export async function createCar(name, ownerId, pricePerDay, status = "available") {
  return await Car.create({
    name,
    ownerId,
    pricePerDay: Number(pricePerDay),
    status
  });
}

export async function searchCars(name, status, minPrice, maxPrice) {
  const filter = {};

  if (name) {
    filter.name = { $regex: name, $options: "i" };
  }

  if (status) {
    filter.status = status;
  }

  if (minPrice || maxPrice) {
    filter.pricePerDay = {};
    if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
    if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
  }

  const cars = await Car.find(filter)
    .populate("ownerId", "name email phone")
    .lean();
  return Array.isArray(cars) ? cars : [];
}

import * as carService from "../services/car.service.js";

/** Chuẩn hóa dữ liệu từ DB để view hiển thị đúng ( _id và ref thành string ) */
function normalizeCarsForView(cars) {
  if (!Array.isArray(cars)) return [];
  return cars.map((car) => ({
    ...car,
    _id: car._id?.toString?.() ?? car._id,
    ownerId: car.ownerId
      ? {
          ...(typeof car.ownerId === "object" ? car.ownerId : {}),
          _id: car.ownerId._id?.toString?.(),
          name: car.ownerId.name,
          email: car.ownerId.email,
          phone: car.ownerId.phone
        }
      : null
  }));
}

export async function getCars(req, res) {
  try {
    const { status, name, minPrice, maxPrice } = req.query;

    let cars;
    if (name || minPrice || maxPrice) {
      cars = await carService.searchCars(name, status, minPrice, maxPrice);
    } else {
      const filter = {};
      if (status) filter.status = status;
      cars = await carService.getCars(filter);
    }

    const carsForView = normalizeCarsForView(cars);

    // Return JSON for API requests, render HTML for browser requests
    if (req.accepts('json') && !req.accepts('html')) {
      return res.json({
        success: true,
        data: carsForView,
        count: carsForView.length
      });
    }

    // Try to render if available (development), otherwise return JSON
    if (res.render) {
      return res.render("cars/list", {
        title: "Quản lý Xe",
        cars: carsForView,
        query: req.query || {}
      });
    }

    res.json({ success: true, data: carsForView, count: carsForView.length });
  } catch (err) {
    console.error("Error in getCars:", err);
    
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

export async function getCarById(req, res) {
  try {
    const { id } = req.params;
    const car = await carService.getCarById(id);

    if (!car) {
      if (req.accepts('json') && !req.accepts('html')) {
        return res.status(404).json({
          success: false,
          error: "Không tìm thấy xe",
          status: 404
        });
      }
      if (res.render) {
        return res.status(404).render("error", {
          title: "Không tìm thấy",
          message: "Không tìm thấy xe"
        });
      }
      return res.status(404).json({ success: false, error: "Không tìm thấy xe", status: 404 });
    }

    const carForView = normalizeCarsForView([car])[0] || {
      ...car,
      _id: car._id?.toString?.(),
      ownerId: car.ownerId
        ? { ...car.ownerId, _id: car.ownerId._id?.toString?.() }
        : null
    };

    if (req.accepts('json') && !req.accepts('html')) {
      return res.json({
        success: true,
        data: carForView
      });
    }

    if (res.render) {
      return res.render("cars/detail", {
        title: "Chi tiết Xe",
        car: carForView
      });
    }

    res.json({ success: true, data: carForView });
  } catch (err) {
    console.error("Error in getCarById:", err);
    
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

export async function createCar(req, res) {
  try {
    const { name, ownerId, pricePerDay, status } = req.body;
    
    if (!name || !pricePerDay) {
      return res.status(400).json({
        success: false,
        error: "Name and price are required",
        status: 400
      });
    }

    const newCar = await carService.createCar(name, ownerId, pricePerDay, status);
    
    if (req.accepts('json') && !req.accepts('html')) {
      return res.status(201).json({
        success: true,
        data: newCar,
        message: "Car created successfully"
      });
    }

    // Redirect for browser requests
    res.redirect("/cars");
  } catch (err) {
    console.error("Error in createCar:", err);
    
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

export async function searchCars(req, res) {
  try {
    const { name, status, minPrice, maxPrice } = req.query;
    const cars = await carService.searchCars(name, status, minPrice, maxPrice);
    const carsForView = normalizeCarsForView(cars);

    if (req.accepts('json') && !req.accepts('html')) {
      return res.json({
        success: true,
        data: carsForView,
        count: carsForView.length
      });
    }

    if (res.render) {
      return res.render("cars/list", {
        title: "Tìm kiếm Xe",
        cars: carsForView,
        query: req.query || {}
      });
    }

    res.json({ success: true, data: carsForView, count: carsForView.length });
  } catch (err) {
    console.error("Error in searchCars:", err);
    
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

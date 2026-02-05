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

    res.render("cars/list", {
      title: "Quản lý Xe",
      cars: carsForView,
      query: req.query || {}
    });
  } catch (err) {
    console.error("Error in getCars:", err);
    res.status(500).render("error", {
      title: "Lỗi",
      message: err.message
    });
  }
}

export async function getCarById(req, res) {
  try {
    const { id } = req.params;
    const car = await carService.getCarById(id);

    if (!car) {
      return res.status(404).render("error", {
        title: "Không tìm thấy",
        message: "Không tìm thấy xe"
      });
    }

    const carForView = normalizeCarsForView([car])[0] || {
      ...car,
      _id: car._id?.toString?.(),
      ownerId: car.ownerId
        ? { ...car.ownerId, _id: car.ownerId._id?.toString?.() }
        : null
    };

    res.render("cars/detail", {
      title: "Chi tiết Xe",
      car: carForView
    });
  } catch (err) {
    res.status(500).render("error", {
      title: "Lỗi",
      message: err.message
    });
  }
}

export async function createCar(req, res) {
  try {
    const { name, ownerId, pricePerDay, status } = req.body;
    await carService.createCar(name, ownerId, pricePerDay, status);
    res.redirect("/cars");
  } catch (err) {
    res.status(500).render("error", {
      title: "Lỗi",
      message: err.message
    });
  }
}

export async function searchCars(req, res) {
  try {
    const { name, status, minPrice, maxPrice } = req.query;
    const cars = await carService.searchCars(name, status, minPrice, maxPrice);
    const carsForView = normalizeCarsForView(cars);

    res.render("cars/list", {
      title: "Tìm kiếm Xe",
      cars: carsForView,
      query: req.query || {}
    });
  } catch (err) {
    console.error("Error in searchCars:", err);
    res.status(500).render("error", {
      title: "Lỗi",
      message: err.message
    });
  }
}

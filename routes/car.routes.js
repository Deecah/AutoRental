import express from "express";
import * as carController from "../controllers/car.controller.js";

const router = express.Router();

router.get("/", carController.getCars);
router.get("/search", carController.searchCars);
router.get("/:id", carController.getCarById);
router.post("/", carController.createCar);

export default router;

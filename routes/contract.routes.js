import express from "express";
import * as contractController from "../controllers/contract.controller.js";

const router = express.Router();

router.get("/", contractController.getContracts);
router.get("/:id", contractController.getContractById);
router.post("/", contractController.createContract);

export default router;

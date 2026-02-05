import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    totalCost: { type: Number, required: true }
});

const Contract = mongoose.model("Contract", contractSchema, "contracts");
export default Contract;

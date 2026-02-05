import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { 
    type: String, 
    enum: {
      values: ["available", "booked"],
      message: "Status must be one of: available, booked"
    }, 
    default: "available" 
  },
  pricePerDay: { type: Number, required: true },
});

const Car = mongoose.model("Car", carSchema, "cars");
export default Car;

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  status: { 
    type: String, 
    enum: {
      values: ["pending", "confirmed", "declined"],
      message: "Status must be one of: pending, confirmed, declined"
    }, 
    default: "pending" 
  },
  startDate: { type: Date, required: true },
  endDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        if (!this.startDate) return true;
        return value > this.startDate;
      },
      message: "endDate must be after startDate"
    }
  },
  totalCost: { type: Number, required: true }
});

const Booking = mongoose.model("Booking", bookingSchema, "bookings");
export default Booking;
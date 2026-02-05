import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: {
      values: ["admin", "owner", "customer"],
      message: "Role must be one of: admin, owner, customer"
    },
    default: "customer"
  },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
});

export const User = mongoose.model("User", userSchema, "users");

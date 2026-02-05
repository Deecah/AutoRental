import { User } from "../models/user.model.js";

export async function getUsers(filter) {
  const users = await User.find(filter).lean();
  return Array.isArray(users) ? users : [];
}

export async function getUserById(userId) {
  const user = await User.findById(userId).lean();
  return user;
}

export async function createUser(name, email, phone, role = "customer") {
  const newUser = await User.create({
    name,
    email,
    phone,
    role
  });
  return newUser;
}

export async function updateUser(userId, updateData) {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, runValidators: true }
  );
  return updatedUser;
}

export async function deleteUser(userId) {
  const deletedUser = await User.findByIdAndDelete(userId);
  return deletedUser;
}

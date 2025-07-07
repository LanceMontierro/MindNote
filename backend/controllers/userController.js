import userSchema from "../models/User.js";
import axios from "axios";
import { verifyToken } from "@clerk/backend";

export const saveUser = async (req, res) => {
  const { email, userName, userId } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ message: "User ID and email are required" });
  }

  try {
    const existingUser = await userSchema.findOne({ userId });

    if (existingUser) {
      return res.status(201).json({ message: "Welcome Back!", existingUser });
    }

    const newUser = new userSchema({
      email,
      userName,
      userId,
    });
    await newUser.save();

    return res.status(200).json({ message: "Welcome!", newUser });
  } catch (error) {
    console.error("Error saving user:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteUserAcc = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: "Authorization header is missing" });
    }

    const token = authHeader.replace("Bearer ", "");
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    const clerkUserId = payload.sub;

    await axios.delete(`https://api.clerk.com/v1/users/${clerkUserId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    await userSchema.findOneAndDelete({ userId: clerkUserId });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({
      message: "Unauthorized or failed to delete user",
      error: error.message,
    });
  }
};

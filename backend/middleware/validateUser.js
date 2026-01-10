import userSchema from "../models/User.js";

export const validateUser = async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const user = await userSchema.findOne({ userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  req.user = user;
  next();
};

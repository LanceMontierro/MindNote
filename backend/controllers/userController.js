import userSchema from "../models/User.js";

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

export const deleteUserAcc = async (req, res) => {};

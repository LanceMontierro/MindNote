import express from "express";
import { saveUser, deleteUserAcc } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post("/save-user", saveUser);
userRoutes.delete("/delete-user", deleteUserAcc);

export default userRoutes;

import express from "express";
import { saveUser } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post("/save-user", saveUser);

export default userRoutes;

import express from "express";
import { pinNote } from "../controllers/pinNotesController.js";
import { validateUser } from "../middleware/validateUser.js";
const pinRoutes = express.Router();

pinRoutes.post("/pin-note", validateUser, pinNote);

export default pinRoutes;

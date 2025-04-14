import express from "express";
import { pinNote } from "../controllers/pinNotesController.js";

const pinRoutes = express.Router();

pinRoutes.post("/pin-note", pinNote);

export default pinRoutes;

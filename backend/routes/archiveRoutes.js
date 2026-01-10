import express from "express";
import { archiveNote } from "../controllers/archiveController.js";
import { validateUser } from "../middleware/validateUser.js";
const archiveRouter = express.Router();

archiveRouter.post("/archive-note", validateUser, archiveNote);

export default archiveRouter;

import express from "express";

import { archiveNote } from "../controllers/archiveController.js";

const archiveRouter = express.Router();

archiveRouter.post("/archive-note", archiveNote);

export default archiveRouter;

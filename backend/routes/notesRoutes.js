import express from "express";
import {
  getNote,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";
import { validateUser } from "../middleware/validateUser.js";
const notesRoutes = express.Router();

notesRoutes.get("/get-notes", getNote);
notesRoutes.post("/create-note", validateUser, createNote);
notesRoutes.patch("/update-note", validateUser, updateNote);
notesRoutes.delete("/delete-note", validateUser, deleteNote);

export default notesRoutes;

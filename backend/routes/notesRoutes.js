import express from "express";
import {
  getNote,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";

const notesRoutes = express.Router();

notesRoutes.get("/get-notes", getNote);
notesRoutes.post("/create-note", createNote);
notesRoutes.patch("/update-note", updateNote);
notesRoutes.delete("/delete-note", deleteNote);

export default notesRoutes;

import express from "express";
import {
  generateNote,
  saveGeneratedNotes,
  generateNoteFromAudio,
} from "../controllers/aiRouteController.js";
import multer from "multer";

const aiRoutes = express.Router();
const upload = multer();

aiRoutes.post("/generate-note", generateNote);
aiRoutes.post("/save-generated-note", saveGeneratedNotes);
aiRoutes.post("/audio-prompt", upload.single("audio"), generateNoteFromAudio);
export default aiRoutes;

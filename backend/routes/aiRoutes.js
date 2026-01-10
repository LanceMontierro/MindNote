import express from "express";
import {
  generateNote,
  saveGeneratedNotes,
  generateNoteFromAudio,
} from "../controllers/aiRouteController.js";
import multer from "multer";
import { validateUser } from "../middleware/validateUser.js";
import { geminiDefaults } from "../middleware/aiConfigs.js";

const aiRoutes = express.Router();
const upload = multer();

aiRoutes.post("/generate-note", validateUser, geminiDefaults, generateNote);
aiRoutes.post(
  "/save-generated-note",
  validateUser,
  geminiDefaults,
  saveGeneratedNotes
);
aiRoutes.post(
  "/audio-prompt",
  validateUser,
  upload.single("audio"),
  geminiDefaults,
  generateNoteFromAudio
);
export default aiRoutes;

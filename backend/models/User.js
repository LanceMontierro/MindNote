import mongoose from "mongoose";

const userSchema = mongoose.model(
  "Users",
  new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
    notes: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        pinned: { type: Boolean, default: false },
      },
    ],
    pinnedNotes: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        pinned: { type: Boolean, default: true },
      },
    ],
    archivedNotes: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  })
);

export default userSchema;

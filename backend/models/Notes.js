import mongoose from "mongoose";

const noteSchema = mongoose.model(
  "Notes",
  new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    pinned: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() },
  })
);

export default noteSchema;

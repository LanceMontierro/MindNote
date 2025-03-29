import noteSchema from "../models/Notes.js";
import userSchema from "../models/User.js";

export const createNote = async (req, res) => {
  //   const { title, content,  } = req.body;
};

export const getNote = async (req, res) => {
  const { userId } = req.body;

  try {
    const uid = await userSchema.findOne({ userId });
    const notes = await noteSchema.find();

    if (!uid) {
      return res.status(404).json({ message: "User not found" });
    }

    if (notes.length === 0) {
      return res.status(404).json({ message: "No notes found" });
    }
    res.status(200).json({ notes });
  } catch (error) {
    console.error("Error getting notes:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateNote = async (req, res) => {
  const { title, content, pinned, id } = req.body;

  try {
    const note = await noteSchema.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.title = title || note.title;
    note.content = content || note.content;
    note.pinned = pinned !== undefined ? pinned : note.pinned;

    await note.save();
    res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error("Error updating note", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  const { id } = req.body;
  try {
    const deleteNote = await noteSchema.findByIdAndDelete(id);

    if (!deleteNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

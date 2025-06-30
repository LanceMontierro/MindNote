import userSchema from "../models/User.js";

export const createNote = async (req, res) => {
  const { title, content, userId } = req.body;

  try {
    const user = await userSchema.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const existingNote = user.notes.find((note) => note.title === title);

    if (existingNote) {
      return res.status(409).json({ message: "Note already exists" });
    } else {
      const newNote = { title, content };
      user.notes.push(newNote);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Note created successfully",
        data: newNote,
      });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getNote = async (req, res) => {
  const uid = req.query.uid;

  if (!uid) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await userSchema.findOne({ userId: uid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.notes.length === 0) {
      return res.status(404).json({ message: "No notes found" });
    }

    res.status(200).json(user.notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNote = async (req, res) => {
  const { title, content, userId, id } = req.body;

  try {
    const user = await userSchema.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!id) {
      return res.status(400).json({ message: "Note ID is required" });
    }

    const note = user.notes.id(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (title) {
      const existingNoteTitle = user.notes.find(
        (n) =>
          n._id.toString() !== id &&
          n.title.trim().toLowerCase() === title.trim().toLowerCase()
      );

      if (existingNoteTitle) {
        return res
          .status(400)
          .json({ message: "Note with this title already exists" });
      }
      note.title = title;
    }

    if (content) note.content = content;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  const { id, userId } = req.body;
  try {
    const user = await userSchema.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const noteIndex = user.notes.findIndex(
      (note) => note._id.toString() === id
    );

    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    user.notes.splice(noteIndex, 1);

    await user.save();

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

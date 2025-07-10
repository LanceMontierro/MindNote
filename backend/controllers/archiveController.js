import userSchema from "../models/User.js";

export const archiveNote = async (req, res) => {
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

    user.notes[noteIndex].archived = !user.notes[noteIndex].archived;
    await user.save();

    if (user.notes[noteIndex].archived) {
      return res.status(200).json({ message: "Note archived successfully" });
    }

    res.status(200).json({ message: "Note Unarchived successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

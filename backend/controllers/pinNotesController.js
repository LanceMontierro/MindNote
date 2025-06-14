import userSchema from "./../models/User.js";
export const pinNote = async (req, res) => {
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

    user.notes[noteIndex].pinned = !user.notes[noteIndex].pinned;
    await user.save();

    res.status(200).json({
      message: "Note pin status updated",
      note: user.notes[noteIndex],
    });
  } catch (error) {
    console.error("Error pinning note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

import userSchema from "../models/User.js";

export const pinNote = async (req, res) => {
  const { id, userId, title, content, createdAt } = req.body;

  try {
    const user = await userSchema.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const note = user.notes.find((note) => note._id.toString() === id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const isAlreadyPinned = user.pinnedNotes.some(
      (pinnedNote) =>
        pinnedNote.title === note.title && pinnedNote.content === note.content
    );

    if (isAlreadyPinned) {
      user.pinnedNotes = user.pinnedNotes.filter(
        (pinnedNote) =>
          pinnedNote.title !== note.title || pinnedNote.content !== note.content
      );
    } else {
      user.pinnedNotes.push({
        title: title,
        content: content,
        createdAt: createdAt,
        pinned: true,
      });
    }

    await user.save();

    res.status(200).json({ message: "Note pin status updated", note });
  } catch (error) {
    console.error("Error pinning note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

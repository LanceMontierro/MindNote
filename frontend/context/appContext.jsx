import { useState, useContext, createContext, useEffect, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { notifySuccess, notifyError } from "../toastUtils/toast";
const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

const ContextApi = ({ children }) => {
  const { user, isSignedIn } = useUser();
  const [userAccount, setUserAccount] = useState("");
  const [notes, setNotes] = useState([]);
  const [titleState, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState("Home");
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isSignedIn && user) {
      setUserAccount(user);
    }
  }, [isSignedIn, user]);

  const fetchNotes = async () => {
    if (!userAccount) {
      console.error("User account is not set. Cannot fetch notes.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/notes/get-notes?uid=${userAccount.id}`
      );

      console.log(userAccount.id);

      if (response.data) {
        setNotes(response.data);
      } else {
        console.error("Invalid API response:", response.data);
      }
    } catch (error) {
      console.error(
        "Error fetching notes:",
        error.response ? error.response.data : error
      );
    }
  };

  useEffect(() => {
    if (userAccount) {
      fetchNotes();
    }
  }, [userAccount]);

  const createNewNote = async (title, content) => {
    if (!userAccount) {
      console.error("Please sign in to create a note.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/notes/create-note`, {
        title: title,
        content: content,
        userId: userAccount.id,
      });

      if (response.data && response.data.note) {
        fetchNotes();
        notifySuccess(response.data.message);
      } else {
        notifyError(response.data.message);
      }
    } catch (error) {
      notifyError(error.response?.data?.message || "Failed to create note");
      console.error("Error creating note:", error);
    }
  };

  const updateNote = async (title, content, id) => {
    try {
      if (!userAccount) {
        console.error("Please sign in to update a note.");
        return;
      }

      const response = await axios.patch(`${API_URL}/notes/update-note`, {
        title: title,
        content: content,
        userId: userAccount.id,
        id: id,
      });

      if (response.status === 200) {
        await fetchNotes();
        notifySuccess(response.data.message);
        return { success: true };
      } else {
        notifyError(response.data.message || "Failed to update note");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        notifyError(error.response?.data?.message || "Failed to update note");
        return { error: error.response.data.message };
      }
      return { error: "Failed to update note." };
    }
  };

  const deleteNote = async (id) => {
    try {
      if (!userAccount) {
        console.error("Please sign in to update a note.");
        return;
      }

      const response = await axios.delete(`${API_URL}/notes/delete-note`, {
        data: { id, userId: userAccount.id },
      });

      if (response.status === 200) {
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
        notifySuccess(response.data.message);
      } else {
        notifyError(response.data.message || "Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const pinNote = async (note) => {
    try {
      if (!userAccount) {
        console.error("Please sign in to pin a note.");
        return;
      }

      const response = await axios.post(`${API_URL}/notes/pin-note`, {
        id: note._id,
        userId: userAccount.id,
      });

      setNotes((prevNotes) =>
        prevNotes.map((n) =>
          n._id === note._id ? { ...n, pinned: !n.pinned } : n
        )
      );
    } catch (error) {
      console.error("Failed to pin note", error);
    }
  };

  const archivedNote = async (note) => {
    try {
      if (!userAccount) {
        console.error("Please sign in to archive a note.");
        return;
      }

      const response = await axios.post(`${API_URL}/notes/archive-note`, {
        id: note._id,
        userId: userAccount.id,
      });

      setNotes((prevNotes) =>
        prevNotes.map((n) =>
          n._id === note._id ? { ...n, archived: !n.archived } : n
        )
      );
    } catch (error) {
      console.error("Failed to archive note", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isSignedIn,
        notes,
        setNotes,
        active,
        setActive,
        userAccount,
        setUserAccount,
        createNewNote,
        updateNote,
        description,
        setDescription,
        titleState,
        setTitle,
        deleteNote,
        pinNote,
        fetchNotes,
        showPinnedOnly,
        setShowPinnedOnly,
        archivedNote,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextApi;

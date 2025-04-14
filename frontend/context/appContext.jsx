import { useState, useContext, createContext, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

const ContextApi = ({ children }) => {
  const { user, isSignedIn } = useUser();
  const [userAccount, setUserAccount] = useState("");
  const [notes, setNotes] = useState([]);
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [titleState, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState("Home");

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
      }
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const updateNote = async (title, content, id) => {
    console.log("🔄 updateNote called with:", { title, content, id });
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
      console.log("✅ updateNote response:", response);

      if (response.status === 200) {
        await fetchNotes();
      }
    } catch (error) {
      console.error("Error updating note:", error);
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
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const pinNote = async (id, title, content, createdAt) => {
    if (!userAccount) {
      console.error("Please sign in to pin a note.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/notes/pin-note`, {
        id: id,
        userId: userAccount.id,
        title: title,
        content: content,
        createdAt: createdAt,
      });

      if (response.status === 200) {
        await fetchNotes();
      }

      console.log("✅ Pin note response:", response);
    } catch (error) {
      console.error("Error pinning note:", error);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextApi;

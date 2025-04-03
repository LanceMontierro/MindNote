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

      if (response.data && response.data.notes) {
        setNotes(response.data.notes);
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
        setNotes((prevNotes) => [...prevNotes, response.data.note]);
      }
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const updateNote = async () => {
    try {
    } catch (error) {}
  };

  const deleteNote = async () => {
    try {
    } catch (error) {}
  };

  const pinNote = async () => {
    try {
    } catch (error) {}
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextApi;

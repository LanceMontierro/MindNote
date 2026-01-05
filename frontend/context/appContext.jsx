import { useState, useContext, createContext, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
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
  const [activeFeature, setActiveFeature] = useState("All Notes");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  console.log(messages);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isSignedIn && user) {
      setUserAccount(user);
    }
  }, [isSignedIn, user]);

  console.log(userAccount);

  const deleteUserAccount = async () => {
    try {
      const token = await getToken();

      console.log(token);

      const response = await axios.delete(`${API_URL}/users/delete-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        notifySuccess(response.data.message);
      }
    } catch (error) {
      notifyError(error.response?.data?.message || "Failed to delete account");
    }
  };

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
        setNotes(response.data || []);
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

      if (response.status === 200) {
        await fetchNotes();
        notifySuccess(response.data.message);
      }
    } catch (error) {
      notifyError(`${error.response.data.message} `);
      console.error("Error creating note", error);
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

      if (response.status === 200) {
        notifySuccess(response.data.message);
      }
    } catch (error) {
      console.error("Failed to archive note", error);
    }
  };

  const generateNote = async (userPrompt) => {
    try {
      setLoading(true);
      if (!userAccount) return;

      // temporary AI placeholder so the UI shows 'Recognizing...'
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          title: userPrompt,
          timeStamp: new Date().toISOString(),
        },
        {
          role: "AI",
          content: "Recognizing...",
          timeStamp: new Date().toISOString(),
          temp: true,
        },
      ]);

      const response = await axios.post(`${API_URL}/ai/generate-note`, {
        prompt: userPrompt,
        userId: userAccount.id,
      });

      if (response.status === 200) {
        const aiContent = response.data.data.content;
        const title = response.data.data.title;

        // Replace the temporary AI placeholder with the actual response
        setMessages((prev) =>
          prev.map((m) =>
            m.role === "AI" && m.temp
              ? {
                  ...m,
                  content: aiContent,
                  title,
                  temp: false,
                  timeStamp: new Date().toISOString(),
                }
              : m
          )
        );
      }
    } catch (error) {
      console.error("Error generating note:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveGeneratedNote = async (title, content) => {
    try {
      if (!userAccount) {
        console.error("Please sign in to save a generated note.");
      }

      const response = await axios.post(`${API_URL}/ai/save-generated-note`, {
        title,
        content,
        userId: userAccount.id,
      });

      if (response.status === 200) {
        await fetchNotes();
        notifySuccess(response.data.message);
      }
    } catch (error) {
      console.error("Error saving generated note:", error);
      notifyError(error.response?.data?.message);
    }
  };

  const generateNoteFromAudio = async (audioBlob) => {
    try {
      setLoading(true);
      if (!userAccount) return;

      const timeStamp = new Date().toISOString();

      // Prepend a temporary user placeholder (will be replaced with transcript) and an AI placeholder
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          title: "Generating transcript...",
          timeStamp,
          temp: true,
        },
        {
          role: "AI",
          content: "Recognizing...",
          timeStamp,
          temp: true,
        },
      ]);

      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("userId", userAccount.id);

      console.log(audioBlob);

      const response = await axios.post(
        `${API_URL}/ai/audio-prompt`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        const aiContent = response.data.data.content;
        const title = response.data.data.title;

        // Update the temporary user/AI placeholders with the returned transcript and reply
        setMessages((prev) =>
          prev.map((m) => {
            if (m.role === "AI" && m.temp) {
              return {
                ...m,
                content: aiContent,
                title,
                temp: false,
                timeStamp: new Date().toISOString(),
              };
            }
            if (m.role === "user" && m.temp) {
              return {
                ...m,
                title,
                temp: false,
                timeStamp: m.timeStamp || new Date().toISOString(),
              };
            }
            return m;
          })
        );
      }
    } catch (error) {
      console.error("Error generating note from audio:", error);
    } finally {
      setLoading(false);
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
        deleteUserAccount,
        activeFeature,
        setActiveFeature,
        prompt,
        setPrompt,
        generateNote,
        generateNoteFromAudio,
        saveGeneratedNote,
        loading,
        setLoading,
        messages,
        setMessages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextApi;

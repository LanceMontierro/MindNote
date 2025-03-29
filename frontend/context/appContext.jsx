import { useState, useContext, createContext } from "react";
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
  const [reminders, setReminders] = useState([]);
  const [pinNotes, setPinNotes] = useState([]);
  const [archives, setArchives] = useState([]);
  // const [toggleNav, setToggleNav] = useState(false);
  // const [toggleNotes, setToggleNotes] = useState(false);

  const [active, setActive] = useState("Home");

  const createNewNote = async () => {
    try {
    } catch (error) {}
  };

  const getNote = async () => {
    try {
    } catch (error) {}
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
        reminders,
        setReminders,
        pinNotes,
        setPinNotes,
        archives,
        setArchives,
        userAccount,
        setUserAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextApi;

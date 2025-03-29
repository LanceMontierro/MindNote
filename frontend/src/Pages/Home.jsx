import { IoCreateOutline } from "react-icons/io5";
import { TbPinnedFilled } from "react-icons/tb";
import { IoIosNotifications } from "react-icons/io";
import { FiArchive } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useState } from "react";
import { notes } from "../../const";
import { useAppContext } from "./../../context/appContext";
import { FaTrashCan, FaBook } from "react-icons/fa6";

const Home = () => {
  const [showOptions, setShowOptions] = useState(
    Array(notes.length).fill(false)
  );
  const [newNote, setNewNote] = useState();
  const { userAccount, setNotes } = useAppContext();

  const toggleOptions = (index) => {
    setShowOptions((prev) => {
      const newShowOptions = Array(notes.length).fill(false);
      newShowOptions[index] = !prev[index];

      return newShowOptions;
    });
  };

  return (
    <section className="flex-1 flex flex-col text-light py-2 mt-4">
      <span className="text-[22px] font-bold">Create New Note</span>

      <div className="grid md:grid-cols-4 grid-cols-2 gap-4 mt-4">
        <div className="card">
          <div className="w-10 h-10 rounded-full flexCenter bg-cyan-600">
            <IoCreateOutline className="w-6 h-6 " />
          </div>
          <span className="text-[16px]">Create</span>
        </div>

        <div className="card">
          <div className="w-10 h-10 rounded-full flexCenter bg-cyan-600">
            <IoIosNotifications className="w-6 h-6 " />
          </div>
          <span className="text-[16px]">Reminders</span>
        </div>

        <div className="card">
          <div className="w-10 h-10 rounded-full flexCenter bg-cyan-600">
            <TbPinnedFilled className="w-6 h-6 " />
          </div>
          <span className="text-[16px]">Pinned Notes</span>
        </div>

        <div className="card">
          <div className="w-10 h-10 rounded-full flexCenter bg-cyan-600">
            <FiArchive className="w-6 h-6 " />
          </div>
          <span className="text-[16px]">Archives</span>
        </div>
      </div>

      <span className="text-[22px] font-bold mt-4">My Notes</span>

      <div className="flex flex-col flex-wrap gap-3 mt-2 relative">
        {notes.map((note, _) => (
          <div key={note.id} className="relative">
            <div className="bg-[#262626] py-4 pl-6 pr-1 rounded-lg flexBetween w-full">
              <div className="flex items-center gap-2 w-full">
                <button>
                  <FaBook />
                </button>
                <p>{note.title}</p>
              </div>

              <button
                className="mr-5 cursor-pointer"
                onClick={() => toggleOptions(note.id)}
              >
                <BsThreeDotsVertical size={20} className="text-gray-500" />
              </button>
            </div>

            {showOptions[note.id] && (
              <div className="absolute right-0 bottom-[-120px] bg-light rounded-lg shadow-lg text-darked z-200">
                <button className="flex items-center gap-2 w-full text-left px-4 py-4 hover:bg-gray-200 rounded-lg">
                  <FiArchive size={20} />
                  <p>Add to Archived</p>
                </button>
                <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-200">
                  <FaTrashCan />
                  <p>Delete</p>
                </button>
                <button className="flex items-center gap-2 w-full text-left px-4 py-4 hover:bg-gray-200 rounded-lg">
                  <TbPinnedFilled />
                  <p>Pin Note</p>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Home;

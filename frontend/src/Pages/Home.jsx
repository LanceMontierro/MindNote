import { IoCreateOutline } from "react-icons/io5";
import { TbPinnedFilled } from "react-icons/tb";
import { IoIosNotifications } from "react-icons/io";
import { RiInboxArchiveLine } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrashCan, FaBook } from "react-icons/fa6";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "./../../context/appContext";

const Home = () => {
  const [showModal, setShowModal] = useState(false);

  const {
    createNewNote,
    notes,
    titleState,
    setTitle,
    description,
    setDescription,
    deleteNote,
    pinNote,
  } = useAppContext();
  const [showOptions, setShowOptions] = useState({});

  const toggleOptions = (noteId) => {
    setShowOptions((prev) => ({
      [noteId]: !prev[noteId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewNote(titleState, description);
    setTitle("");
    setDescription("");
    setShowModal(false);
  };

  return (
    <section className="flex-1 flex flex-col text-light py-2 mt-4 pb-32">
      <span className="text-[22px] font-bold">Create New Note</span>

      <div className="grid md:grid-cols-4 grid-cols-2 gap-4 mt-4 cursor-pointer">
        <div className="card" onClick={() => setShowModal(true)}>
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
            <RiInboxArchiveLine className="w-6 h-6 " />
          </div>
          <span className="text-[16px]">Archives</span>
        </div>
      </div>

      <span className="text-[22px] font-bold mt-4">My Notes</span>

      <div className="flex flex-col flex-wrap gap-3 mt-2 relative">
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <Link
              to={`/note/${note._id}`}
              key={note._id && note._id}
              className="relative"
            >
              <div className="bg-[#262626] py-4 pl-6 pr-1 rounded-lg flexBetween w-full">
                <div className="flex items-center gap-6 w-full">
                  <button>
                    {note.isPinned ? <TbPinnedFilled /> : <FaBook />}
                  </button>
                  <div className="flex flex-col gap-1 w-full justify-center">
                    <p>{note.title}</p>
                    <p className="text-gray-500 text-[12px]">
                      {note.createdAt && note.createdAt.split("T")[0]}
                    </p>
                  </div>
                </div>

                <button
                  className="mr-5 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    toggleOptions(note._id);
                  }}
                >
                  <BsThreeDotsVertical size={20} className="text-gray-500" />
                </button>
              </div>

              {showOptions[note._id] && (
                <div className="absolute right-0 bottom-[-120px] bg-light rounded-lg shadow-lg text-darked z-200">
                  <button className="flex items-center gap-2 w-full text-left px-4 py-4 hover:bg-gray-200 rounded-lg">
                    <RiInboxArchiveLine size={20} />
                    <p>Add to Archived</p>
                  </button>

                  <button
                    className="flex items-center gap-2 w-full text-left px-4 py-4 hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      pinNote(
                        note._id,
                        note.title,
                        note.content,
                        note.createdAt
                      );
                    }}
                  >
                    <TbPinnedFilled />
                    <p>Pin Note</p>
                  </button>
                  <button
                    className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-gray-200 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      deleteNote(note._id);
                    }}
                  >
                    <FaTrashCan />
                    <p>Delete Note</p>
                  </button>
                </div>
              )}
            </Link>
          ))
        ) : (
          <p>No notes available</p>
        )}
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg z-100">
            <h2 className="text-textSm font-bold mb-4 text-darked ">
              Create New Note
            </h2>
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border border-gray-300 rounded mb-4 text-darked"
              onChange={(e) => setTitle(e.target.value)}
              required
              value={titleState}
            />
            <textarea
              placeholder="Content"
              className="w-full p-2 border border-gray-300 rounded mb-4 text-darked"
              onChange={(e) => setDescription(e.target.value)}
              required
              value={description}
            ></textarea>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Create Note
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="ml-2 bg-cardDark border-[#fff] text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Home;

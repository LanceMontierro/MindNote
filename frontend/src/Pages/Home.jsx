import { IoCreateOutline } from "react-icons/io5";
import { TbPinnedFilled } from "react-icons/tb";
import { IoIosNotifications } from "react-icons/io";
import { RiInboxArchiveLine, RiUnpinFill } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrashCan, FaBook } from "react-icons/fa6";
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "./../../context/appContext";

import Pagination from "@mui/material/Pagination";

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
    showPinnedOnly,
    setShowPinnedOnly,
    archivedNote,
  } = useAppContext();
  const [showOptions, setShowOptions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const handlePinnedNotes = () => setShowPinnedOnly(true);
  const handleAllNotes = () => setShowPinnedOnly(false);

  const displayedNotes = useMemo(() => {
    const unArchivedNotes = notes
      .filter((note) => !note.archived)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return showPinnedOnly
      ? unArchivedNotes.filter((note) => note.pinned)
      : unArchivedNotes;
  }, [notes, showPinnedOnly]);

  const totalNotesPerPage = 5;
  const totalPage = Math.ceil(displayedNotes.length / totalNotesPerPage);

  const currentNotes = useMemo(() => {
    const startIndex = (currentPage - 1) * totalNotesPerPage;
    const endIndex = startIndex + totalNotesPerPage;

    return displayedNotes.slice(startIndex, endIndex);
  }, [currentPage, displayedNotes]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  useEffect(() => {
    if (currentPage > 1 && currentNotes.length === 0) {
      setCurrentPage(currentPage - 1);
    }
    console.log("this runs");
  }, [currentNotes, currentPage]);

  console.log(currentNotes);

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
    <section className="flex flex-col flex-1 px-4 py-2 pb-32 mt-4 border text-light border-cardDark rounded-2xl">
      <span className="text-textMd font-bold mt-4 max-[821px]:text-center max-[500px]:text-[22px]">
        Welcome to MindNote.
      </span>

      <div className="grid grid-cols-4 gap-4 mt-4 cursor-pointer max-[821px]:grid-cols-2">
        <div className="card" onClick={() => setShowModal(true)}>
          <div className="w-10 h-10 rounded-full flexCenter bg-secondary">
            <IoCreateOutline className="w-6 h-6 " />
          </div>
          <span className="text-[16px]">Create</span>
        </div>

        <div className="card" onClick={handleAllNotes}>
          <div className="w-10 h-10 rounded-full flexCenter bg-secondary">
            <IoIosNotifications className="w-6 h-6 " />
          </div>
          <span className="text-[16px]">All Notes</span>
        </div>

        <div className="card" onClick={handlePinnedNotes}>
          <div className="w-10 h-10 rounded-full flexCenter bg-secondary">
            <TbPinnedFilled className="w-6 h-6 " />
          </div>
          <span className="text-[16px]">Pinned Notes</span>
        </div>

        <Link to="/archived" className="card">
          <div className="w-10 h-10 rounded-full flexCenter bg-secondary">
            <RiInboxArchiveLine className="w-6 h-6 " />
          </div>
          <span className="text-[16px]">Archives</span>
        </Link>
      </div>

      <span className="text-[22px] font-bold md:mt-4 mt-6">My Notes</span>

      <div className="relative flex flex-col flex-wrap gap-3 mt-2">
        {currentNotes && currentNotes.length > 0 ? (
          currentNotes.map((note) => (
            <Link
              to={`/note/${note._id}`}
              key={note._id && note._id}
              className="relative"
            >
              <div className="w-full py-4 pl-6 pr-1 rounded-lg bg-cardDark flexBetween">
                <div className="flex items-center w-full gap-6">
                  <button>
                    {note.pinned ? <TbPinnedFilled /> : <FaBook />}
                  </button>
                  <div className="flex flex-col justify-center w-full gap-1">
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
                <div className="absolute right-0 bottom-[-120px] bg-cardDark rounded-lg shadow-lg  z-200">
                  <button
                    className="flex items-center w-full gap-2 px-4 py-4 text-left rounded-lg hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      archivedNote(note);
                      setShowOptions(false);
                    }}
                  >
                    {note.archived ? (
                      <>
                        <RiInboxArchiveLine size={20} />
                        <p>Unarchived Note</p>
                      </>
                    ) : (
                      <>
                        <RiInboxArchiveLine size={20} />
                        <p>Archived Note</p>
                      </>
                    )}
                  </button>

                  <button
                    className="flex items-center w-full gap-2 px-4 py-4 text-left hover:bg-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      pinNote(note);
                      setShowOptions(false);
                    }}
                  >
                    {note.pinned ? (
                      <>
                        <RiUnpinFill size={20} />
                        <p>Unpin Note</p>
                      </>
                    ) : (
                      <>
                        <TbPinnedFilled size={20} />
                        <p>Pin Note</p>
                      </>
                    )}
                  </button>
                  <button
                    className="flex items-center w-full gap-2 px-4 py-3 text-left rounded-lg hover:bg-gray-200"
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
          <p className="mt-4 text-gray-500">No notes found.</p>
        )}
        {totalPage > 0 && (
          <div className="flex justify-center mt-4">
            <Pagination
              color="primary"
              count={totalPage}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
            />
          </div>
        )}
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="absolute p-4 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg top-1/2 left-1/2 z-100">
            <h2 className="mb-4 font-bold text-textSm text-light ">
              Create New Note
            </h2>
            <input
              type="text"
              placeholder="Please Enter at least title"
              className="w-full p-2 mb-4 border border-gray-300 rounded text-light"
              onChange={(e) => setTitle(e.target.value)}
              required
              value={titleState}
            />
            <textarea
              placeholder="Content"
              className="w-full p-2 mb-4 border border-gray-300 rounded text-light"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            ></textarea>
            <button
              disabled={!titleState}
              onClick={handleSubmit}
              className={`px-4 py-2 text-white rounded bg-blue-500 ${
                titleState.length < 1
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer  "
              }`}
            >
              Create Note
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="ml-2 bg-cardDark border-[#fff] text-light px-4 py-2 rounded cursor-pointer"
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

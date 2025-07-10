import { Header, Sidebar } from "../Components";
import { RiInboxArchiveLine } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrashCan } from "react-icons/fa6";
import { useAppContext } from "./../../context/appContext";
import { useState } from "react";
const Archived = () => {
  const { notes, deleteNote, archivedNote } = useAppContext();

  const archivedNotes = notes.filter((note) => note.archived);
  const [showOptions, setShowOptions] = useState({});

  const handleShopwOptions = (id) => {
    setShowOptions((prev) => ({
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <Header />
      <div className="flex justify-between px-4 mx-auto max-w-7xl gap-14">
        <Sidebar />
        <div className="flex flex-col flex-1 px-4 py-2 pb-32 mt-4 border text-light border-cardDark rounded-2xl">
          <h2 className="text-textMd mt-4 max-[821px]:text-center max-[500px]:text-[22px]">
            Archived Notes
          </h2>
          <div className="relative flex flex-col flex-wrap gap-3 mt-2">
            {archivedNotes && archivedNotes.length > 0 ? (
              archivedNotes.map((note) => (
                <div key={note._id && note._id} className="relative">
                  <div className="w-full py-4 pl-6 pr-1 rounded-lg bg-cardDark flexBetween">
                    <div className="flex items-center w-full gap-6">
                      <button>
                        <RiInboxArchiveLine size={20} />
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
                        handleShopwOptions(note._id);
                      }}
                    >
                      <BsThreeDotsVertical
                        size={20}
                        className="text-gray-500"
                      />
                    </button>

                    {showOptions[note._id] && (
                      <div className="absolute right-0 bottom-[-70px] bg-cardDark rounded-lg shadow-lg z-200">
                        <button
                          className="flex items-center w-full gap-2 px-4 py-4 text-left rounded-lg hover:bg-gray-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            archivedNote(note);
                          }}
                        >
                          <RiInboxArchiveLine size={20} />
                          <p>Unarchive Note</p>
                        </button>

                        <button
                          className="flex items-center w-full gap-2 px-4 py-4 text-left rounded-lg hover:bg-gray-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            deleteNote(note._id);
                          }}
                        >
                          <FaTrashCan size={20} />
                          <p>Delete Note</p>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className=" text-gray-500 mt-4">No archived notes found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Archived;

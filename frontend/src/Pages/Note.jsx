import { Header, Sidebar } from "../Components";
import { useAppContext } from "../../context/appContext";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiInboxArchiveLine } from "react-icons/ri";
import { TbPinnedFilled } from "react-icons/tb";
import { FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";

const Note = () => {
  const { notes, updateNote, deleteNote } = useAppContext();
  const { id } = useParams();
  const [title, setTitleState] = useState("");
  const [content, setContent] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const note = notes.find((note) => note._id === id);

  useEffect(() => {
    if (note) {
      setTitleState(note.title);
      setContent(note.content);
    }
  }, [id, notes]);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleEdit = () => {
    setShowEditModal(!showEditModal);
    setShowOptions(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(!showDeleteModal);
    setShowOptions(false);
  };

  return (
    <>
      <Header />
      <div className="flex justify-between px-4 mx-auto max-w-7xl gap-14 ">
        <Sidebar />
        <div className="relative flex flex-col flex-1 py-4 pb-32 pl-6 pr-1 mt-4 border rounded-lg text-light border-cardDark ">
          <div className="gap-2 text-gray-400 flexBetween">
            <Link
              className="flex items-center gap-2 hover:text-light"
              to="/home"
            >
              <MdKeyboardArrowLeft size={20} />
              <p>Back</p>
            </Link>

            <div
              className="p-2 mr-4 rounded-lg cursor-pointer bg-cardDark hover:opacity-70"
              onClick={toggleOptions}
            >
              <BsThreeDotsVertical size={20} />
            </div>

            {showOptions && (
              <div className="absolute right-0 rounded-lg shadow-lg top-20 bg-cardDark text-light z-200">
                <button
                  className="flex items-center w-full gap-2 px-4 py-4 text-left rounded-lg hover:bg-gray-200"
                  onClick={handleEdit}
                >
                  <FaEdit size={20} />
                  <p>Edit Note</p>
                </button>
                <button className="flex items-center w-full gap-2 px-4 py-4 text-left hover:bg-gray-200 ">
                  <RiInboxArchiveLine size={20} />
                  <p>Add to Archived</p>
                </button>
                <button className="flex items-center w-full gap-2 px-4 py-4 text-left hover:bg-gray-200 ">
                  <TbPinnedFilled size={20} />
                  <p>Pin Note</p>
                </button>
                <button
                  className="flex items-center w-full gap-2 px-4 py-3 text-left rounded-lg hover:bg-gray-200"
                  onClick={handleDelete}
                >
                  <FaTrashCan size={20} />
                  <p>Delete Note</p>
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1 py-2 pb-32 text-light">
            <div className="mt-4">
              <h1 className="text-[24px] font-bold">{title}</h1>
              <p className="text-[16px] mt-2">{content}</p>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <>
            <>
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div className="absolute p-4 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg top-1/2 left-1/2 bg-cardDark z-100">
                <p className="mb-4 font-bold text-textSm text-light ">
                  Are you sure you want to delete this note?
                </p>

                <div className="flex gap-2 items-center max-[640px]:flex-col">
                  <button
                    className="w-full px-4 py-2 text-white duration-300 ease-in-out bg-red-600 rounded cursor-pointer hover:bg-red-800"
                    onClick={() => {
                      deleteNote(id);
                      setShowDeleteModal(false);
                      navigate("/home");
                    }}
                  >
                    Delete Note
                  </button>
                  <button
                    className=" bg-cardDark border-[#fff]  px-4 py-2 rounded cursor-pointer w-full"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          </>
        )}

        {showEditModal && (
          <>
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="absolute p-4 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg top-1/2 left-1/2 z-100">
              <p className="mb-4 font-bold text-textSm text-light ">
                Edit Note
              </p>
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 mb-4 border border-gray-300 rounded text-light"
                value={title}
                onChange={(e) => setTitleState(e.target.value)}
                required
              />
              <textarea
                placeholder="Content"
                className="w-full p-2 mb-4 border border-gray-300 rounded text-light"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>

              <div className="flex gap-2 items-center max-[640px]:flex-col">
                <button
                  className="w-full px-4 py-2 text-white bg-blue-500 rounded cursor-pointer"
                  onClick={async () => {
                    const result = await updateNote(title, content, id);
                    if (result?.success) {
                      setShowEditModal(false);
                    } else if (result?.error) {
                      alert(result.error);

                      if (note) {
                        setTitleState(note.title);
                        setContent(note.content);
                      }
                    }
                  }}
                >
                  Update Note
                </button>
                <button
                  className=" bg-cardDark border-[#fff] text-light px-4 py-2 rounded w-full cursor-pointer"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Note;

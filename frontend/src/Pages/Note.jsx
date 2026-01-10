import { Header, Sidebar } from "../Components";
import { useAppContext } from "../../context/appContext";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiInboxArchiveLine } from "react-icons/ri";
import { IoCopyOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { CiExport } from "react-icons/ci";
import { noteTabs } from "../../const";
import { notifyCopyClipBoard } from "../../toastUtils/toast";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const Note = () => {
  const { notes, updateNote, deleteNote, archivedNote } = useAppContext();
  const { id, tab } = useParams();
  const [title, setTitleState] = useState("");
  const [content, setContent] = useState("");
  const [titleEdit, setTitleEdit] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState([]);
  const [contentEdit, setContentEdit] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const copyModalRef = useRef(null);

  const navigate = useNavigate();

  console.log(tags);

  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 14,
    },
  }));

  // close copy modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showCopyModal &&
        copyModalRef.current &&
        !copyModalRef.current.contains(e.target)
      ) {
        setShowCopyModal(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") setShowCopyModal(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showCopyModal]);

  const note = notes.find((note) => note._id === id);

  const d = summary.split(".");
  console.log("Summary split test:", d);

  useEffect(() => {
    if (note) {
      setTitleState(note.title);
      setContent(note.content);
      setSummary(note.summary || "");
      setTags(note.tags || []);
    }
  }, [id, notes]);

  const activeTabName =
    noteTabs.find((t) => t.name.toLowerCase() === (tab ?? "transcript"))
      ?.name ?? "Transcript";

  console.log("Active Tab Name:", activeTabName);

  useEffect(() => {
    if (!tab && id) {
      navigate(`/note/${id}/transcript`, { replace: true });
    }
  }, [tab, id, navigate]);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleCopyModal = () => {
    setShowCopyModal(!showCopyModal);
  };

  const handleEdit = () => {
    setShowEditModal(!showEditModal);
    setShowOptions(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(!showDeleteModal);
    setShowOptions(false);
  };

  const handleTabClick = (tabName) => {
    // navigate to /note/:id/:tab (use lowercase in url)
    navigate(`/note/${id}/${encodeURIComponent(tabName.toLowerCase())}`);
  };

  return (
    <>
      <Header />
      <div className="flex justify-between px-4 mx-auto max-w-7xl gap-14 ">
        <Sidebar />
        <div className="relative flex flex-col flex-1 py-4 pb-32 pl-6 pr-1 mt-4 border rounded-lg text-light border-cardDark l ">
          <div className="gap-2 text-descriptionText flexBetween">
            <Link
              className="flex items-center gap-2 hover:text-light"
              to="/home"
            >
              <MdKeyboardArrowLeft size={20} />
              <p>Back</p>
            </Link>

            {noteTabs.map((tab) => (
              <div
                className={` cursor-pointer ${
                  activeTabName === tab.name
                    ? "btn-secondary px-4 py-2 rounded-2xl"
                    : "px-4 py-2"
                }`}
                key={tab.name}
                onClick={() => handleTabClick(tab.name)}
              >
                <p>{tab.name}</p>
              </div>
            ))}

            <div
              className="p-2 mr-4 rounded-lg cursor-pointer bg-cardDark hover:opacity-70"
              onClick={toggleOptions}
            >
              <BsThreeDotsVertical size={20} />
            </div>

            {showOptions && (
              <div className="absolute right-0 text-white rounded-lg shadow-lg top-20 bg-cardDark z-200">
                <button
                  className="flex items-center w-full gap-2 px-4 py-4 text-left rounded-lg hover:bg-hover"
                  onClick={handleEdit}
                >
                  <FaEdit size={20} />
                  <p>Edit Note</p>
                </button>

                <button
                  className="flex items-center w-full gap-2 px-4 py-3 text-left rounded-lg hover:bg-hover relative"
                  onClick={handleCopyModal}
                >
                  <IoCopyOutline size={20} />
                  <p>Copy Note</p>
                </button>

                {showCopyModal && (
                  <div
                    ref={copyModalRef}
                    className="absolute top-7 right-45 py-3 w-44 bg-cardDark rounded-xl shadow-lg z-50 px-2"
                  >
                    <button
                      className="w-full px-4 py-2 text-left hover:bg-hover rounded-md mb-2"
                      onClick={() => {
                        navigator.clipboard.writeText(summary);
                        notifyCopyClipBoard("Summary copied to clipboard!");
                        setShowCopyModal(false);
                        setShowOptions(false);
                      }}
                    >
                      <h5 className="font-medium">Copy Summary</h5>
                    </button>

                    <button
                      className="w-full px-4 py-2 text-left  hover:bg-hover rounded-md"
                      onClick={() => {
                        navigator.clipboard.writeText(content);
                        notifyCopyClipBoard("Transcript copied to clipboard!");
                        setShowCopyModal(false);
                        setShowOptions(false);
                      }}
                    >
                      <h5 className="font-medium">Copy Transcript</h5>
                    </button>
                  </div>
                )}

                <button className="flex items-center w-full gap-2 px-4 py-3 text-left rounded-lg hover:bg-hover">
                  <CiExport size={20} />
                  <p>Export Note</p>
                </button>

                <button
                  className="flex items-center w-full gap-2 px-4 py-4 text-left hover:bg-hover"
                  onClick={() => {
                    archivedNote(note);
                    navigate("/home");
                  }}
                >
                  <RiInboxArchiveLine size={20} />
                  <p>Archived Note</p>
                </button>

                <button
                  className="flex items-center w-full gap-2 px-4 py-3 text-left rounded-lg hover:bg-hover"
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
              <h2 className="text-[24px] font-bold">{title}</h2>

              <span className="text-textXs text-descriptionText">
                AI Generated
              </span>

              {activeTabName === "Transcript" && (
                <p className="text-[16px] mt-2">
                  {content.split("\n").map((line, index) => (
                    <span key={index}>
                      {line.replace(/\*/g, " ")}
                      <br />
                    </span>
                  ))}
                </p>
              )}

              {activeTabName === "Summary" && (
                <div className="mt-4 space-y-3 text-[16px]">
                  <ul className="pl-5 space-y-2 list-disc ">
                    {summary
                      .split(".")
                      .filter(Boolean)
                      .map((point, index) => (
                        <li key={index}>{point.trim()}.</li>
                      ))}
                  </ul>
                </div>
              )}

              {activeTabName === "Tags" && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {tags.length > 0 ? (
                    tags.map((tag, index) => (
                      <LightTooltip
                        key={index}
                        title={tag.meaning} // find the first position of space and slice from there
                        placement="bottom"
                        arrow
                      >
                        <span
                          key={index}
                          className="px-3 py-1 text-sm rounded-full btn-purple  cursor-pointer transition"
                        >
                          #{tag.tag}
                        </span>
                      </LightTooltip>
                    ))
                  ) : (
                    <p className="text-descriptionText">No tags available</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <>
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="absolute p-6 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg top-1/2 left-1/2 bg-cardDark z-100 max-[540px]:w-[80%]">
              <h3 className="font-semibold text-[26px] max-[640px]:text-center">
                Delete this note?
              </h3>
              <p className="mb-4  text-textSm text-descriptionText max-[640px]:text-center max-[640px]:text-textXs ">
                Are you sure you want to remove this note?
              </p>

              <div className="flex gap-2 items-center max-[640px]:flex-col">
                <button
                  className="px-4 py-2 w-full bg-[#fafafa] hover:opacity-80 ease-in-out duration-300 rounded-md text-black"
                  onClick={() => {
                    deleteNote(id);
                    setShowDeleteModal(false);
                    navigate("/home");
                  }}
                >
                  Delete Note
                </button>
                <button
                  className="border-2 border-border hover:bg-hover duration-200 ease-in-out px-4 py-2 rounded-md cursor-pointer w-full"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}

        {showEditModal && (
          <>
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="absolute p-6 transform -translate-x-1/2 -translate-y-1/2 bg-cardDark rounded-lg shadow-lg top-1/2 left-1/2 z-100">
              <p className="mb-4 font-bold text-textMd text-light ">
                Edit Note
              </p>
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 mb-4 border border-border rounded text-light"
                value={titleEdit}
                onChange={(e) => setTitleEdit(e.target.value)}
                required
              />
              <textarea
                placeholder="Content"
                className="w-full p-2 mb-4 border border-border rounded text-light"
                value={contentEdit}
                onChange={(e) => setContentEdit(e.target.value)}
                required
              ></textarea>
              {/* 
              <textarea
                placeholder="Summary"
                className="w-full p-2 mb-4 border border-border rounded text-light"
              ></textarea>

              <input
                type="text"
                placeholder="Tags (comma separated)"
                className="w-full p-2 mb-4 border border-border rounded text-light"
              /> */}

              <div className="flex gap-2 items-center max-[640px]:flex-col">
                <button
                  className="w-full px-4 py-2 text-black bg-[#fafafa] hover:opacity-80 ease-in-out duration-300  rounded-md cursor-pointer"
                  onClick={async () => {
                    const result = await updateNote(titleEdit, contentEdit, id);
                    if (result?.success) {
                      setShowEditModal(false);
                      setTitleEdit("");
                      setContentEdit("");
                    } else if (result?.error) {
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
                  className="  border-border border-2 hover:bg-hover duration-200 ease-in-out text-light px-4 py-2 rounded w-full cursor-pointer"
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

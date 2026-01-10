import { Header, Sidebar, Loading } from "../Components";
import { IoIosAdd, IoIosClose } from "react-icons/io";
import { MdSaveAlt } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { IoCopyOutline } from "react-icons/io5";
import { useState, useRef } from "react";
import { useAppContext } from "../../context/appContext";
import { FaMicrophone, FaArrowUp } from "react-icons/fa";
import TimeAgo from "timeago-react";
import { TbTools } from "react-icons/tb";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { notifyCopyClipBoard } from "../../toastUtils/toast";

const Ai = () => {
  const {
    prompt,
    setPrompt,
    generateNote,
    saveGeneratedNote,
    loading,
    messages,
    setMessages,
    user,
    generateNoteFromAudio,
  } = useAppContext();

  const [modal, setModal] = useState(false);
  const [saveNoteTitle, setSaveNoteTitle] = useState("");
  const [toolModal, setToolModal] = useState(false);
  const [recordModal, setRecordModal] = useState(false);
  const lastMessageIndex = messages.length - 1;
  console.log(lastMessageIndex);

  // Recordings
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  console.log("Audio Blob:", audioBlob);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);

        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        chunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const clearRecording = () => {
    setAudioUrl(null);
    setAudioBlob(null);
    setIsRecording(false);
    chunksRef.current = [];
  };

  const addRecordingToPrompt = () => {
    generateNoteFromAudio(audioBlob);

    setRecordModal(false);
    clearRecording();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateNote(prompt);
    setPrompt("");
  };

  const handleSaveNote = () => {
    const conversation = messages.map((msg) => msg.content).join("\n");

    saveGeneratedNote(saveNoteTitle, conversation);
    setModal(false);
  };

  console.log(messages.filter((m) => m.role === "AI").map((m) => m.content));

  return (
    <>
      <Header />
      <div className="flex justify-between h-screen px-4 mx-auto max-w-7xl gap-14 ">
        <Sidebar />
        <section className="flex-col flex-1 px-4 py-2 pb-8 mt-4 overflow-hidden border flexCenter md:pb-32 text-light border-cardDark rounded-2xl">
          <div
            className={`flex-1  overflow-y-auto  px-4 py-4 space-y-6  flex-col w-full ${
              messages.length > 0 ? "block" : "flexCenter"
            }`}
          >
            <div
              className={`flex flex-col  mb-4 ${
                messages.length > 0
                  ? "items-start justify-normal"
                  : "items-center justify-center"
              }`}
            >
              {messages.length > 0 ? (
                <>
                  {messages.map((msg, idx) => (
                    <div className="flex flex-col w-full" key={idx}>
                      {msg.role === "user" ? (
                        <div className="flex items-center justify-end my-4 max-[530px]:justify-start">
                          <div className="bg-secondary text-black flex flex-col items-center gap-2 px-3 py-2 rounded-lg w-fit max-w-[70%]">
                            <div className="flex items-center gap-4">
                              <p>{msg.title}</p>

                              {user?.imageUrl && (
                                <img
                                  src={user.imageUrl}
                                  alt="user-profile"
                                  className="w-6 h-6 rounded-full"
                                />
                              )}
                            </div>
                            <small className="self-end text-xs text-gray-600">
                              <TimeAgo datetime={msg.timeStamp} />
                            </small>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4 px-3 py-2 mt-2 rounded-lg bg-cardDark w-fit">
                          <div className="flex flex-col items-center gap-4">
                            <p className="w-full">
                              {msg.content.split("\n").map((line, i) => (
                                <span key={i} className="block">
                                  {line.replace(/\*/g, "")}
                                </span>
                              ))}
                            </p>

                            {msg.content &&
                              msg.content !== "Recognizing..." && (
                                <button
                                  className="self-end cursor-pointer border-2 border-border p-1 rounded-lg hover:bg-hover"
                                  onClick={() => {
                                    navigator.clipboard.writeText(msg.content);
                                    notifyCopyClipBoard("Copied to clipboard!");
                                  }}
                                >
                                  <IoCopyOutline />
                                </button>
                              )}
                          </div>

                          <small className="self-end text-xs text-gray-600">
                            <TimeAgo datetime={msg.timeStamp} />
                          </small>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <DotLottieReact
                    src="https://lottie.host/a54f7722-fe4c-48d7-8799-daa31a7fd965/OVp7iAeiie.lottie"
                    style={{ width: 250, height: 250 }}
                    autoplay
                    loop
                  />
                  <span className="text-textMd font-semibold mt-4 max-[821px]:text-center max-[500px]:text-[25px]">
                    Welcome to MindBot.
                  </span>
                  <span className="font-normal text-center text-textMd max-[500px]:text-textSm ">
                    What can I help you with today?
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Prompt Input Section */}

          <div className="sticky w-full p-4 ">
            <div className="relative w-full ">
              <DotLottieReact
                src="https://lottie.host/227e01af-82cf-495b-a568-8366f7a510a6/FDoQpLmdbI.lottie"
                loop
                autoplay
                className="absolute left-[-50px] top-1/3  -translate-y-1/2 w-40 h-30 pointer-events-none animate-pulse"
              />
              <textarea
                name="prompt"
                placeholder="Ask anything"
                value={prompt}
                rows={2}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-4 pl-14 bg-cardDark rounded-2xl outline-none resize-none text-textSm text-light placeholder:text-textLight placeholder:text-textSm max-[530px]:placeholder:text-textXs max-[530px]:text-textXs "
              ></textarea>

              <Tooltip title="Save Note" placement="bottom" arrow>
                <button
                  className={`flexCenter text-black absolute bottom-4 right-12 px-2 py-2 bg-white rounded-full duration-300 ease-in-out mr-2 ${
                    messages.filter((m) => m.role === "AI").length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  onClick={() => setModal(true)}
                  disabled={
                    messages.filter((m) => m.role === "AI").length === 0
                  }
                >
                  <MdSaveAlt className="text-xl max-[530px]:text-sm text-center flexCenter  " />
                </button>
              </Tooltip>
              <Tooltip title="Tools" placement="bottom" arrow>
                <button
                  className="absolute px-2 py-2 mr-2 text-black duration-300 ease-in-out bg-white rounded-full cursor-pointer flexCenter bottom-4 right-24"
                  onClick={() => setToolModal(!toolModal)}
                >
                  <TbTools className="text-xl max-[530px]:text-sm text-center flexCenter  " />
                </button>
              </Tooltip>

              {/* Modal for Tools */}

              {toolModal && (
                <div className="absolute bottom-16 right-32 bg-cardDark p-2 rounded-lg shadow-lg z-10 flex flex-col gap-3 max-[530px]:right-28 max-[530px]:bottom-14">
                  <div
                    className="px-2 py-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:bg-hover"
                    onClick={() => {
                      setMessages([]);
                      setToolModal(false);
                    }}
                  >
                    <div className="flex gap-2">
                      <IoIosAdd className="text-xl max-[530px]:text-sm text-center " />
                      <span>Clear Chat</span>
                    </div>
                  </div>

                  <div
                    className="px-2 py-2 duration-200 ease-in-out rounded-lg cursor-pointer hover:bg-hover"
                    onClick={() => {
                      setRecordModal(!recordModal);
                      setToolModal(false);
                    }}
                  >
                    <div className="flex gap-2">
                      <FaMicrophone className="text-xl max-[530px]:text-sm " />
                      <span>Record Audio</span>
                    </div>
                  </div>
                </div>
              )}
              <button
                className={`flexCenter text-black  absolute bottom-4 right-2 px-2 py-2 bg-white rounded-full ${
                  prompt.trim() === ""
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                } `}
                onClick={handleSubmit}
                disabled={prompt.trim() === ""}
              >
                <FaArrowUp className="text-xl max-[530px]:text-sm text-center flexCenter  " />
              </button>
            </div>
          </div>

          {loading && (
            // <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flexCenter z-50">
            <Loading message="Generating summary and tags..." />
            // </div>
          )}

          {modal && (
            <>
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div className="absolute p-4 transform -translate-x-1/2 -translate-y-1/2 bg-cardDark rounded-lg shadow-lg top-1/2 left-1/2 z-100 max-[480px]:w-[80%]  ">
                <h2 className="mb-4 text-textSm text-light ">Save New Note</h2>
                <input
                  type="text"
                  placeholder="Please Enter a title for this note"
                  className="w-full p-2 mb-4 border border-border rounded text-light"
                  required
                  value={saveNoteTitle}
                  onChange={(e) => setSaveNoteTitle(e.target.value)}
                />

                <button
                  className={`px-4 py-2 text-black bg-[#fafafa]  rounded cursor-pointer max-[480px]:w-full max-[480px]:block `}
                  onClick={handleSaveNote}
                >
                  Save Note
                </button>
                <button
                  onClick={() => setModal(false)}
                  className="ml-2 border-2 border-border hover:bg-hover ease-in-out duration-200 text-light px-4 py-2 rounded cursor-pointer max-w-md max-[480px]:w-full max-[480px]:mt-2 max-[480px]:ml-0"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
          {recordModal && (
            <>
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div className="absolute p-6 transform -translate-x-1/2 -translate-y-1/2 bg-cardDark rounded-lg shadow-lg top-1/2 left-1/2 z-100 max-[480px]:w-[80%]">
                <div className="gap-6 flexBetween">
                  <h3 className="font-semibold text-[26px] max-[486px]:text-textSm">
                    Record New Audio
                  </h3>
                  <IoIosClose
                    className="cursor-pointer text-textMd"
                    onClick={() => setRecordModal(false)}
                  />
                </div>

                <div className="flex-col flexCenter ">
                  <div className="bg-gray-200 h-16 w-[64px] rounded-[100%] flexCenter mt-4">
                    <div
                      className={`bg-red-700 h-8 w-[32px] rounded-[100%] ${
                        isRecording
                          ? "animate-pulse shadow-[0_0_20px_5px_rgba(239,68,68,0.7)]"
                          : " "
                      }`}
                    ></div>
                  </div>
                </div>

                {audioUrl && (
                  <audio
                    controls
                    src={audioUrl}
                    className="w-full mt-4"
                  ></audio>
                )}

                <div className="flex items-center gap-4 mt-6">
                  {audioBlob ? (
                    <>
                      <button
                        onClick={clearRecording}
                        className="ml-2  border-2 border-border hover:bg-hover  text-light px-4 py-2 rounded-md cursor-pointer max-w-md max-[480px]:w-full max-[480px]:mt-2 max-[480px]:ml-0"
                      >
                        Re-record
                      </button>

                      <button
                        className="ml-2  bg-[#fafafa]   text-black px-4 py-2 rounded-md cursor-pointer max-w-md max-[480px]:w-full max-[480px]:mt-2 max-[480px]:ml-0"
                        onClick={addRecordingToPrompt}
                      >
                        Add To prompt
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className="border-2 border-border text-light px-4 py-2 rounded-md hover:bg-cardDark ease-in-out duration-300 cursor-pointer w-full max-[480px]:mt-2 "
                    >
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default Ai;

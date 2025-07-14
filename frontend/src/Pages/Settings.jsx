import { Sidebar, Header } from "../Components";
import { IoIosLogOut } from "react-icons/io";
import { FaTrash } from "react-icons/fa6";
import { useAppContext } from "../../context/appContext";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { notifySuccess } from "./../../toastUtils/toast";
const Settings = () => {
  const { user, deleteUserAccount } = useAppContext();
  const { signOut } = useAuth();
  const [ShowSignOutModal, setShowSignOutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    notifySuccess("Sign out successfully");
  };

  const handleDeleteAccount = async () => {
    await deleteUserAccount();
    await signOut();
    navigate("/");
  };

  return (
    <>
      <Header />
      <div className="flex justify-between px-4 mx-auto max-w-7xl gap-14">
        <Sidebar />
        <section className="flex flex-col flex-1 px-4 py-2 mt-4 border text-light border-cardDark rounded-2xl">
          <span className="text-[22px] font-semibold mt-4">General</span>

          <button className="relative flex flex-col flex-wrap gap-3 mt-4">
            <div
              className="cardSettings flexBetween"
              onClick={() => setShowSignOutModal(true)}
            >
              <div className="flex items-center w-full gap-4">
                <div className="w-10 h-10 rounded-full flexCenter bg-cardDark">
                  <IoIosLogOut className="w-6 h-6 " />
                </div>
                <div className="flex flex-col items-baseline">
                  <p>Sign Out</p>
                  <span className="text-neutral-500 text-[12px]">
                    {user && user.emailAddresses[0].emailAddress}
                  </span>
                </div>
              </div>
            </div>

            <div
              className="cardSettings flexBetween"
              onClick={() => setShowDeleteModal(true)}
            >
              <div className="flex items-center w-full gap-4">
                <div className="w-10 h-10 rounded-full flexCenter bg-cardDark">
                  <FaTrash className="w-6 h-6 " color="red" />
                </div>
                <div className="flex flex-col items-baseline ">
                  <p className="text-red-600">Delete Account</p>
                </div>
              </div>
            </div>
          </button>
          {ShowSignOutModal && (
            <>
              <div className="fixed inset-0 bg-black opacity-50 "></div>
              <div className=" flex flex-col gap-3 absolute p-4 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg top-1/2 left-1/2 z-100 max-[480px]:w-[80%]">
                <p className="max-[600px]:text-center">
                  Are you sure you want to sign out?
                </p>
                <button
                  className="px-4 py-2 w-full bg-secondary hover:opacity-80 ease-in-out duration-300 rounded-xl"
                  onClick={handleLogout}
                >
                  Yes
                </button>
                <button
                  className="px-4 py-2 w-full bg-red-500 hover:bg-red-700 ease-in-out duration-300 rounded-xl "
                  onClick={() => setShowSignOutModal(false)}
                >
                  No
                </button>
              </div>
            </>
          )}
          {showDeleteModal && (
            <>
              <div className="fixed inset-0 bg-black opacity-50 "></div>
              <div className=" flex flex-col gap-3 absolute p-4 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg top-1/2 left-1/2 z-100 max-[480px]:w-[80%]">
                <p className="max-[600px]:text-center">
                  Are you sure you want to delete your account?
                </p>
                <button
                  className="px-4 py-2 w-full bg-secondary hover:opacity-80 ease-in-out duration-300 rounded-xl"
                  onClick={handleDeleteAccount}
                >
                  Yes
                </button>
                <button
                  className="px-4 py-2 w-full bg-red-500 hover:bg-red-700 ease-in-out duration-300 rounded-xl "
                  onClick={() => setShowDeleteModal(false)}
                >
                  No
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default Settings;

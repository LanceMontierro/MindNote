import { Sidebar, Header } from "../Components";
import { IoIosLogOut } from "react-icons/io";
import { FaTrash } from "react-icons/fa6";
import { useAppContext } from "../../context/appContext";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
const Settings = () => {
  const { user } = useAppContext();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
  return (
    <>
      <Header />
      <div className="flex justify-between px-4 mx-auto max-w-7xl gap-14">
        <Sidebar />
        <section className="flex flex-col flex-1 px-4 py-2 mt-4 border text-light border-cardDark rounded-2xl">
          <span className="text-[22px] font-bold mt-4">General</span>

          <button className="relative flex flex-col flex-wrap gap-3 mt-4">
            <div className="cardSettings flexBetween" onClick={handleLogout}>
              <div className="flex items-center w-full gap-4">
                <div className="w-10 h-10 rounded-full flexCenter bg-cardDark">
                  <IoIosLogOut className="w-6 h-6 " />
                </div>
                <div className="flex flex-col items-baseline ">
                  <p>Sign Out</p>
                  <span className="text-neutral-500 text-[12px]">
                    {user.emailAddresses[0].emailAddress}
                  </span>
                </div>
              </div>
            </div>

            <div className="cardSettings flexBetween">
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
        </section>
      </div>
    </>
  );
};

export default Settings;

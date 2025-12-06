import { Typewriter } from "react-simple-typewriter";
import { FaArrowRightLong } from "react-icons/fa6";
import { LaptopSize } from "../assets";
import { useAppContext } from "../../context/appContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { notifySuccess } from "../../toastUtils/toast";
const Hero = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const saveUser = async () => {
      try {
        if (user) {
          const userEmail = user.emailAddresses[0].emailAddress;
          const userName = user.fullName;
          const userId = user.id;

          const response = await axios.post(`${API_URL}/users/save-user`, {
            email: userEmail,
            userName: userName,
            userId: userId,
          });
          if (response.status === 200) {
            notifySuccess(
              `${response.data.message}  ${response.data.newUser.userName}`
            );
          } else if (response.status === 201) {
            notifySuccess(
              `${response.data.message}  ${response.data.existingUser.userName}`
            );
          }
          navigate("/home");
        }
      } catch (error) {
        console.error(error);
      }
    };
    saveUser();
  }, [user, navigate]);

  return (
    <section className="relative w-full overflow-hidden pt-12 pb-10 ">
      <main className="flexCenter flex-col px-5 text-center mb-0  ">
        <h1 className="md:text-textLg text-textMd max-[768px]:w-full w-1/2 font-normal">
          Simple Note Taking app, Take Notes. Stay Focused.
        </h1>
        <p className="text-gray-400 md:text-textSm mt-4 text-[16px]">
          A calm space to write and organize your ideas — effortlessly.
        </p>
        <button className="px-5 py-3 mt-5 font-medium text-white duration-300 rounded-3xl cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-[15px] hover:opacity-75 ">
          <div className="flex items-center">
            <span>Get started for free</span>
            <FaArrowRightLong className="ml-2 " />
          </div>
        </button>
        <div className="md:mt-[-40px] mt-0">
          <img
            src={LaptopSize}
            alt="Laptop screen"
            className="max-w-full w-[800px]"
          />
        </div>
      </main>
    </section>
  );
};

export default Hero;

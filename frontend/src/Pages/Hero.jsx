import { Typewriter } from "react-simple-typewriter";
import { FaArrowRightLong } from "react-icons/fa6";
import { HomeBg } from "../assets";
import { useAppContext } from "../../context/appContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
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
            console.log(response.data.message + res.data.newUser.userName);
          } else if (response.status === 201) {
            console.log(
              response.data.message + response.data.existingUser.userName
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
    <section
      className="flex items-center justify-center h-[90vh] px-4 max-[1025px]:bg-cover bg-contain max-[470px]:bg-left max-[1023px]:bg-center  lg:bg-right"
      style={{
        backgroundImage: `url(${HomeBg})`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="items-center text-center">
        <h1 className="txtGradient max-[768px]:text-textXl max-[520px]:text-textLg">
          Capture Ideas.
        </h1>
        <h2 className="text-light max-[520px]:text-textMd">
          Ignite Creativity.
        </h2>

        <h4 className="my-2 font-medium text-secondary">
          <Typewriter
            words={["Write Freely.", "Think Clearly.", "Create Seamlessly."]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </h4>
        <button className="px-4 py-3 mt-4 font-medium text-white duration-300 rounded-md cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-textXsm hover:opacity-75">
          <div className="flex items-center">
            <span>Get Started</span>
            <FaArrowRightLong className="ml-2 " />
          </div>
        </button>
      </div>
    </section>
  );
};

export default Hero;

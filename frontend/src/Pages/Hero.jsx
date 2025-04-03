import { Typewriter } from "react-simple-typewriter";
import { FaArrowRightLong } from "react-icons/fa6";
import { HomeBg } from "../assets";
import { useAppContext } from "../../context/appContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Hero = () => {
  const { isSignedIn } = useAppContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/home");
    }
  }, [isSignedIn, navigate]);

  return (
    <section
      className="flex items-center justify-center h-[90vh] px-4 max-[1025px]:bg-cover bg-contain max-[470px]:bg-left max-[1023px]:bg-center  lg:bg-right"
      style={{
        backgroundImage: `url(${HomeBg})`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="text-center items-center">
        <h1 className="txtGradient max-[768px]:text-textXl max-[520px]:text-textLg">
          Capture Ideas.
        </h1>
        <h2 className="text-gray-200 max-[520px]:text-textMd">
          Ignite Creativity.
        </h2>

        <h4 className="text-sky-400 my-2 font-medium">
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
        <button className="bg-gradient-to-r from-blue-500 to-purple-500 py-3 px-4 rounded-md text-white text-textXsm cursor-pointer font-medium hover:opacity-75 duration-300 mt-4">
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

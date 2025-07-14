import { useAppContext } from "../../context/appContext";
import { Logo } from "../assets";
import { CiMenuFries } from "react-icons/ci";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { navs } from "../../const";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
const Header = () => {
  const { user, active, setActive } = useAppContext();
  const [openNavbar, setOpenNavbar] = useState(false);
  const [openUserDetails, setOpenUserDetails] = useState(false);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setOpenNavbar((prev) => !prev);
  };

  const toggleUserDetails = () => {
    setOpenUserDetails((prev) => !prev);
  };

  useEffect(() => {
    document.body.style.overflow = openNavbar ? "hidden" : "";
  }, [openNavbar]);

  const handleActive = (name) => {
    setActive(name);
    setOpenNavbar(false);
    document.body.style.overflow = "";
    navigate(`/${name.toLowerCase()}`);
  };

  return (
    <header>
      <div className="px-4 py-2 mx-auto flexBetween max-w-7xl ">
        <div className="flex items-center">
          <img src={Logo} alt="MindNote Logo" className="w-14 h-14 " />
          <span className="txtGradient font-black text-[20px] max-[468px]:text-textSm font-montserrat">
            M!ndNote
          </span>
        </div>

        <div
          className="block p-2 border rounded-lg cursor-pointer md:hidden border-cardDark"
          onClick={toggleNavbar}
        >
          <CiMenuFries size={18} className="text-light" />
        </div>

        <div
          className={`fixed top-0 h-full z-10 flex flex-col items-center gap-3 px-4 py-2 bg-white md:hidden w-full transition-all ease-in-out duration-500 
               ${openNavbar ? "right-0 " : "right-[-100%]"} `}
        >
          <div className="w-full flex justify-end">
            <div
              className="block p-2 border rounded-lg cursor-pointer md:hidden border-cardDark"
              onClick={() => setOpenNavbar(false)}
            >
              <IoMdClose size={20} />
            </div>
          </div>
          <div className="flex flex-col items-center w-full mt-2 gap-3">
            {navs.map((nav, i) => {
              const Icon = nav.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleActive(nav.name)}
                  className={`flex items-center py-3 px-2 gap-2 rounded-2xl text-light w-full justify-center  ${
                    active === nav.name ? "bg-cardDark border-[#fff] " : ""
                  }`}
                >
                  <Icon className="text-[22px]" />
                  <span className=" text-textSm font-medium">{nav.name}</span>
                </button>
              );
            })}

            <a
              className={
                "flex items-center py-3 px-2 gap-2 rounded-2xl text-light w-full justify-center  border-[#fff] "
              }
              href="https://github.com/LanceMontierro"
              target="_blank"
            >
              <FaGithub className="text-[22px]" />
              <span className=" text-textSm font-medium">Github</span>
            </a>

            <a
              className={
                "flex items-center py-3 px-2 gap-2 rounded-2xl text-light w-full justify-center  border-[#fff] "
              }
              href="https://www.instagram.com/lncemntierro/"
              target="_blank"
            >
              <FaInstagram className="text-[22px]" />
              <span className=" text-textSm font-medium">Instagram</span>
            </a>
          </div>
        </div>

        <div
          className="items-center hidden gap-3 px-4 py-2 rounded-2xl bg-cardDark hover:bg-primary md:flex"
          onClick={toggleUserDetails}
        >
          {user && user.imageUrl ? (
            <img src={user.imageUrl} alt="" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="bg-gray-200 rounded-full w-28 h-28" />
          )}
          {user && user.fullName ? (
            <p className="text-light ">{user.firstName}</p>
          ) : (
            <p className="text-light ">Guest</p>
          )}
          {openUserDetails && (
            <div className="absolute top-16 right-[3%] bg-white shadow-lg rounded-lg z-[100] ">
              <div className="p-4">
                <p className="font-semibold txtGradient">User Details</p>
                <p className="font-semibold">
                  Email:{" "}
                  <span className="font-medium ">
                    {user.emailAddresses[0].emailAddress}
                  </span>{" "}
                </p>
                <p className="font-semibold">
                  Full Name:{" "}
                  <span className="font-medium">{user.fullName}</span>{" "}
                </p>
                <p className="font-semibold">
                  Id: <span className="font-medium">{user.id}</span>
                </p>

                <p className="font-semibold">
                  Account Created:{" "}
                  <span className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

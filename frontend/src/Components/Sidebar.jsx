import { useAppContext } from "../../context/appContext";
import { navs } from "../../const";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
const Sidebar = () => {
  const { setActive, active } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleActive = (name) => {
    setActive(name);
    navigate(`/${name.toLowerCase()}`);
  };

  useEffect(() => {
    if (location.pathname === "/archived") {
      setActive(null);
    }
  }, [location.pathname, setActive]);
  return (
    <aside className="hidden py-2 mt-4 text-light w-46 md:block">
      <div className="flex flex-col gap-4">
        {navs.map((nav, i) => {
          const Icon = nav.icon;
          return (
            <button
              key={i}
              onClick={() => handleActive(nav.name)}
              className={`flex items-center py-3 px-2 gap-2 rounded-2xl text-light  ${
                active === nav.name ? "bg-cardDark border-[#fff] " : ""
              }`}
            >
              <Icon className="text-[22px]" />
              <span className=" text-[16px] font-medium">{nav.name}</span>
            </button>
          );
        })}
      </div>

      <div className="gap-2 px-2 py-3 mt-6  bg-cardDark rounded-2xl text-light">
        <h4 className="font-bold text-center txtGradient font-montserrat">
          Follow me on
        </h4>
        <div className="flex flex-col items-center">
          <a
            href="https://github.com/LanceMontierro"
            target="_blank"
            className="flex items-center gap-2 px-2 py-3 rounded-2xl"
          >
            <FaGithub className="text-textSm" />
            <p>Github</p>
          </a>

          <a
            href="https://www.instagram.com/lncemntierro/"
            target="_blank"
            className="flex items-center gap-2 px-2 py-3 rounded-2xl"
          >
            <FaInstagram className="text-textSm" />
            <p>Instagram</p>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

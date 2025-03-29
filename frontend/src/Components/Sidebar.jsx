import { useAppContext } from "../../context/appContext";
import { navs } from "../../const";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
  const { setActive, active } = useAppContext();
  const navigate = useNavigate();

  const handleActive = (name) => {
    setActive(name);
    navigate(`/${name.toLowerCase()}`);
  };
  return (
    <aside className="dark:text-light text-black py-2 mt-4 w-46 md:block hidden ">
      <div className="flex flex-col gap-4">
        {navs.map((nav, i) => {
          const Icon = nav.icon;
          return (
            <button
              key={i}
              onClick={() => handleActive(nav.name)}
              className={`flex items-center py-3 px-2 gap-2 rounded-2xl  ${
                active === nav.name
                  ? "dark:bg-cardDark bg-[#dedede] border-[#fff] "
                  : ""
              }`}
            >
              <Icon className="text-[22px]" />
              <span className=" text-[16px] font-medium font-AudioWide">
                {nav.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="border border-cardDark py-3 px-2 gap-2 rounded-2xl mt-6">
        <h4 className="text-center font-bold txtGradient">Follow me on</h4>
        <div className="flex flex-col items-center">
          <a
            href="https://github.com/LanceMontierro"
            target="_blank"
            className="flex items-center py-3 px-2 gap-2 rounded-2xl"
          >
            <FaGithub className="text-textSm" />
            <p>Github</p>
          </a>

          <a
            href="https://www.instagram.com/lncemntierro/"
            target="_blank"
            className="flex items-center py-3 px-2 gap-2 rounded-2xl"
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

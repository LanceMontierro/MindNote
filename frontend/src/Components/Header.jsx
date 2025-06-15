import { useAppContext } from "../../context/appContext";
import { Logo } from "../assets";
import { CiMenuFries } from "react-icons/ci";
const Header = () => {
  const { user } = useAppContext();
  return (
    <header>
      <div className="px-4 py-2 mx-auto flexBetween max-w-7xl ">
        <div className="flex items-center">
          <img src={Logo} alt="MindNote Logo" className="w-14 h-14 " />
          <span className="txtGradient font-AudioWide font-bold text-[20px] max-[468px]:text-textSm">
            MindNote
          </span>
        </div>

        <div className="block p-2 border rounded-lg cursor-pointer md:hidden border-cardDark">
          <CiMenuFries size={18} className="text-light" />
        </div>
        <div className="items-center hidden gap-3 px-4 py-2 rounded-2xl bg-cardDark hover:bg-primary md:flex">
          {user && user.imageUrl ? (
            <img src={user.imageUrl} alt="" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="bg-gray-200 rounded-full w-28 h-28" />
          )}
          {user && user.fullName ? (
            <p className="text-light ">{user.fullName}</p>
          ) : (
            <p className="text-light ">Guest</p>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

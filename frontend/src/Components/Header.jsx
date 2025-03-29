import { useAppContext } from "../../context/appContext";
import { Logo } from "../assets";
import { CiMenuFries } from "react-icons/ci";
const Header = () => {
  const { user } = useAppContext();
  return (
    <header>
      <div className="flexBetween max-w-7xl mx-auto py-2 px-4 border-b border-gray-700">
        <div className="flex items-center">
          <img src={Logo} alt="MindNote Logo" className="w-14 h-14 " />
          <span className="txtGradient font-AudioWide font-bold text-[20px] max-[468px]:text-textSm">
            MindNote
          </span>
        </div>

        <div className="block md:hidden border border-cardDark p-2 rounded-lg cursor-pointer">
          <CiMenuFries size={18} className="text-white " />
        </div>
        <div className="items-center gap-3 md:flex hidden">
          {user && user.imageUrl ? (
            <img src={user.imageUrl} alt="" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-200" />
          )}
          {user && user.fullName ? (
            <p className="dark:text-light text-darked">{user.fullName}</p>
          ) : (
            <p className="dark:text-light text-darked">Guest</p>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

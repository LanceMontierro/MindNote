import { Logo } from "../assets";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
const Navbar = () => {
  return (
    <>
      <div className="w-full ">
        <nav className="px-4 py-2 mx-auto flexBetween max-w-7xl">
          <div className="flex items-center">
            <img src={Logo} alt="MindNote Logo" className="w-14 h-14 " />
            <span className="txtGradient font-bold text-[20px] max-[468px]:text-textSm">
              MindNote
            </span>
          </div>
          <div className="flex items-center gap-3">
            <SignInButton>
              <button className="px-3 py-2 font-medium duration-300 border rounded-md cursor-pointer border-cardDark text-light text-textXs hover:opacity-75 ">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-3 py-2 font-medium duration-300 border rounded-md cursor-pointer border-cardDark text-light text-textXs hover:opacity-75 ">
                Sign up
              </button>
            </SignUpButton>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;

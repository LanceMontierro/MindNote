import { Logo } from "../assets";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
const Navbar = () => {
  return (
    <>
      <div className="w-full border-b border-gray-700 ">
        <nav className="flexBetween max-w-7xl mx-auto py-2 px-4">
          <div className="flex items-center">
            <img src={Logo} alt="MindNote Logo" className="w-14 h-14 " />
            <span className="txtGradient font-AudioWide font-bold text-[20px] max-[468px]:text-textSm">
              MindNote
            </span>
          </div>
          <div className="flex items-center gap-3">
            <SignInButton>
              <button className="py-2 px-3 rounded-md text-white text-textXs cursor-pointer font-medium hover:opacity-75 duration-300   ">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="py-2 px-3 rounded-md text-white text-textXs cursor-pointer font-medium hover:opacity-75 duration-300  ">
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

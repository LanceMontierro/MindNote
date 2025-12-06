import { Chicken } from "../assets";

const Loading = () => {
  return (
    <div className="flexCenter  flex-col gap-4 w-full">
      <img src={Chicken} className="animate-bounce w-32 h-32" />
      <p className="text-textSm">Loading....</p>
    </div>
  );
};

export default Loading;

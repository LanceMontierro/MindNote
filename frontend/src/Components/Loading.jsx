const Loading = ({ className = "w-12 h-12", message = "Loading..." }) => {
  return (
    <div className="flexCenter flex-col gap-3 w-full h-full absolute top-0 left-0   bg-opacity-50 ">
      <div
        role="status"
        className={`rounded-full border-4 border-[#89c2fe] border-t-transparent animate-spin ${className}`}
        aria-hidden="true"
      />
      <span className="text-xs text-[#a0a0a0]">{message}</span>
      <span className="sr-only">{message}</span>
    </div>
  );
};

export default Loading;

import { Sidebar, Header } from "../Components";
import Home from "./Home";
import { useAppContext } from "../../context/appContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { isSignedIn } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  if (isSignedIn) {
    return (
      <>
        <Header />
        <div className="flex justify-between px-4 mx-auto max-w-7xl gap-14">
          <Sidebar />
          <Home />
        </div>
      </>
    );
  }

  return <h1>Loading...</h1>;
};

export default Dashboard;

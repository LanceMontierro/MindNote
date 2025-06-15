import { Sidebar, Header } from "../Components";
import Home from "./Home";
import { useAppContext } from "../../context/appContext";
import axios from "axios";
import { useEffect } from "react";

const Dashboard = () => {
  const { user } = useAppContext();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const saveUser = async () => {
      try {
        if (user) {
          const userEmail = user.emailAddresses[0].emailAddress;
          const userName = user.fullName;
          const userId = user.id;

          const response = await axios.post(`${API_URL}/users/save-user`, {
            email: userEmail,
            userName: userName,
            userId: userId,
          });
          if (response.status === 200 || response.status === 201) {
            console.log(response.data.message);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    saveUser();
  }, [user]);

  return (
    <>
      <Header />
      <div className="flex justify-between px-4 mx-auto max-w-7xl gap-14">
        <Sidebar />
        <Home />
      </div>
    </>
  );
};

export default Dashboard;

import { createBrowserRouter } from "react-router-dom";
import App from "./../src/App";
import Dashboard from "../src/Pages/Dashboard";
import Settings from "./../src/Pages/Settings";
import Note from "../src/Pages/Note";
import { Archived } from "../src/Pages";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <Dashboard />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/note/:id",
    element: <Note />,
  },
  {
    path: "/archived",
    element: <Archived />,
  },
]);

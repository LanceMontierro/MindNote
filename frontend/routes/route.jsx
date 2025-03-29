import { createBrowserRouter } from "react-router-dom";
import App from "./../src/App";
import Dashboard from "../src/Pages/Dashboard";
import Settings from "./../src/Pages/Settings";
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
]);

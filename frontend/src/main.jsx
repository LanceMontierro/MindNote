import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import ContextApi from "../context/appContext.jsx";
import { router } from "../routes/route.jsx";
import { RouterProvider } from "react-router-dom";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <ContextApi>
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    </ContextApi>
  </ClerkProvider>
);

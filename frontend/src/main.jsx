import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import ContextApi from "../context/appContext.jsx";

import { router } from "../routes/routes.jsx";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const root = createRoot(document.getElementById("root"));

if (!PUBLISHABLE_KEY) {
  // Show friendly UI instead of throwing so development can continue
  root.render(
    <div style={{ padding: 24, fontFamily: "Inter, system-ui, Arial" }}>
      <h1 style={{ color: "#c53030" }}>Missing environment variable</h1>
      <p>
        The environment variable <code>VITE_CLERK_PUBLISHABLE_KEY</code> is not
        set. Create a <code>.env</code> file in the frontend root and add:
      </p>
      <pre style={{ background: "#f7fafc", padding: 12 }}>
        {`VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key_here`}
      </pre>
      <p style={{ marginTop: 8 }}>After adding, restart the dev server.</p>
    </div>
  );
} else {
  root.render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ContextApi>
        <StrictMode>
          <RouterProvider router={router} />
          <ToastContainer />
        </StrictMode>
      </ContextApi>
    </ClerkProvider>
  );
}

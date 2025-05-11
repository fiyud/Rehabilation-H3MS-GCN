import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider, ExerciseProvider } from "./lib";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ExerciseProvider>
          <App />
        </ExerciseProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@radix-ui/themes/styles.css";
import "./index.css";
import App from "./App.tsx";
import { Theme } from "@radix-ui/themes";
import { BrowserRouter } from "react-router";
import {
  AuthProvider,
  ExerciseProvider,
  DeviceProvider,
  StreamProvider,
} from "./lib";
import { StartMaskLayout } from "./layouts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme appearance="dark">
      <BrowserRouter>
        <AuthProvider>
          <DeviceProvider>
            <StreamProvider>
              <ExerciseProvider>
                <StartMaskLayout>
                  <App />
                </StartMaskLayout>
              </ExerciseProvider>
            </StreamProvider>
          </DeviceProvider>
        </AuthProvider>
      </BrowserRouter>
    </Theme>
  </StrictMode>
);

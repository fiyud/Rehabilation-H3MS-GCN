import { Route, Routes } from "react-router";
import { StartMaskLayout } from "./layouts";
import { Exercises, Main, OBSViewer } from "./pages";
import { ExerciseProvider } from "./lib/ExerciseContext";

function App() {
  return (
    <ExerciseProvider>
      <StartMaskLayout>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/obs-viewer" element={<OBSViewer />} />
        </Routes>
      </StartMaskLayout>
    </ExerciseProvider>
  );
}

export default App;

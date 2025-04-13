import { Route, Routes } from "react-router";
import { StartMaskLayout } from "./layouts";
import { Exercises, Main, OBSViewer, Statistics } from "./pages";
import { ExerciseProvider } from "./lib/ExerciseContext";

function App() {
  return (
    <ExerciseProvider>
      <StartMaskLayout>
        <Routes>
          <Route caseSensitive path="/" element={<Main />} />
          <Route caseSensitive path="/exercises" element={<Exercises />} />
          <Route caseSensitive path="/obs-viewer" element={<OBSViewer />} />
          <Route caseSensitive path="/statistics" element={<Statistics />} />
        </Routes>
      </StartMaskLayout>
    </ExerciseProvider>
  );
}

export default App;

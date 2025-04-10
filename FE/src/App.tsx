import { Route, Routes } from "react-router";
import { Exercises, Main, OBSViewer } from "./pages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/exercises" element={<Exercises />} />
      <Route path="/obs-viewer" element={<OBSViewer />} />
    </Routes>
  );
}

export default App;

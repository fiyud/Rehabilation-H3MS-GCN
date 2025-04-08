import { Route, Routes } from "react-router";
import Main from "./pages/Main";
import Exercises from "./pages/Exercises";
import OBSViewer from "./pages/OBSViewer";

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

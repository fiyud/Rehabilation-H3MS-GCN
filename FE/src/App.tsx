import { Route, Routes } from "react-router";
import { NotFound, ProtectedRoute, useAuth } from "./lib";
import { Exercises, Landing, Statistics } from "./pages";
function App() {
  const { isAuthenticated, user } = useAuth();
  return (
    <Routes>
      <Route caseSensitive path="/" element={<Landing />} />
      {isAuthenticated && (
        <>
          <Route
            caseSensitive
            path="/statistics"
            element={
              <ProtectedRoute>
                <Statistics />
              </ProtectedRoute>
            }
          />
          <Route caseSensitive path="/exercises" element={<Exercises />} />
        </>
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

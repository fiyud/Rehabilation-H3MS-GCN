import { Route, Routes } from "react-router";
import { NotFound, ProtectedRoute, useAuth } from "./lib";
import { Exercises, Main, OBSViewer, Statistics } from "./pages";

function App() {
  const { isAuthenticated, user } = useAuth();
  return (
    <Routes>
      <Route caseSensitive path="/exercises" element={<Exercises />} />
      {isAuthenticated ? (
        <>
          {user?.role == "Patient" ? (
            <Route
              caseSensitive
              path="/"
              element={
                <ProtectedRoute>
                  <OBSViewer />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route
              caseSensitive
              path="/"
              element={
                <ProtectedRoute>
                  <Statistics />
                </ProtectedRoute>
              }
            />
          )}
          <Route
            caseSensitive
            path={"/statistics"} 
            element={
              <ProtectedRoute>
                <Statistics />
              </ProtectedRoute>
            }
          />
        </>
      ) : (
        <Route caseSensitive path="/" element={<Main />} />
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

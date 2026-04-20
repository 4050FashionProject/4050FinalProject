import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ExplorePage from "./pages/ExplorePage";
import ClosetPage from "./pages/ClosetPage";
import MePage from "./pages/MePage";
import { useAuth } from "./hooks/authContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        {/** Public Routes */}
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/register" element={<RegisterPage />} />

        {/** Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/explore" element={<ExplorePage />} />
          <Route exact path="/closet" element={<ClosetPage />} />
          <Route exact path="/me" element={<MePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

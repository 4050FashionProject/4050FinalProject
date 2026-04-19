import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
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
        <Route element={<ProtectedRoute isAuthenticated={isLoggedIn} />}>
          <Route exact path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

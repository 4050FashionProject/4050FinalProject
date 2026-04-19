import "../styles/LoginPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/authContext";
import { useState } from "react";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Overrides default browser reload
    try {
      await login(username, password);
      navigate("/");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <input
          placeholder="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="primary-button" type="submit">
          Log In
        </button>
        <a href="">forgot password?</a>
        <button
          className="secondary-button"
          onClick={() => navigate("/register")}
        >
          Create new account
        </button>
      </form>
    </>
  );
}

export default LoginPage;

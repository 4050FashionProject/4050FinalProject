import "../styles/RegisterPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/authContext";
import { useState } from "react";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <form action="">
        <h2>Sign Up</h2>
        <input
          placeholder="display name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <input
          placeholder="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
        <button className="primary-button">Register</button>
        <a href="/login">already have an account?</a>
        <button className="secondary-button" onClick={() => navigate("/login")}>
          Log In
        </button>
      </form>
    </>
  );
}

export default RegisterPage;

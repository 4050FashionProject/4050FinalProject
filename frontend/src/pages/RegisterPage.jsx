import "../styles/RegisterPage.css";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  return (
    <>
      <form action="">
        <h2>Sign Up</h2>
        <input placeholder="full name" type="text" />
        <input placeholder="username" type="text" />
        <input placeholder="password" type="password" />
        <button className="primary-button">Register</button>
        <a href="">already have an account?</a>
        <button className="secondary-button" onClick={() => navigate("/login")}>
          Log In
        </button>
      </form>
    </>
  );
}

export default RegisterPage;

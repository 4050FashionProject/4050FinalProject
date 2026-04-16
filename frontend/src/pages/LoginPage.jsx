import "../styles/LoginPage.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  return (
    <>
      <form action="">
        <h2>Log In</h2>
        <input placeholder="username" type="text" />
        <input placeholder="password" type="text" />
        <button className="primary-button">Log In</button>
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

import "../styles/NavBar.css";
import CreatePostModal from "./CreatePostModal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/authContext";
import MenuPopup from "./MenuPopup";

function NavBar({ visible, current }) {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  let classes = ["nav-btn", "nav-btn", "nav-btn", "nav-btn"];
  classes[current] = "nav-btn current";

  const getUser = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUsername(storedUser.username);
      setLoading(false);
    } catch (error) {
      await logout();
      navigate("/login");
    }
  }

  useEffect(() => {
    getUser();
  }, [username])

  return loading ? <>Loading</> : (
    visible && (
      <nav>
        <button className={classes[0]} onClick={() => navigate("/")}>
          Home <img className="nav-icon" src="/home.svg" alt="home" />
        </button>
        <button className={classes[1]} onClick={() => navigate("/explore")}>
          Explore <img className="nav-icon" src="/browse.svg" alt="explore" />
        </button>
        <button
          className={`nav-btn${isOpen ? " current" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          Create <img className="nav-icon" src="/create.svg" alt="create" />
        </button>
        <button className={classes[2]} onClick={() => navigate("/closet")}>
          Closet <img className="nav-icon" src="/dresser.svg" alt="closet" />
        </button>
        <button className={classes[3]} onClick={() => navigate(`/user/${username}`)}>
          Me <img className="nav-icon" src="/me.svg" alt="me" />
        </button>
        <MenuPopup />
        <CreatePostModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </nav>
    )
  );
}

export default NavBar;

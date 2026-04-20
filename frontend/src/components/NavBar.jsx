import { useNavigate } from "react-router-dom";
import "../styles/NavBar.css";
import CreatePostModal from "./CreatePostModal";
import { useState } from "react";

function NavBar({ visible, current }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  let classes = ["nav-btn", "nav-btn", "nav-btn", "nav-btn"];
  classes[current] = "nav-btn current";
  return (
    visible && (
      <nav>
        <button className={classes[0]} onClick={() => navigate("/")}>
          Home <img className="nav-icon" src="/home.svg" alt="home" />
        </button>
        <button className={classes[1]} onClick={() => navigate("/explore")}>
          Explore <img className="nav-icon" src="/browse.svg" alt="explore" />
        </button>
        <button
          className={`nav-btn${open ? " current" : ""}`}
          onClick={() => setOpen(!open)}
        >
          Create <img className="nav-icon" src="/create.svg" alt="create" />
          <CreatePostModal isOpen={open} onClose={() => setOpen(false)} />
        </button>
        <button className={classes[2]} onClick={() => navigate("/closet")}>
          Closet <img className="nav-icon" src="/dresser.svg" alt="closet" />
        </button>
        <button className={classes[3]} onClick={() => navigate("/me")}>
          Me <img className="nav-icon" src="/me.svg" alt="me" />
        </button>
        <button className="more">
          <img src="/menu.svg" alt="more" />
        </button>
      </nav>
    )
  );
}

export default NavBar;

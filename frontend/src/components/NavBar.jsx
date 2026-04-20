import "../styles/NavBar.css";

function NavBar({ visible, current }) {
  let classes = ["nav-btn", "nav-btn", "nav-btn", "nav-btn"];
  classes[current] = "nav-btn current";
  return (
    visible && (
      <nav>
        <button className={classes[0]}>
          Explore <img className="nav-icon" src="/browse.svg" alt="explore" />
        </button>
        <button className={classes[1]}>
          Create <img className="nav-icon" src="/create.svg" alt="create" />
        </button>
        <button className={classes[2]}>
          Closet <img className="nav-icon" src="/dresser.svg" alt="closet" />
        </button>
        <button className={classes[3]}>
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

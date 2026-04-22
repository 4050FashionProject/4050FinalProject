import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import MenuPopup from "../components/MenuPopup";

function HomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const displayName = user.display_name || "User";

  return (
    <div className="home-page">
      <div className="home-page-header">
        <div>
          <p className="home-page-kicker">Fashion social made simple</p>
          <h1>Welcome back, {displayName}</h1>
          <p className="home-page-subtitle">
            Share your outfits, save your favorite looks, and keep your closet
            inspo all in one place.
          </p>
        </div>
      </div>

      <div className="home-page-hero-card">
        <h2>Your style starts here</h2>
        <p>
          Post a new fit, explore fashion inspiration, and build a closet that
          actually feels like you.
        </p>
      </div>

      <div className="home-page-section-grid">
        <div className="home-page-section-card">
          <h3>Share outfits</h3>
          <p>
            Show off your look and tag the pieces that make the outfit work.
          </p>
        </div>

        <div className="home-page-section-card">
          <h3>Save inspo</h3>
          <p>
            Keep your favorite styles in your closet so you can come back to
            them anytime.
          </p>
        </div>

        <div className="home-page-section-card">
          <h3>Discover trends</h3>
          <p>
            Stay tapped in with looks from other users and find new ideas for
            your next fit.
          </p>
        </div>
      </div>

      <NavBar visible={true} current={0} />
    </div>
  );
}

export default HomePage;

import React, { useEffect, useRef, useState } from "react";
import "../styles/MenuPopup.css";
import { useAuth } from "../hooks/authContext";
import { useNavigate } from "react-router-dom";

function MenuPopup({ onGoToSettings }) {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSettingsClick = () => {
    closeMenu();
    onGoToSettings?.();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="menu-popup" ref={popupRef}>
      <button
        type="button"
        className="menu-popup-trigger more"
        onClick={toggleMenu}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <img src="/menu.svg" alt="more" />
      </button>

      {isOpen && (
        <div className="menu-popup-dropdown" role="menu">
          <button
            type="button"
            className="menu-popup-item"
            onClick={() => {
              navigate("/settings");
            }}
          >
            Settings
          </button>
          <button
            type="button"
            className="menu-popup-item logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default MenuPopup;

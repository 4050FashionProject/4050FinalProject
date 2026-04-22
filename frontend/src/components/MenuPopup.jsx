import React, { useEffect, useRef, useState } from "react";

function MenuPopup({ onLogout, onGoToSettings }) {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

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

  const handleLogoutClick = () => {
    closeMenu();
    onLogout?.();
  };

  return (
    <div className="menu-popup" ref={popupRef}>
      <button
        type="button"
        className="menu-popup-trigger"
        onClick={toggleMenu}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        ☰
      </button>

      {isOpen && (
        <div className="menu-popup-dropdown" role="menu">
          <button
            type="button"
            className="menu-popup-item"
            onClick={handleSettingsClick}
          >
            Settings
          </button>
          <button
            type="button"
            className="menu-popup-item logout"
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default MenuPopup;


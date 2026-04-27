import { useState } from "react";
import "../styles/LinkTagInput.css";

function LinkTagInput({ position, onTagAdd, onTagClear }) {
  const [inputName, setInputName] = useState("");
  const [inputLink, setInputLink] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inputName.trim() && inputLink.trim()) {
      onTagAdd?.(inputName, inputLink, position);
      setInputName("");
      setInputLink("");
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setInputName("");
    setInputLink("");
    onTagClear?.();
  }

  const style = {
    left: `${position.x * 100}%`,
    top: `${position.y * 100}%`,
  };

  return (
    <div className="link-tag-input-wrapper" style={style}>
      <div className="link-tag-form">
        <button className="link-tag-close-btn" onClick={handleClear}>
          <img src="/close.svg" alt="Close" />
        </button>
        <h3>Add Tag</h3>
        <div className="form-group">
          <label htmlFor="tag-name">Name:</label>
          <input
            id="tag-name"
            type="text"
            placeholder="Enter tag name"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label htmlFor="tag-link">Link:</label>
          <input
            id="tag-link"
            type="text"
            placeholder="Enter URL"
            value={inputLink}
            onChange={(e) => setInputLink(e.target.value)}
          />
        </div>
        <button onClick={handleSubmit} type="submit" className="form-submit-btn">
          Add Tag
        </button>
      </div>
    </div>
  );
}

export default LinkTagInput;

import { useState } from "react";
import LinkTag from "./LinkTag";
import LinkTagInput from "./LinkTagInput";
import "../styles/ImageUploader.css";

function ImageUploader({ onImageSelect, onCoordinatesChange }) {
  const [preview, setPreview] = useState();
  const [fileName, setFileName] = useState();
  const [coordinates, setCoordinates] = useState([]);
  const [inputPosition, setInputPosition] = useState(null);

  function handleChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Create a preview URL
    setPreview(URL.createObjectURL(file));
    setFileName(file.name);

    // Read file and convert to base64 for BSON storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;
      onImageSelect?.(base64String);
    };
    reader.readAsDataURL(file);
  }

  function handleClick(e) {
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setInputPosition({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  }

  function handleTagAdd(name, link, position) {
    const newCoordinates = [...coordinates, { name, link, position }];
    setCoordinates(newCoordinates);
    onCoordinatesChange?.(newCoordinates);
    setInputPosition(null);
  }

  function handleTagClear() {
    setInputPosition(null);
  }

  return (
    <div className="uploader">
      <h2>Add Image:</h2>
      <input type="file" accept="image/*" onChange={handleChange} style={{ width: "300px" }} />
      {fileName && <p style={{ fontSize: "0.9em", color: "var(--text)" }}>Selected: {fileName}</p>}
      {preview && (
        <div className="image-container">
          <img className="preview" onClick={handleClick} src={preview} alt="Uploaded preview" />
          {coordinates.map((coord, idx) => (
            <LinkTag key={idx} name={coord.name} link={coord.link} position={coord.position} />
          ))}
          {inputPosition && <LinkTagInput position={inputPosition} onTagAdd={handleTagAdd} onTagClear={handleTagClear} />}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
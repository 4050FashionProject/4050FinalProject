import { useState } from "react";

function ImageUploader({ onImageSelect }) {
  const [preview, setPreview] = useState();
  const [fileName, setFileName] = useState();

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

  return (
    <div className="uploader">
      <h2>Add Image:</h2>
      <input type="file" accept="image/*" onChange={handleChange} style={{ width: "300px" }} />
      {fileName && <p style={{ fontSize: "0.9em", color: "var(--text)" }}>Selected: {fileName}</p>}
      {preview && <img src={preview} alt="Uploaded preview" style={{ width: "300px" }} />}
    </div>
  );
}

export default ImageUploader;
import "../styles/CreatePostModal.css";
import HashTagInput from "./HashTagInput";
import { useRef, useEffect, useState, useContext } from "react";
import { BACKEND_URL } from "../config";
import { useAuth } from "../hooks/authContext";
import ImageUploader from "./ImageUploader";

function CreatePostModal({ isOpen, onClose }) {
  const [hashtags, setHashtags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageData, setImageData] = useState(null);
  const dialogRef = useRef(null);
  const captionRef = useRef(null);
  const { accessToken, user } = useAuth();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
      // Reset form when modal closes
      captionRef.current.value = "";
      setHashtags([]);
      setImageData(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !accessToken) {
      alert("You must be logged in to create a post");
      return;
    }

    const caption = captionRef.current?.value || "";

    if (!caption.trim()) {
      alert("Please enter a caption");
      return;
    }

    if (!imageData) {
      alert("Please upload an image");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/posts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          image: imageData,
          coordinates: [],
          caption: caption,
          hashtags: hashtags,
          creator: user.username,
          likes: 0,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Post created successfully!");
        captionRef.current.value = "";
        setHashtags([]);
        setImageData(null);
        onClose();
      } else {
        const error = await response.json();
        alert(`Error creating post: ${error.detail || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <dialog ref={dialogRef} onCancel={onClose} id="createPostModal">
      <h1>Create Post</h1>
      <form>
        <ImageUploader onImageSelect={setImageData} />
        <textarea ref={captionRef} name="caption" id="caption" maxLength={500} placeholder="enter your caption here"></textarea>
        <HashTagInput
          value={hashtags}
          onChange={setHashtags}
          name="hashtags"
          placeHolder="enter hashtags"
          id="hashtags"
        />
        <button className="primary-button" type="button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Posting..." : "Post"}
        </button>
        <button className="secondary-button" type="button" onClick={onClose} disabled={isLoading}>
          Cancel
        </button>
      </form>
    </dialog>
  );
}

export default CreatePostModal;

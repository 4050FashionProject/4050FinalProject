import "../styles/CreatePostModal.css";
import HashTagInput from "./HashTagInput";
import { useRef, useEffect, useState, useContext } from "react";
import { BACKEND_URL } from "../config";
import { useAuth } from "../hooks/authContext";

function CreatePostModal({ isOpen, onClose }) {
  const [hashtags, setHashtags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef(null);
  const captionRef = useRef(null);
  const { accessToken, user } = useAuth();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
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

    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/posts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23cccccc' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='24'%3EPlaceholder Image%3C/text%3E%3C/svg%3E",
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
        <img id="postimg" src="placeholder.svg" alt="Your uploaded image will appear here" />
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

import { useState } from "react";
import { BACKEND_URL } from "../config";
import { useAuth } from "../hooks/authContext";
import SaveButton from "./SaveButton";
import "../styles/PostView.css"
import { useNavigate } from "react-router-dom";
import LinkTag from "./LinkTag";

function PostView({ post: { image_id, image, coordinates = [], caption, hashtags, creator, likes }, currentUser, onPostDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const isPostOwner = currentUser?.username === creator;

  // Parse and validate base64 image data
  const getImageSrc = () => {
    if (!image) return null;

    // If it's already a data URI, use it directly
    if (typeof image === "string" && image.startsWith("data:")) {
      return image;
    }

    // If it's a base64 string without the data URI prefix, add it
    if (typeof image === "string") {
      return `data:image/jpeg;base64,${image}`;
    }

    return null;
  };

  const imageSrc = getImageSrc();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/posts/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ image_id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to delete post");
      }

      onPostDeleted?.(image_id);
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error("Error deleting post:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="post-container">
      <div className="post-top-bar">
        <h3 className="creator" onClick={() => navigate(`/user/${creator}`)}>{creator}</h3>
        {isPostOwner && (
          <button
            className="secondary-button"
            onClick={handleDelete}
            disabled={deleting}
            style={{ padding: "8px 16px" }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      {image && (
        <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
          <img
            src={imageSrc}
            alt={caption}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              marginBottom: "12px",
              maxHeight: "400px",
              objectFit: "cover",
              display: "block"
            }}
          />
          {coordinates && coordinates.map((coord, idx) => {
            const position = coord.position || { x: coord.x, y: coord.y };
            return (
              <LinkTag
                key={idx}
                name={coord.name}
                link={coord.link}
                position={position}
              />
            );
          })}
        </div>
      )}

      {caption && (
        <div>
          <p style={{ margin: "8px 0", color: "var(--text)" }}>
            {caption}
          </p>
        </div>
      )}

      {hashtags && hashtags.length > 0 && (
        <div style={{ margin: "8px 0", display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {hashtags.map((tag, index) => (
            <span key={index} style={{
              backgroundColor: "var(--contrast)",
              color: "white",
              borderRadius: "4px",
              padding: "4px 8px",
              fontSize: "0.9em"
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <div style={{
        display: "flex",
        gap: "16px",
        marginTop: "12px",
        borderTop: "1px solid var(--border)",
        paddingTop: "12px",
        justifyContent: "space-between"
      }}>
        <SaveButton
          postId={image_id}
          isInitiallySaved={false} // update later if backend supports it
          onSaveChange={async ({ postId, isSaved }) => {
            await fetch(`${BACKEND_URL}/posts/${postId}/save`, {
              method: isSaved ? "POST" : "DELETE",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
          }}
        />
      </div>
    </div>
  );
}

export default PostView;
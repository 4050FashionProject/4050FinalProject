import React, { useState } from "react";

// Like an outfit


export default function LikeButton({
  initialLiked = false,
  initialCount = 0,
  postId,
  onToggleLike,
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    if (isLoading) return;

    const nextLiked = !liked;
    const nextCount = nextLiked ? likeCount + 1 : Math.max(0, likeCount - 1);

    // optimistic UI update
    setLiked(nextLiked);
    setLikeCount(nextCount);
    setError("");

    try {
      setIsLoading(true);

      if (onToggleLike) {
        await onToggleLike({
          postId,
          liked: nextLiked,
        });
      }
    } catch (toggleError) {
      // rollback if request fails
      setLiked(liked);
      setLikeCount(likeCount);
      setError(toggleError?.message || "Could not update like right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="like-button-wrapper">
      <button
        type="button"
        className={`like-button ${liked ? "liked" : ""}`}
        onClick={handleClick}
        disabled={isLoading}
        aria-pressed={liked}
        aria-label={liked ? "Unlike post" : "Like post"}
      >
        <span className="like-icon">{liked ? "♥" : "♡"}</span>
        <span className="like-text">{liked ? "Liked" : "Like"}</span>
        <span className="like-count">{likeCount}</span>
      </button>

      {error && <p className="like-error">{error}</p>}
    </div>
  );
}

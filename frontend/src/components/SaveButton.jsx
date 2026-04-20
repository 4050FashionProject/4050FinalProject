import React, { useEffect, useState } from "react";
// Save/unsave an outfit to/from closet


export default function SaveButton({
  postId,
  isInitiallySaved = false,
  onSaveChange,
}) {
  const [saved, setSaved] = useState(isInitiallySaved);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // keep in sync if parent updates
  useEffect(() => {
    setSaved(isInitiallySaved);
  }, [isInitiallySaved]);

  const handleClick = async () => {
    if (isLoading) return;

    const nextSaved = !saved;

    // optimistic update
    setSaved(nextSaved);
    setError("");

    try {
      setIsLoading(true);

      if (onSaveChange) {
        await onSaveChange({
          postId,
          isSaved: nextSaved,
        });
      }
    } catch (err) {
      // rollback on failure
      setSaved(saved);
      setError(err?.message || "Could not update save right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="save-button-wrapper">
      <button
        type="button"
        className={`save-button ${saved ? "saved" : ""}`}
        onClick={handleClick}
        disabled={isLoading}
        aria-pressed={saved}
        aria-label={saved ? "Unsave outfit" : "Save outfit"}
      >
        <span className="save-icon">{saved ? "🔖" : "📑"}</span>
        <span className="save-text">{saved ? "Saved" : "Save"}</span>
      </button>

      {error && <p className="save-error">{error}</p>}
    </div>
  );
}

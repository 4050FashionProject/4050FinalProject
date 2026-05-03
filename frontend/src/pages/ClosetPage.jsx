import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

function ClosetPage() {
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch saved outfits from backend
  useEffect(() => {
    const fetchCloset = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/closet");
        if (!response.ok) throw new Error("Failed to fetch closet");

        const data = await response.json();
        setSavedOutfits(data || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCloset();
  }, []);

  const handleRemove = async (postId) => {
    try {
      await fetch(`/api/posts/${postId}/save`, {
        method: "DELETE",
      });

      // update UI
      setSavedOutfits((prev) => prev.filter((item) => item._id !== postId));
    } catch (err) {
      console.error("Failed to remove from closet", err);
    }
  };

  return (
    <div className="closet-page">
      <h1>My Closet</h1>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading && savedOutfits.length === 0 && (
        <p>No saved outfits yet.</p>
      )}

      <div className="closet-grid">
        {savedOutfits.map((outfit) => (
          <div key={outfit._id} className="closet-card">
            <img src={outfit.image} alt="outfit" />

            <div className="closet-card-info">
              <p>@{outfit.creator}</p>
              <p>{outfit.caption}</p>

              <div>
                {outfit.hashtags?.map((tag) => (
                  <span key={tag}>{tag} </span>
                ))}
              </div>

              <button onClick={() => handleRemove(outfit._id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <NavBar visible={true} current={2} />
    </div>
  );
}

export default ClosetPage;

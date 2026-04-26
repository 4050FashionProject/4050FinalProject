import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import PostView from "../components/PostView";
import { BACKEND_URL } from "../config";

function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/posts/`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Explore</h1>
      {loading && <p>Loading posts...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && posts.length === 0 && <p>No posts yet</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {posts.map((post) => (
          <PostView key={post.image_id} post={post} />
        ))}
      </div>
      <NavBar visible={true} current={1} />
    </div>
  );
}

export default ExplorePage;

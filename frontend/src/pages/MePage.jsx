import { useState, useEffect, useContext } from "react";
import NavBar from "../components/NavBar";
import PostView from "../components/PostView";
import { BACKEND_URL } from "../config";
import { useAuth } from "../hooks/authContext";

function MePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!user) {
      setUser(localStorage.getItem("user"));
      setLoading(false);
      return;
    }

    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/posts/user/${user.username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch your posts");
        }
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching user posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  if (!user) {
    return (
      <div>
        <h1>Me</h1>
        <p>Please log in to view your posts</p>
        <NavBar visible={true} current={3} />
      </div>
    );
  }

  return (
    <div>
      <h1>{user.username}'s Posts</h1>
      {loading && <p>Loading your posts...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && posts.length === 0 && <p>You haven't posted anything yet</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {posts.map((post) => (
          <PostView key={post.image_id} post={post} />
        ))}
      </div>
      <NavBar visible={true} current={3} />
    </div>
  );
}

export default MePage;

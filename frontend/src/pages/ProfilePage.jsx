import { useState, useEffect, useContext } from "react";
import NavBar from "../components/NavBar";
import PostView from "../components/PostView";
import { BACKEND_URL } from "../config";
import { useAuth } from "../hooks/authContext";
import { useParams, useNavigate } from 'react-router-dom';

function ProfilePage() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout, user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUserPosts = async () => {
      // try to get the current user
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
        setLoading(false);
        if (!storedUser) {
          await logout();
          navigate("/login");
        }
      } catch (error) {
        console.error(error);
      }

      // try to get all the fetches for the username at the route
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/posts/user/${username}`);
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
  }, []);

  const handlePostDeleted = (imageId) => {
    setPosts(posts.filter(post => post.image_id !== imageId));
  };

  return loading ? <>Loading</> : (
    <div>
      <h1>{username}'s Posts</h1>
      {loading && <p>Loading your posts...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && posts.length === 0 && <p>You haven't posted anything yet</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", maxWidth: "600px", margin: "0 auto" }}>
        {posts.map((post) => (
          <PostView key={post.image_id} post={post} currentUser={currentUser} onPostDeleted={handlePostDeleted} />
        ))}
      </div>
      <NavBar visible={true} current={3} />
    </div>
  );
}

export default ProfilePage;

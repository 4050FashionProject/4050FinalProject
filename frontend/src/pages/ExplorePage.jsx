import { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import PostView from "../components/PostView";
import { BACKEND_URL } from "../config";
import "../styles/ExplorePage.css";

function ExplorePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef(null);

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

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? posts.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === posts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    const isLeftSwipe = touchStart - touchEnd > 50;
    const isRightSwipe = touchEnd - touchStart > 50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  return (
    <div className="explore-page">
      <h1>Explore</h1>
      {loading && <p>Loading posts...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && posts.length === 0 && <p>No posts yet</p>}

      {!loading && posts.length > 0 && (
        <div className="carousel-container">
          <button className="carousel-button prev" onClick={handlePrevious}>
            &#10094;
          </button>

          <div
            className="carousel-wrapper"
            ref={carouselRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="carousel-content"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {posts.map((post, index) => (
                <div
                  key={post.image_id}
                  className="carousel-slide"
                >
                  <PostView post={post} />
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-button next" onClick={handleNext}>
            &#10095;
          </button>
        </div>
      )}

      <div className="carousel-indicators">
        {posts.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to post ${index + 1}`}
          />
        ))}
      </div>

      <NavBar visible={true} current={1} />
    </div>
  );
}

export default ExplorePage;

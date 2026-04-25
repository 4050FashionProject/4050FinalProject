import { useState } from "react";
import { BACKEND_URL } from "../config";
import SaveButton from "./SaveButton";

function PostView({ post: { image_id, image, coordinates, caption, hashtags, creator, likes } }) {
  return (
    <div style={{
      border: "1px solid var(--border)",
      borderRadius: "8px",
      padding: "16px",
      backgroundColor: "var(--paper)",
      marginBottom: "16px"
    }}>
      <div style={{ marginBottom: "12px" }}>
        <h3 style={{ margin: "0 0 8px 0", color: "var(--contrast)" }}>{creator}</h3>
      </div>

      {image && (
        <img
          src={image}
          alt={caption}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "8px",
            marginBottom: "12px",
            maxHeight: "400px",
            objectFit: "cover"
          }}
        />
      )}

      {caption && (
        <p style={{ margin: "8px 0", color: "var(--text)" }}>
          {caption}
        </p>
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
        paddingTop: "12px"
      }}>
        <SaveButton />
      </div>
    </div>
  );
}

export default PostView;
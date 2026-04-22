import { useState, useEffect } from "react";
import { BACKEND_URL } from "../config";

function Post({ post: { image, coordinates, caption, hashtags, creator } }) {
    const response = await fetch(`${BACKEND_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ display_name, email, username, password }),
      });

    return <div></div>
}

export default Post;
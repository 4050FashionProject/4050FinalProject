import "../styles/CreatePostModal.css";
import { TagsInput } from "react-tag-input-component";
import { useRef, useEffect, useState } from "react";

function CreatePostModal({ isOpen, onClose }) {
  const [hashtags, setHashtags] = useState([]);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);


  const handleSubmit = () => { };

  return (
    <dialog ref={dialogRef} onCancel={onClose} id="createPostModal">
      <h1>Create Post</h1>
      <form method="dialog" action="submit">
        <img id="postimg" src="placeholder.svg" alt="Your uploaded image will appear here" />
        <textarea name="caption" id="caption" maxLength={500} placeholder="enter your caption here"></textarea>
        <TagsInput
          value={hashtags}
          onChange={setHashtags}
          name="hashtags"
          placeHolder="enter hashtags"
          id="hashtags"
        />
        <button className="primary-button" onSubmit={handleSubmit}>Post</button>
        <button className="secondary-button" onSubmit={onClose}>Cancel</button>
      </form>
    </dialog>
  );
}

export default CreatePostModal;

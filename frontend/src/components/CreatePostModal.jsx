import "../styles/CreatePostModal.css";
import { useRef, useEffect, useState } from "react";

function CreatePostModal({ isOpen, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "true");
      }
    } else {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
    }
  }, [isOpen]);

  const handleSubmit = () => {};

  return (
    <dialog ref={dialogRef} onCancel={onClose} id="createPostModal">
      <h1>Create Post</h1>
    </dialog>
  );
}

export default CreatePostModal;

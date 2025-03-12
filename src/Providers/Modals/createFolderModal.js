import "./createProjectModal.css";
import { useContext, useEffect, useRef } from "react";
import { ModalContext } from "../ModalProvider";
import { ProjectContext } from "../ProjectProvider";

export const CreateFolderModal = () => {
  const modalFeatures = useContext(ModalContext);
  const { createNewFolder } = useContext(ProjectContext);

  const folderInputRef = useRef(null);

  const closeModal = () => {
    modalFeatures.closeModal();
  };

  const onSubmitModal = (e) => {
    e.preventDefault();
    const folderName = folderInputRef.current.value.trim();
    if (!folderName) return;
    createNewFolder(folderName);
    closeModal();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const folderName = folderInputRef.current.value.trim();
        if (folderName) {
          document.querySelector("form")?.requestSubmit();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="modal-overlay">
      <form className="modal-content" onSubmit={onSubmitModal}>
        <div className="modal-header">
          <h3 className="modal-title">Create New Folder</h3>
          <button className="close-btn" onClick={closeModal} type="button">
            X
          </button>
        </div>

        <div className="form-group pt-3">
          <label htmlFor="input1" className="inputtext">
            Enter the folder name:
          </label>
          <input
            ref={folderInputRef}
            type="text"
            name="folderName"
            className="form-control"
            id="input1"
            placeholder="Folder name"
            required
          />
        </div>

        <button type="submit" className="btn-create">
          Create
        </button>
      </form>
    </div>
  );
};

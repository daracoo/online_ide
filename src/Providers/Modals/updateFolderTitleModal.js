import { useContext, useEffect, useRef } from "react";
import "./createProjectModal.css";
import { ModalContext } from "../ModalProvider";
import { ProjectContext } from "../ProjectProvider";

export const UpdateFolderTitleModal = () => {
  const { closeModal, modalPayload } = useContext(ModalContext);
  const { editFolderTitle } = useContext(ProjectContext);
  
  const inputRef = useRef(null);

  const onSubmitModal = (e) => {
    e.preventDefault();
    const folderName = inputRef.current.value.trim();

    if (!folderName) return;

    editFolderTitle(folderName, modalPayload);
    closeModal();
  };

  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const folderName = inputRef.current.value.trim();
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
          <h3 className="modal-title">Update folder title</h3>
          <button className="close-btn" onClick={closeModal} type="button">
            X
          </button>
        </div>

        <div className="form-group pt-3">
          <label htmlFor="input1" className="inputtext">
            Enter new folder title:
          </label>
          <input
            ref={inputRef}
            type="text"
            name="folderName"
            className="form-control"
            id="input1"
            placeholder="Folder name"
            required
          />
        </div>

        <button type="submit" className="btn-create">
          Save
        </button>
      </form>
    </div>
  );
};

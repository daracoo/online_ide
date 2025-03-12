import { useContext, useEffect, useRef } from "react";
import "./createProjectModal.css";
import { ModalContext } from "../ModalProvider";
import { ProjectContext } from "../ProjectProvider";

export const UpdateFileTitleModal = () => {
  const { closeModal, modalPayload } = useContext(ModalContext);
  const { editFileTitle } = useContext(ProjectContext);

  const inputRef = useRef(null);

  const onSubmitModal = (e) => {
    e.preventDefault();
    const fileName = inputRef.current.value.trim();

    if (!fileName) return;

    editFileTitle(fileName, modalPayload.folderId, modalPayload.fileId);
    closeModal();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const fileName = inputRef.current.value.trim();
        if (fileName) {
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
          <h3 className="modal-title">Update Card Title</h3>
          <button className="close-btn" onClick={closeModal} type="button">
            X
          </button>
        </div>

        <div className="form-group pt-3">
          <label htmlFor="input1" className="inputtext">
            Enter new card title:
          </label>
          <input
            ref={inputRef}
            type="text"
            name="fileName"
            className="form-control"
            id="input1"
            placeholder="File name"
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

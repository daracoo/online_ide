import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./createProjectModal.css";
import { useContext, useEffect, useRef } from "react";
import { ModalContext } from "../ModalProvider";
import { ProjectContext } from "../ProjectProvider";

export const CreateProjectModal = () => {
  const modalFeatures = useContext(ModalContext);
  const projectFeatures = useContext(ProjectContext);

  const folderInputRef = useRef(null);
  const templateInputRef = useRef(null);

  const closeModal = () => {
    modalFeatures.closeModal();
  };

  const onSubmitModal = (e) => {
    e.preventDefault();
    const folderName = folderInputRef.current.value.trim();
    const templateName = templateInputRef.current.value.trim();
    const language = e.target.language.value;

    if (!folderName || !templateName) return;

    projectFeatures.createNewProject({
      folderName,
      templateName,
      language,
    });

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
        const templateName = templateInputRef.current.value.trim();
        if (folderName && templateName) {
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
          <h3 className="modal-title">Create New Project</h3>
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

        <div className="form-group pb-3">
          <label htmlFor="input2" className="inputtext">
            Enter template name:
          </label>
          <input
            ref={templateInputRef}
            type="text"
            name="templateName"
            className="form-control"
            id="input2"
            placeholder="Template name"
            required
          />
        </div>

        <div className="form-group dropdown-row">
          <select name="language" className="form-control" id="dropdown">
            <option value="cpp">CPP</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
          <button type="submit" className="btn-create">Create</button>
        </div>
      </form>
    </div>
  );
};

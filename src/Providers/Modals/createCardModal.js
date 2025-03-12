import { useContext, useEffect, useRef } from "react";
import { v4 } from "uuid";
import "./createProjectModal.css";
import { ModalContext } from "../ModalProvider";
import { defaultCodes, ProjectContext } from "../ProjectProvider";

export const CreateCardModal = () => {
  const { closeModal, modalPayload } = useContext(ModalContext);
  const { createProject } = useContext(ProjectContext);

  const fileInputRef = useRef(null);

  const onSubmitModal = (e) => {
    e.preventDefault();
    const fileName = fileInputRef.current.value.trim();
    if (!fileName) return;

    const language = e.target.language.value;

    const file = {
      id: v4(),
      title: fileName,
      language,
      code: defaultCodes[language],
    };

    createProject(modalPayload, file);
    closeModal();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const fileName = fileInputRef.current.value.trim();
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
          <h3 className="modal-title">Create New Project</h3>
          <button className="close-btn" onClick={closeModal} type="button">
            X
          </button>
        </div>

        <div className="form-group pb-3">
          <label htmlFor="input2" className="inputtext">
            Enter template name:
          </label>
          <input
            ref={fileInputRef}
            type="text"
            name="fileName"
            className="form-control"
            id="input2"
            placeholder="Project name"
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
          <button type="submit" className="btn-create">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

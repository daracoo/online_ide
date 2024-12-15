import { useContext } from "react"
import "./createProjectModal.css"
import { ModalContext } from "../ModalProvider"
import { ProjectContext } from "../ProjectProvider";

export const UpdateFileTitleModal = () => {

    const {closeModal, modalPayload} = useContext(ModalContext);
    const {editFileTitle} = useContext(ProjectContext);

    const onSubmitModal = (e) => {
        e.preventDefault();
        const fileName = e.target.fileName.value;
        editFileTitle(fileName, modalPayload.folderId, modalPayload.fileId);
        closeModal();
    };

    return (
        <div className="modal-overlay">
      <form className="modal-content" onSubmit={onSubmitModal}>
        <div className="modal-header ">
          <h3 className="modal-title">Update Card title</h3>
          <button className="close-btn" onClick={closeModal}>X</button>
        </div>

        <div className="form-group pt-3">
          <label htmlFor="input1" className="inputtext">
            Enter new card title:
          </label>
          <input
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
    )
}
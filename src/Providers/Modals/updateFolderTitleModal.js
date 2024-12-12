import { useContext } from "react"
import "./createProjectModal.css"
import { ModalContext } from "../ModalProvider"
import { ProjectContext } from "../ProjectProvider";

export const UpdateFolderTitleModal = () => {

    const {closeModal, modalPayload} = useContext(ModalContext);
    const {editFolderTitle} = useContext(ProjectContext)

    const onSubmitModal = (e) => {
        e.preventDefault();
        const folderName = e.target.folderName.value;
        editFolderTitle(folderName, modalPayload);
        closeModal();
    };

    return (
    <div className="modal-overlay">
      <form className="modal-content" onSubmit={onSubmitModal}>
        <div className="modal-header ">
          <h3 className="modal-title">Update folder title</h3>
          <button className="close-btn" onClick={closeModal}>X</button>
        </div>

        <div className="form-group pt-3">
          <label htmlFor="input1" className="inputtext">
            Enter new folder title:
          </label>
          <input
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
    )
}
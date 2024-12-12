import "./createFolderModal.css";
import "./createProjectModal.css";
import { useContext } from 'react';
import { ModalContext } from '../ModalProvider';
import { ProjectContext } from "../ProjectProvider";

export const CreateFolderModal = () => {

    const modalFeatures = useContext(ModalContext)
    const {createNewFolder} = useContext(ProjectContext);

    const closeModal = () => {
        modalFeatures.closeModal()
      };

    const onSubmitModal = (e) =>{
        e.preventDefault();
        const folderName = e.target.folderName.value;
        createNewFolder(folderName);
        closeModal();
    };

  return (
    <div className="modal-overlay">
      <form className="modal-content" onSubmit={onSubmitModal}>
        <div className="modal-header ">
          <h3 className="modal-title">Create new folder</h3>
          <button className="close-btn" onClick={closeModal}>X</button>
        </div>

        <div className="form-group pt-3">
          <label htmlFor="input1" className="inputtext">
            Enter the folder name:
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
          Create
        </button>        
      </form>
    </div>
  );
};

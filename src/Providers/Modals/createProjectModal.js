import 'bootstrap'
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./createProjectModal.css"
import { useContext } from 'react';
import { ModalContext } from '../ModalProvider';
import { ProjectContext } from '../ProjectProvider';


export const CreateProjectModal = () => {
    
  const modalFeatures = useContext(ModalContext)
  const projectFeatures = useContext(ProjectContext)


  const closeModal = () => {
    modalFeatures.closeModal()
  }

  const onSubmitModal = (e) => {
    e.preventDefault();
   const folderName = e.target.folderName.value
   const templateName = e.target.templateName.value
   const language = e.target.language.value
   projectFeatures.createNewProject({
    folderName,
    templateName,
    language
   })
    closeModal();
  }

  return (  
    <div className="modal-overlay">
  <form className="modal-content" onSubmit={onSubmitModal}>
    <div className="modal-header ">
      <h3 className="modal-title">Create new project</h3>
      <button className="close-btn" onClick={closeModal}>X</button>
    </div>
    
    <div className="form-group pt-3">
      <label htmlFor="input1" className='inputtext'>Enter the folder name:</label>
      <input type="text" name="folderName" className="form-control" id="input1" placeholder="Folder name" required/>
    </div>
    
    <div className="form-group pb-3">
      <label htmlFor="input2" className='inputtext' >Enter template name:</label>
      <input type="text" name="templateName"className="form-control" id="input2" placeholder="Template name" required />
    </div>
    
    <div className="form-group dropdown-row">
  
      <select name="language" className="form-control" id="dropdown">
        <option value="cpp">CPP</option>
        <option value="java">Java</option>
        <option value="javascript">Java Script</option>
        <option value="python">Python</option>
      </select>
      <button type="submit" className="btn-create">Create</button>
    </div>
  </form>
</div>


);
}
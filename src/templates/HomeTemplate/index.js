import 'bootstrap'
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./indexstyle.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt, faFolder, faFolderOpen} from '@fortawesome/free-solid-svg-icons';
import {RightComponent} from "./RightComponent/index"
import { Modal } from '../../Providers/Modals/Modal';
import { useContext } from 'react';
import { ModalContext } from '../../Providers/ModalProvider';

export const HomeTemplate = () => {
  const modalFeatures = useContext(ModalContext)
  const openCreateProjectModal = () => {
    console.log("Open Create Project Modal Triggered");
      modalFeatures.openModal("CREATE_PROJECT");
  };
  return (
    <div className="container-fluid h-100 home">
      <div className="row full-height">
        <div className="col-5 left-container">
          <img src="https://i.ibb.co/8B22xhv/Code-Editor.png" className='leftlogo' alt="logo"></img>
          <button className="btn btn-light leftbtn px-4" onClick={openCreateProjectModal}>
            <span>Create a new project</span>
            <FontAwesomeIcon
              icon={faPlus}
              className="ms-2"
              style={{ fontWeight: "bold" }}
            />
          </button>
        </div>
        <RightComponent/>
        {/* right container */}
        <Modal/>
      </div>
    </div>
  );
};
import 'bootstrap'
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./indexstyle.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt, faFolder, faFolderOpen} from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { ProjectContext } from '../../../Providers/ProjectProvider';
import { Modal } from 'bootstrap';
import { modalConstants, ModalContext } from '../../../Providers/ModalProvider';
import { useNavigate } from 'react-router-dom';



const Folder = ({folderTitle, cards, folderId: folderId}) => {

  const {deleteFolder, deleteFile} = useContext(ProjectContext);
  const {openModal, setModalPayload} = useContext(ModalContext);
  const navigate = useNavigate();

  const onDeleteFolder = () => {
    deleteFolder(folderId);
  };

  const onEditFolderTitle = () => {
    setModalPayload(folderId);
    openModal(modalConstants.UPDATE_FOLDER_TITLE);
  };

  const openCreateCardModal = () => {
    setModalPayload(folderId);
    openModal(modalConstants.CREATE_CARD)
  };

    return (
      <>
        <div className="d-flex justify-content-between pt-md-4 pt-lg-4">
          <h2 className="folderstitle">
            {" "}
            <FontAwesomeIcon
              icon={faFolderOpen}
              style={{ color: "#ffce6d" }}
              className="mr-lg-3 mr-md-3"
            />{" "}
            {folderTitle}
          </h2>
          <div className="folderitems">
            <button className="templatebtn btn" onClick={onDeleteFolder}>
              {" "}
              <FontAwesomeIcon icon={faTrashAlt} className="mx-md-2" />{" "}
            </button>
            <button className="templatebtn btn" onClick={onEditFolderTitle}>
              {" "}
              <FontAwesomeIcon icon={faEdit} className="mx-md-2" />{" "}
            </button>
            <button className="templatebtn btn" onClick={openCreateCardModal}>
              <FontAwesomeIcon icon={faPlus} />
              <span> New template</span>
            </button>
          </div>
        </div>
        <hr className="hr hr2" />
        <div className="row pb-3">
          {cards?.map((file, index) => {

            const onEditFile = () => {
              setModalPayload({fileId: file.id, folderId: folderId})
              openModal(modalConstants.UPDATE_FILE_TITLE)
            };

            const onDeleteFile = () => {
              deleteFile(folderId, file.id);
            };

            const navigateToEditor = () => {
              navigate(`/editor/${file.id}/${folderId}`)
            }

            return (
              <div className="col-sm-12 col-md-12 col-lg-12 col-xxl-6 col-xl-6 pb-3" 
              key={index} onClick={navigateToEditor}
              style={{cursor: 'pointer'}}>
                <div className="card shadow-lg border-0 rounded-5 d-flex">
                  <div className="d-flex align-items-center w-100">
                    {/* Logo Section */}
                    <div className="px-3">
                      <img
                        src="https://i.ibb.co/P4763KY/Code-Editor-3.png"
                        className="img-fluid rounded-start"
                        alt="Logo"
                      />
                    </div>

                    {/* Text Section */}
                    <div className="card-body px-2">
                      <h5 className="card-title">{file?.title}</h5>
                      <p className="card-text text-muted">
                        Language: {file?.language}
                      </p>
                    </div>

                    {/* Button Section */}
                    <div className="card-buttons px-2">
                      <button className="templatebtn btn icon-btn" onClick={onDeleteFile}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                      <button className="templatebtn btn icon-btn" onClick={onEditFile}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
}

export const RightComponent = () => { 

const {folders} = useContext(ProjectContext);

const modalFeatures = useContext(ModalContext);

const openCretaeNewFolderModal = () => {
  modalFeatures.openModal(modalConstants.CREATE_FOLDER);
}

 

return (
  <div className="col-7 right-container px-5 pt-md-5 pt-lg-5">
    <div className="title d-flex justify-content-between">
      <h2 className="myprojectstitle">My Projects</h2>
      <button className="btn rightbtn" onClick={openCretaeNewFolderModal}>
        <FontAwesomeIcon icon={faPlus} className="mx-md-2 mx-lg-2" />
        <span>New Folder</span>
      </button>
    </div>
    <hr className="hr hr1" />
    {
        folders?.map((folder,index) => {
            return (
              <Folder
                folderTitle={folder?.title}
                cards={folder?.files}
                key={index}
                folderId = {folder.id}
              />
            );
        })
    }
   
  </div>
);
}
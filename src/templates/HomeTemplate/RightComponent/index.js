import 'bootstrap'
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./indexstyle.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt, faFolder, faFolderOpen} from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { ProjectContext } from '../../../Providers/ProjectProvider';


const Folder = ({folderTitle, cards}) => {
    return <><div className="d-flex justify-content-between pt-md-4 pt-lg-4">
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
      <button className="templatebtn btn">
        {" "}
        <FontAwesomeIcon icon={faTrashAlt} className="mx-md-2" />{" "}
      </button>
      <button className="templatebtn btn">
        {" "}
        <FontAwesomeIcon icon={faEdit} className="mx-md-2" />{" "}
      </button>
      <button className="templatebtn btn">
        <FontAwesomeIcon icon={faPlus} />
        <span> New template</span>
      </button>
    </div>
  </div>
  <hr className="hr hr1" />
  <div className="row pb-3">
    {
        cards?.map((files,index)=> {
            return (
                <div className="col-md-6 pb-3" key={index}>
      <div className="card shadow-lg border-0 rounded-5">
        <div className="row g-0">
          <div className="col-md-4 d-flex flex-column justify-content-center px-4 ">
            <img
              src="https://i.ibb.co/P4763KY/Code-Editor-3.png"
              className="img-fluid rounded-start"
              alt="Logo"
            ></img>
          </div>
          <div className="col-md-6 py-md-3 py-lg-3">
            <div className="card-body d-flex flex-column justify-content-center">
              <h5 className="card-title">{files?.title}</h5>
              <p className="card-text text-muted">Language: {files?.language}</p>
            </div>
          </div>
          <div className="col-md-2 py-md-3 py-lg-3">
            <div className="card-body d-flex flex-column justify-content-center">
              <button className="templatebtn btn">
                {" "}
                <FontAwesomeIcon icon={faTrashAlt} className="mx-md-2" />{" "}
              </button>
              <button className="templatebtn btn">
                {" "}
                <FontAwesomeIcon icon={faEdit} className="mx-md-2" />{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
            );
        })
    }
  </div>
  </>
}

export const RightComponent = () => { 

const {folders} = useContext(ProjectContext);

 

return (
  <div className="col-7 right-container px-5 pt-md-5 pt-lg-5">
    <div className="title d-flex justify-content-between">
      <h2 className="myprojectstitle">My Projects</h2>
      <button className="btn rightbtn">
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
              />
            );
        })
    }
   
  </div>
);
}
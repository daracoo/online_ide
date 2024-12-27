import { useParams } from "react-router-dom";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImport, faDownload } from '@fortawesome/free-solid-svg-icons';

export const EditorTemplate = () => {
    const params = useParams();
    console.log(params);
    return (
        <div className="page-container">
            <div className="header-container">
                <img src="https://i.ibb.co/P4763KY/Code-Editor-3.png" className="logo" alt="logo"></img>
            </div>
            <div className="content-container">
                <div className="editor-container">Editor container</div>
                <div className="input-output-container">
                    <div className="input-header">
                        <b>Input: </b>
                        <label htmlFor="input" className="icon-container">
                            <span className="material-icons"><FontAwesomeIcon icon={faFileImport}/></span>
                            <b className="">Import Input</b>
                        </label>
                        <input type="file" id="input" style={{display: 'none'}}></input>
                    </div>
                    <textarea></textarea>
                </div>
                <div className="input-output-container">
                    <div className="input-header">
                        <b>Output: </b>
                        <button className="icon-container">
                            <span className="material-icons"><FontAwesomeIcon icon={faDownload}/></span>
                            <b>Export Output</b>
                        </button>
                    </div>
                    <textarea readOnly></textarea>
                </div>
            </div>
        </div>
    )
}
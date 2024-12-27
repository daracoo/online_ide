import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faUpRightAndDownLeftFromCenter, faFileImport, faDownload, faPlay } from '@fortawesome/free-solid-svg-icons';
import './EditorContainer.scss'

export const EditorContainer = () => {
    return(
        <div className="root-editor-container">
            <div className='editor-header'>
                <div className='editor-left-container'>
                    <b className='title'>{"Title"}</b>
                    <span><FontAwesomeIcon icon={ faEdit }/></span>
                    <button>Save Code</button>
                </div>
                <div className='editor-right-container'>
                   <select>
                        <option value="cpp">cpp</option>
                        <option value="javascript">javascript</option>
                        <option value="java">java</option>
                        <option value="python">python</option>
                   </select>
                   <select>
                        <option value="vs-dark">vs-dark</option>
                        <option value="vs-light">vs-light</option>
                   </select>
                </div>
            </div>
            <div className='editor-body'>
                Body
            </div>
            <div className='editor-footer'>
                <button className='btn'>
                    <span><FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter}/></span>
                    <span>Full Screen</span>
                </button>
                <label htmlFor='import-code' className='btn'>
                    <span><span><FontAwesomeIcon icon={faFileImport}/></span></span>
                    <span>Import Code</span>
                </label>
                <input type='file' id='import-code' style={{display: 'none'}}></input>
                <button className='btn'>
                    <span><FontAwesomeIcon icon={faDownload}/></span>
                    <span>Export Code</span>
                </button>
                <button className='btn'>
                    <span><FontAwesomeIcon icon={ faPlay }/></span>
                    <span>Run Code</span>
                </button>
            </div>
        </div>
    );
}
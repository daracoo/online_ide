import {useParams, useNavigate} from "react-router-dom";
import "./style.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileImport, faDownload} from '@fortawesome/free-solid-svg-icons';
import {EditorContainer} from "./EditorContainer";
import {useCallback, useState, useContext} from "react";
import { makeSubmission } from "./service";
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, ref, set } from 'firebase/database';
import { ProjectContext } from "../../Providers/ProjectProvider";
import app from '../../firebase';


export const EditorTemplate = () => {
    const params = useParams();
    const {fileId, folderId} = params;
    const navigate = useNavigate();
    console.log('Route params:', { fileId, folderId });

    const database = getDatabase(app);

    const queryParams = new URLSearchParams(window.location.search);
    const sessionId = queryParams.get('sessionId');
    console.log('URL Session ID:', sessionId);

    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [showLoader, setShowLoader] = useState(false);
    const [isError, setIsError] = useState(false);

    const { createNewProject } = useContext(ProjectContext);

    const importInput = (e) => {
        const file = e.target.files[0]
        const fileType = file.type.includes("text")
        if (fileType) {
            const fileReader = new FileReader()
            fileReader.readAsText(file)
            fileReader.onload = (e) => {
                setInput(e.target.result)
            }
        } else {
            alert("Please choose a program file!");
        }
    }

    const exportOutput = () => {
        const outputValue = output.trim();
        if(!outputValue){
            alert("The output is empty!");
        } else {
            const blob = new Blob([outputValue], {type: "text/plain"})
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a");
            link.href = url;
            link.download = "output.txt";
            link.click()
            URL.revokeObjectURL(url);
        }
    }

    const callback = useCallback(({apiStatus, data, message}) => {
        if(apiStatus === 'loading') {
            setShowLoader(true);
        }
        else if(apiStatus === 'error') {
            setShowLoader(false);
            setOutput("Something went wrong: " + message);
            setIsError(true);
        }
        else {
            setShowLoader(false);
            if(data.status.id === 3) {
                setOutput(atob(data.stdout || ''));
                setIsError(false);
            } else {
                setOutput(atob(data.stderr || ''));
                setIsError(true);
            }
        }
    }, []);

    const runCode = useCallback(({code, language}) => {
        makeSubmission({
            code,
            language,
            stdin: input,
            callback
        });
    }, [input, callback]);

    const startNewCollaborationSession = (initialCodeContent, initialLanguage) => {
        const newSessionId = uuidv4();
        console.log("Generated new session ID:", newSessionId);

        const newSessionRef = ref(database, `sessions/${newSessionId}`);

       set(newSessionRef, {
                code: initialCodeContent || '',
                language: initialLanguage || 'javascript'
            })
            .then(() => {
                console.log("Initial session data written to Firebase for new session:", newSessionId);

                const currentPath = `/editor/${folderId}/${fileId}`;
                navigate(`${currentPath}?sessionId=${newSessionId}`, { replace: true });

                alert(`New collaboration session started! Share this URL: ${window.location.origin}${currentPath}?sessionId=${newSessionId}`);
            })
            .catch((error) => {
                console.error("Failed to write initial session data to Firebase:", error);
                alert("Failed to start new collaboration session. Please try again.");
            });
    };

    return (
        <div className="page-container">
            <div className="header-container">
                <img src="https://i.ibb.co/P4763KY/Code-Editor-3.png" className="logo" alt="logo" />
            </div>
            <div className="content-container">
                <div className="editor-container">
                    <EditorContainer
                        fileId={fileId}
                        folderId={folderId}
                        runCode={runCode}
                        sessionId={sessionId}
                        onStartNewCollaboration={startNewCollaborationSession}
                        createNewProject={createNewProject}
                        navigate = { navigate }
                    />
                </div>
                <div className="input-output-container">
                    <div className="input-header">
                        <b>Input: </b>
                        <label htmlFor="input" className="icon-container">
                            <span><FontAwesomeIcon icon={faFileImport}/></span>
                            <b>Import Input</b>
                        </label>
                        <input type="file" id="input" style={{display: 'none'}} onChange={importInput} />
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
                <div className="input-output-container">
                    <div className="input-header">
                        <b>Output: </b>
                        <button className="icon-container" onClick={exportOutput}>
                            <span><FontAwesomeIcon icon={faDownload}/></span>
                            <b>Export Output</b>
                        </button>
                    </div>
                    <textarea
                        readOnly
                        value={output}
                        style={{ color: isError ? '#ff0000' : '#000000' }}
                    />
                </div>
            </div>

            {showLoader && (
                <div className="fullpage-loader">
                    <div className="loader" />
                </div>
            )}
        </div>
    );
}
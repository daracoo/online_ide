import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEdit,
    faUpRightAndDownLeftFromCenter,
    faFileImport,
    faDownload,
    faPlay
} from '@fortawesome/free-solid-svg-icons';
import './EditorContainer.scss'
import { Editor } from '@monaco-editor/react';
import { useContext, useRef, useState, useEffect } from "react";
import { ProjectContext } from "../../Providers/ProjectProvider";

import { getDatabase, ref, onValue, set } from 'firebase/database';
import app from '../../firebase';

const editorOptions = {
    fontSize: 18,
    wordWrap: 'on',
    automaticLayout: true
}

const fileExtensionMapping = {
    cpp: 'cpp',
    javascript: 'js',
    python: 'py',
    java: 'java',
}

export const EditorContainer = ({ fileId, folderId, runCode, sessionId, onStartNewCollaboration }) => {
    const { getDefaultCode, getLanguage, updateLanguage, saveCode } = useContext(ProjectContext);
    const [language, setLanguage] = useState(() => getLanguage(fileId, folderId));
    const [code, setCode] = useState(() => getDefaultCode(fileId, folderId));
    const [theme, setTheme] = useState('vs-dark');
    const codeRef = useRef(code);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const editorRef = useRef(null);
    const containerRef = useRef(null);
    const originalDimensionsRef = useRef(null);
    const resizeTimeoutRef = useRef(null);

    const database = getDatabase(app);
    const sessionCodeRef = ref(database, `sessions/${sessionId}/code`);

    useEffect(() => {
        if (!sessionId) {
            console.log("No session ID provided, real-time collaboration is disabled.");
            const currentCode = getDefaultCode(fileId, folderId);
            setCode(currentCode);
            codeRef.current = currentCode;
            return;
        }

        const unsubscribe = onValue(sessionCodeRef, (snapshot) => {
            const latestCode = snapshot.val();
            if (latestCode !== null) {
                setCode(latestCode);
                codeRef.current = latestCode;
                console.log("Code updated from Firebase:", latestCode);
            } else {
                console.log("No code found in Firebase for this session. Starting fresh?");
            }
        }, (error) => {
            console.error("Firebase Realtime Database listener failed:", error);
        });

        return () => {
            unsubscribe();
            console.log("Firebase listener unsubscribed.");
        };
    }, [sessionId, fileId, folderId, getDefaultCode]);


    useEffect(() => {
        const handleResize = () => {
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }

            resizeTimeoutRef.current = setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.layout();
                }
            }, 100);
        };

        if (isFullScreen) {
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [isFullScreen]);

    useEffect(() => {
        if (editorRef.current) {
            const timeoutId = setTimeout(() => {
                editorRef.current.layout();
            }, 300);
            return () => clearTimeout(timeoutId);
        }
    }, [isFullScreen]);

    const onChangeCode = (newCode) => {
        setCode(newCode);
        codeRef.current = newCode;

        if (sessionId) {
            set(sessionCodeRef, newCode)
                .catch((error) => {
                    console.error("Failed to write code to Firebase:", error);
                });
        }
    }

    const importCode = (event) => {
        const file = event.target.files[0];
        const validExtensions = ['cpp', 'js', 'py', 'java'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!validExtensions.includes(fileExtension)) {
            alert("Please choose a valid program file!");
            return;
        }
        const fileType = file.type.includes("text");
        if (fileType) {
            const fileReader = new FileReader();
            fileReader.readAsText(file)
            fileReader.onload = function (value) {
                const importedCode = value.target.result;
                setCode(importedCode);
                codeRef.current = importedCode;
                if (sessionId) {
                    set(sessionCodeRef, importedCode)
                        .catch((error) => {
                            console.error("Failed to write imported code to Firebase:", error);
                        });
                }
            }
        } else {
            alert("Please choose a program file!");
        }
    }

    const exportCode = () => {
        const codeValue = codeRef.current?.trim();

        if (!codeRef.current || !codeRef.current.trim()) {
            alert("Please type some code in the editor before exporting!");
            return;
        }
        const codeBlob = new Blob([codeValue], { type: "text/plain" })
        const downloadUrl = URL.createObjectURL(codeBlob)
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `code.${fileExtensionMapping[language]}`
        link.click()
        URL.revokeObjectURL(downloadUrl);
    }

    const onChangeLanguage = (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);
        updateLanguage(fileId, folderId, newLanguage);
    };

    const onChangeTheme = (e) => {
        setTheme(e.target.value);
    }

    const onSaveCode = () => {
        saveCode(fileId, folderId, codeRef.current);
        alert("Code Saved Successfully!!");
    }

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    }

    const toggleFullScreen = () => {
        if (!isFullScreen) {
            const container = containerRef.current;
            if (container) {
                originalDimensionsRef.current = {
                    width: container.offsetWidth,
                    height: container.offsetHeight,
                    editorHeight: container.querySelector('.editor-body').offsetHeight
                };
            }
            document.addEventListener('keydown', handleEscKey);
        } else {
            document.removeEventListener('keydown', handleEscKey);
            requestAnimationFrame(() => {
                const container = containerRef.current;
                const originalDimensions = originalDimensionsRef.current;
                if (container && originalDimensions) {
                    container.style.width = `${originalDimensions.width}px`;
                    container.style.height = `${originalDimensions.height}px`;
                    const editorBody = container.querySelector('.editor-body');
                    if (editorBody) {
                        editorBody.style.height = `${originalDimensions.editorHeight}px`;
                    }
                    requestAnimationFrame(() => {
                        if (editorRef.current) {
                            editorRef.current.layout();
                        }
                    });
                }
            });
        }
        setIsFullScreen(!isFullScreen);
    }

    const handleEscKey = (event) => {
        if (event.key === 'Escape' && isFullScreen) {
            toggleFullScreen();
        }
    }

    const onRunCode = () => {
        runCode({ code: codeRef.current, language });
    }

    useEffect(() => {
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, []);

    return (
        <div ref={containerRef} className={`root-editor-container ${isFullScreen ? 'fullscreen' : ''}`}>
            <div className='editor-header'>
                <div className='editor-left-container'>
                    <b className='title'>{"Title"}</b>
                    <span><FontAwesomeIcon icon={faEdit} /></span>
                    <button onClick={onSaveCode}>Save Code</button>
                    <button onClick={() => onStartNewCollaboration(codeRef.current)}>Start New Collaboration</button>
                </div>
                <div className='editor-right-container'>
                    <select onChange={onChangeLanguage} value={language}>
                        <option value="cpp">cpp</option>
                        <option value="javascript">javascript</option>
                        <option value="java">java</option>
                        <option value="python">python</option>
                    </select>
                    <select onChange={onChangeTheme} value={theme}>
                        <option value="vs-dark">vs-dark</option>
                        <option value="vs-light">vs-light</option>
                    </select>
                </div>
            </div>
            <div className='editor-body'>
                <Editor
                    height="100%"
                    language={language}
                    options={editorOptions}
                    theme={theme}
                    onChange={onChangeCode}
                    value={code}
                    onMount={handleEditorDidMount}
                />
            </div>
            <div className='editor-footer'>
                <button className='btn' onClick={toggleFullScreen}>
                    <span><FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} /></span>
                    <span>{isFullScreen ? "Exit Fullscreen" : "Fullscreen"}</span>
                </button>
                <label htmlFor='import-code' className='btn'>
                    <span><FontAwesomeIcon icon={faFileImport} /></span>
                    <span>Import Code</span>
                </label>
                <input type='file' id='import-code' style={{ display: 'none' }} onChange={importCode}></input>
                <button className='btn' onClick={exportCode}>
                    <span><FontAwesomeIcon icon={faDownload} /></span>
                    <span>Export Code</span>
                </button>
                <button className='btn' onClick={onRunCode}>
                    <span><FontAwesomeIcon icon={faPlay} /></span>
                    <span>Run Code</span>
                </button>
            </div>
        </div>
    );
}
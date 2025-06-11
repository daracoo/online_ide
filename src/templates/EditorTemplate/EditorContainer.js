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

import { getDatabase, ref, onValue, set, update } from 'firebase/database';
import app from '../../firebase';

const editorOptions = {
    fontSize: 18,
    wordWrap: 'on',
    automaticLayout: true,
    minimap: { enabled: false }
}

const fileExtensionMapping = {
    cpp: 'cpp',
    javascript: 'js',
    python: 'py',
    java: 'java',
}

export const EditorContainer = ({ fileId, folderId, runCode, sessionId, onStartNewCollaboration, createNewProject }) => {
    const { getDefaultCode, getLanguage, updateLanguage, saveCode, getFileName, editFileTitle } = useContext(ProjectContext);
    const [language, setLanguage] = useState(() => getLanguage(fileId, folderId));
    const [code, setCode] = useState(() => getDefaultCode(fileId, folderId));
    const templateName = getFileName(fileId, folderId);
    const [theme, setTheme] = useState('vs-dark');
    const codeRef = useRef(code);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const editorRef = useRef(null);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitleText, setNewTitleText] = useState('');
    const containerRef = useRef(null);
    const originalDimensionsRef = useRef(null);
    const resizeTimeoutRef = useRef(null);

    const database = getDatabase(app);
    const sessionRef = ref(database, `sessions/${sessionId}`);

    useEffect(() => {
        const currentCode = getDefaultCode(fileId, folderId);
        const currentLanguage = getLanguage(fileId, folderId);
        setCode(currentCode);
        codeRef.current = currentCode;
        setLanguage(currentLanguage);
    }, [fileId, folderId, getDefaultCode, getLanguage]);

    useEffect(() => {
        if (!sessionId) return;

        const unsubscribe = onValue(sessionRef, (snapshot) => {
            const sessionData = snapshot.val();

            if (sessionData !== null) {
                if (sessionData.code !== undefined && sessionData.code !== codeRef.current) {
                    setCode(sessionData.code);
                    codeRef.current = sessionData.code;
                }
                if (sessionData.language !== undefined && sessionData.language !== language) {
                    setLanguage(sessionData.language);
                }
            }
        }, (error) => {
            console.error("Firebase Realtime Database listener failed:", error);
        });

        return () => {
            unsubscribe();
        };
    }, [sessionId, fileId, folderId, language, sessionRef]);


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
        if (newCode !== codeRef.current) {
            setCode(newCode);
            codeRef.current = newCode;

            if (sessionId) {
                update(sessionRef, {
                    code: newCode
                }).catch((error) => {
                    console.error("Failed to write code to Firebase:", error);
                });
            }
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
                    update(sessionRef, {
                        code: importedCode
                    })
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

        if (sessionId) {
            update(sessionRef, {
                language: newLanguage
            })
                .catch((error) => {
                    console.error("Failed to write language to Firebase:", error);
                });
        }
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

    const onStartNewCollaborationClick = () => {
        onStartNewCollaboration(codeRef.current, language);
    };

    const handleEditClick = () => {
        setNewTitleText(templateName);
        setIsEditingTitle(true);
    };

    const handleTitleInputChange = (e) => {
        setNewTitleText(e.target.value);
    };

    const saveTitle = () => {
        if (newTitleText.trim() && fileId && folderId) {
            editFileTitle(newTitleText.trim(), folderId, fileId);
            setIsEditingTitle(false);
        } else {
            alert("Title cannot be empty!");
            setIsEditingTitle(false);
        }
    };

    const handleTitleInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            saveTitle();
        }
    };

    const handleTitleInputBlur = () => {
        saveTitle();
    };

    const saveSessionAsNewTemplate = () => {
        if (sessionId) {
            if (!codeRef.current || codeRef.current.trim() === '') {
                alert("There is no code in the session to save.");
                return;
            }

            const templateTitle = prompt("Enter a name for the new template:");

            if (templateTitle && templateTitle.trim()) {
                const folderName = prompt(`Enter a name for the folder (a new folder with "${templateTitle}" will be created inside):`, "Saved Sessions");

                if (folderName && folderName.trim()) {
                    createNewProject({
                        folderName: folderName.trim(),
                        templateName: templateTitle.trim(),
                        language: language,
                    }, codeRef.current);

                    alert(`Session saved as a new template "${templateTitle.trim()}" in folder "${folderName.trim()}"!`);
                } else {
                    alert("Folder name cannot be empty. Save cancelled.");
                }
            } else {
                alert("Template name cannot be empty. Save cancelled.");
            }
        } else {
            alert("You are not in a collaborative session.");
        }
    };

    return (
        <div ref={containerRef} className={`root-editor-container ${isFullScreen ? 'fullscreen' : ''}`}>
            <div className='editor-header'>
                <div className='editor-left-container'>
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={newTitleText}
                            onChange={handleTitleInputChange}
                            onKeyDown={handleTitleInputKeyPress}
                            onBlur={handleTitleInputBlur}
                            autoFocus
                            className="title-input"
                        />
                    ) : (
                        <>
                            <b className='title'>{templateName}</b>
                            {!sessionId && (
                                <span onClick={handleEditClick} style={{ cursor: 'pointer', marginLeft: '5px' }}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </span>
                            )}
                        </>
                    )}

                    {!sessionId && (
                        <button onClick={onSaveCode}>Save Code</button>
                    )}

                    <button onClick={onStartNewCollaborationClick}>Start New Collaboration</button>

                    {sessionId && (
                        <button onClick={saveSessionAsNewTemplate}>Save Session As New Template</button>
                    )}
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
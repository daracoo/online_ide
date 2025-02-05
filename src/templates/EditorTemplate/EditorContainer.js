import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faEdit,
    faUpRightAndDownLeftFromCenter,
    faFileImport,
    faDownload,
    faPlay
} from '@fortawesome/free-solid-svg-icons';
import './EditorContainer.scss'
import {Editor} from '@monaco-editor/react';
import {useRef, useState} from "react";

const editorOptions = {
    fontSize: 18,
    wordWrap: 'on'
}

const fileExtensionMapping = {
    cpp: 'cpp',
    javascript: 'js',
    python: 'py',
    java: 'java',
}

export const EditorContainer = () => {
    const [code, setCode] = useState();
    const [language, setLanguage] = useState("cpp");
    const [theme, setTheme] = useState('vs-dark');
    const codeRef = useRef()


    const onChangeCode = (newCode) => {
        codeRef.current = newCode;
    }

    const importCode = (event) => {
        const file = event.target.files[0];
        const fileType = file.type.includes("text");
        if (fileType) {
            const fileReader = new FileReader();
            fileReader.readAsText(file)
            fileReader.onload = function (value) {
                const importedCode = value.target.result;
                setCode(importedCode)
                codeRef.current = importedCode;
            }
        } else {
            alert("Please choose a program file!");
        }
    }

    const exportCode = () => {
        const codeValue = codeRef.current?.trim();

        if (!codeValue) {
            alert("Please type some code in the editor before exporting!")
        }
            // креирам blob за инстант file во меморија
            const codeBlob = new Blob([codeValue], {type: "text/plain"})

            // линк за симнување со blob дата
            const downloadUrl = URL.createObjectURL(codeBlob)

            // креирам линк за симнување на фајлот :DDDD
            const link = document.createElement("a");
            link.href = downloadUrl;
            // const fileExtension =
            link.download = `code.${fileExtensionMapping[language]}`
            link.click()



    }

    const onChangeLanguage = (e) => {
        setLanguage(e.target.value)
    }

    const onChangeTheme = (e) => {
        setTheme(e.target.value);
    }

    return (
        <div className="root-editor-container">
            <div className='editor-header'>
                <div className='editor-left-container'>
                    <b className='title'>{"Title"}</b>
                    <span><FontAwesomeIcon icon={faEdit}/></span>
                    <button>Save Code</button>
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
                <Editor height={"100%"}
                        language={language}
                        options={editorOptions}
                        theme={theme}
                        onChange={onChangeCode}
                        value={code}
                />
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
                <input type='file' id='import-code' style={{display: 'none'}} onChange={importCode}></input>
                <button className='btn' onClick={exportCode}>
                    <span><FontAwesomeIcon icon={faDownload}/></span>
                    <span>Export Code</span>
                </button>
                <button className='btn'>
                    <span><FontAwesomeIcon icon={faPlay}/></span>
                    <span>Run Code</span>
                </button>
            </div>
        </div>
    );
}
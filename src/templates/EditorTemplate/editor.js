import {useParams} from "react-router-dom";
import "./style.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileImport, faDownload} from '@fortawesome/free-solid-svg-icons';
import {EditorContainer} from "./EditorContainer";
import {useState} from "react";

export const EditorTemplate = () => {
    const params = useParams();
    console.log(params);


    
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')

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
        }
    }


    return (
        <div className="page-container">
            <div className="header-container">
                <img src="https://i.ibb.co/P4763KY/Code-Editor-3.png" className="logo" alt="logo"></img>
            </div>
            <div className="content-container">
                <div className="editor-container">
                    <EditorContainer fileId={fileId}/>
                </div>
                <div className="input-output-container">
                    <div className="input-header">
                        <b>Input: </b>
                        <label htmlFor="input" className="icon-container">
                            <span><FontAwesomeIcon icon={faFileImport}/></span>
                            <b className="">Import Input</b>
                        </label>
                        <input type="file" id="input" style={{display: 'none'}} onChange={importInput}></input>
                    </div>
                    <textarea value={input} onChange={ (e) => setInput(e.target.value)}> </textarea>
                </div>
                <div className="input-output-container">
                    <div className="input-header">
                        <b>Output: </b>
                        <button className="icon-container" onClick={exportOutput}>
                            <span><FontAwesomeIcon icon={faDownload}/></span>
                            <b>Export Output</b>
                        </button>
                    </div>
                    <textarea readOnly value={output} onChange={(e) => setOutput(e.target.value)}></textarea>
                </div>
            </div>
        </div>
    )
}
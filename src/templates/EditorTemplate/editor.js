import { useParams } from "react-router-dom";
import "./style.scss";

export const EditorTemplate = () => {
    const params = useParams();
    console.log(params);
    return (
        <div className="page-container">
            <div className="header-container">
                <img src="https://i.ibb.co/P4763KY/Code-Editor-3.png" className="logo"></img>
            </div>
            <div className="content-container">
                <div className="editor-container">Editor container</div>
                <div className="input-container">Input container</div>
                <div className="output-container">Output container</div>
            </div>
        </div>
    )
}
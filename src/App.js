import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomeTemplate } from "./templates/HomeTemplate/";
import { EditorTemplate } from "./templates/EditorTemplate/editor";
import { ProjectProvider } from "./Providers/ProjectProvider";
import { ModalProvider } from "./Providers/ModalProvider";


function App() {
  return (
    <ProjectProvider>
      <ModalProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeTemplate />} />
            <Route path="/editor/:fileId/:folderId" element={<EditorTemplate />} />
          </Routes>
        </BrowserRouter>
      </ModalProvider>
    </ProjectProvider>
  );
}
export default App;

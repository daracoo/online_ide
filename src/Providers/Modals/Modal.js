import { useContext } from "react"
import { modalConstants, ModalContext } from "../ModalProvider"
import { CreateProjectModal } from "./createProjectModal"
import { CreateFolderModal } from "./createFolderModal"

export const Modal = () => {
    const modalFeatures = useContext(ModalContext)

    return <>
    {modalFeatures.activeModal === modalConstants.CREATE_PROJECT && <CreateProjectModal/>}
    {modalFeatures.activeModal === modalConstants.CREATE_FOLDER && <CreateFolderModal/>}
    </>
}
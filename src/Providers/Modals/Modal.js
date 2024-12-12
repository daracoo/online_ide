import { useContext } from "react"
import { modalConstants, ModalContext } from "../ModalProvider"
import { CreateProjectModal } from "./createProjectModal"
import { CreateFolderModal } from "./createFolderModal"
import { UpdateFolderTitleModal } from "./updateFolderTitleModal"

export const Modal = () => {
    const modalFeatures = useContext(ModalContext)

    return <>
    {modalFeatures.activeModal === modalConstants.CREATE_PROJECT && <CreateProjectModal/>}
    {modalFeatures.activeModal === modalConstants.CREATE_FOLDER && <CreateFolderModal/>}
    {modalFeatures.activeModal === modalConstants.UPDATE_FOLDER_TITLE && <UpdateFolderTitleModal/>}
    </>
}
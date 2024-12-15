import { useContext } from "react"
import { modalConstants, ModalContext } from "../ModalProvider"
import { CreateProjectModal } from "./createProjectModal"
import { CreateFolderModal } from "./createFolderModal"
import { UpdateFolderTitleModal } from "./updateFolderTitleModal"
import { UpdateFileTitleModal } from "./updateFileTitleModal"
import { CreateCardModal } from "./createCardModal"

export const Modal = () => {
    const modalFeatures = useContext(ModalContext)

    return <>
    {modalFeatures.activeModal === modalConstants.CREATE_PROJECT && <CreateProjectModal/>}
    {modalFeatures.activeModal === modalConstants.CREATE_FOLDER && <CreateFolderModal/>}
    {modalFeatures.activeModal === modalConstants.UPDATE_FOLDER_TITLE && <UpdateFolderTitleModal/>}
    {modalFeatures.activeModal === modalConstants.UPDATE_FILE_TITLE && <UpdateFileTitleModal/>}
    {modalFeatures.activeModal === modalConstants.CREATE_CARD && <CreateCardModal/>}
    </>
}
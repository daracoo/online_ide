import { useContext } from "react"
import { ModalContext } from "../ModalProvider"
import { CreateProjectModal } from "./createProjectModal"

export const Modal = () => {
    const modalFeatures = useContext(ModalContext)

    return <>
    {modalFeatures.activeModal === "CREATE_PROJECT" && <CreateProjectModal/>}
    </>
}
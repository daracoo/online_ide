 import { createContext, useContext, useState } from "react";
//  import {CreateProjectModal} from "./Modals/createProjectModal"

export const ModalContext = createContext();

export const modalConstants = {
    CREATE_PROJECT: 'CREATE_PROJECT',
    CREATE_FOLDER: 'CREATE_FOLDER',
    UPDATE_FOLDER_TITLE: 'UPDATE_FOLDER_TITLE',
    UPDATE_FILE_TITLE: 'UPDATE_FILE_TITLE',
    CREATE_CARD: 'CREATE_CARD',
}

export const ModalProvider = ({children}) => {
    
        const [modalType, setModalType] = useState(null);
        const [modalPayload, setModalPayload] = useState(null);
        const closeModal = () => {
            setModalType(null);
            setModalPayload(null);
        }
        const modalFeatures = {
            openModal: setModalType,
            closeModal,
            activeModal: modalType,
            modalPayload,
            setModalPayload
        }
        return (
       <ModalContext.Provider value={modalFeatures}>
            {children}
        
        </ModalContext.Provider>
    );
}
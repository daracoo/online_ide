 import { createContext, useContext, useState } from "react";
//  import {CreateProjectModal} from "./Modals/createProjectModal"

export const ModalContext = createContext();

export const modalConstants = {
    CREATE_PROJECT: 'CREATE_PROJECT',
    CREATE_FOLDER: 'CREATE_FOLDER'
}

export const ModalProvider = ({children}) => {
    
        const [modalType, setModalType] = useState(null);
        const closeModal = () => {
            setModalType(null);
        }
        const modalFeatures = {
            openModal: setModalType,
            closeModal,
            activeModal: modalType
        }
        return (
       <ModalContext.Provider value={modalFeatures}>
            {children}
        
        </ModalContext.Provider>
    );
}
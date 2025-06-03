import {createContext, useContext, useState} from "react";

export const CurrentContext = createContext()

export const useCurrentWorkspaceContext = () => {
    return useContext(CurrentContext)
}

export const CurrentContextProvider = ({ children }) => {
    const [workspace, setWorkspace] = useState(JSON.parse(localStorage.getItem('currentWorkspace')) || {})
    return <CurrentContext.Provider value={{workspace,setWorkspace}}>{children}</CurrentContext.Provider>
}
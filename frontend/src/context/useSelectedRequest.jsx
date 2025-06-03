import {createContext, useContext, useState} from "react";

export  const  SelectedRequestContext = createContext();

export const useSelectedRequestContext = () => {
    return useContext(SelectedRequestContext);
}
export  const SelectedRequestContextProvider = ({ children }) => {
    const [selectedRequests, setSelectedRequests] = useState(JSON.parse(localStorage.getItem("selectedRequests")) || []);
    console.log(selectedRequests)
    return <SelectedRequestContext.Provider value={{selectedRequests,setSelectedRequests}}>{children}</SelectedRequestContext.Provider>
}

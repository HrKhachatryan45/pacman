import {useAuthContext} from "../../context/useAuthContext.jsx";
import {useCurrentWorkspaceContext} from "../../context/useCurrentWorkspace.jsx";

const useSaveRequest = () => {
    const {setAuthUser} = useAuthContext()
    const {setWorkspace,workspace} = useCurrentWorkspaceContext()

    const saveRequest = async (requestId,requestData) => {
        const response = await fetch('/requests/save/request/'+requestId,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestData)
        });

        const json = await response.json();

        if (!response.ok){
            console.log(json.error)
        }else{
            console.log(json)
            const workspaceJSON = json.workspaces.find(work => work.id.toString() === workspace.id.toString())
            setAuthUser(json)
            localStorage.setItem("user", JSON.stringify(json));
            localStorage.setItem('currentWorkspace',JSON.stringify(workspaceJSON))
            setWorkspace(workspaceJSON);
        }

    }
    return {saveRequest}
}
export  default useSaveRequest;
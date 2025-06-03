import {useCurrentWorkspaceContext} from "../../context/useCurrentWorkspace.jsx";
import {useAuthContext} from "../../context/useAuthContext.jsx";
import js from "@eslint/js";

const useUpdateFolder = () => {
    const {workspace,setWorkspace} = useCurrentWorkspaceContext()
    const {setAuthUser} = useAuthContext()
    const updateFolder = async (folderId,folderName) => {
        const response = await fetch(`/requests/update/folder/${folderId}`,{
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({folderName})
        })
        const json = await response.json();
        console.log(json)
        if (!response.ok){
            console.log(json.error)
        }else {
            const workspaceJSON = json.workspaces.find(work => work.id.toString() === workspace.id.toString())
            setAuthUser(json)
            localStorage.setItem("user", JSON.stringify(json));
            localStorage.setItem('currentWorkspace',JSON.stringify(workspaceJSON))
            setWorkspace(workspaceJSON);
        }
    }
    return {updateFolder}
}
export default useUpdateFolder;
import {useCurrentWorkspaceContext} from "../../context/useCurrentWorkspace.jsx";
import {useAuthContext} from "../../context/useAuthContext.jsx";

const useUpdateCollection = () => {
    const {workspace,setWorkspace} = useCurrentWorkspaceContext()
    const {setAuthUser} = useAuthContext()
    const updateCollection = async (collectionId,collectionName) => {
        const response = await fetch(`/requests/update/collection/${collectionId}`,{
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({collectionName})
        })
        const json = await response.json();
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
    return {updateCollection}
}
export default useUpdateCollection;
import {useAuthContext} from "../../context/useAuthContext.jsx";
import {useCurrentWorkspaceContext} from "../../context/useCurrentWorkspace.jsx";

const useCreateRequest = () => {
    const {setAuthUser} = useAuthContext();
    const {setWorkspace,workspace} = useCurrentWorkspaceContext()
    const createRequest = async (collectionId,folderId) => {
        try{
            const response = await fetch(`/requests/create/request/${collectionId}/${folderId}`,{
                method:"POST",
                headers:{"Content-Type":"application/json"}
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
        }catch(err){
            console.error(err);
        }

    }
    return {createRequest};
}
export default useCreateRequest;
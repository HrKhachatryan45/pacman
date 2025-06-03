import {useAuthContext} from "../../context/useAuthContext.jsx";
import {useCurrentWorkspaceContext} from "../../context/useCurrentWorkspace.jsx";

const useCreateFolder = () => {
    const {setAuthUser} = useAuthContext();
    const {setWorkspace,workspace} = useCurrentWorkspaceContext()
    const createFolder = async (collectionId) => {
        try{
            const response = await fetch(`/requests/create/folder/${collectionId}`,{
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
    return {createFolder};
}
export default useCreateFolder;
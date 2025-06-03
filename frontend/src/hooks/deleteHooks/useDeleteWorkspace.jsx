import {useCurrentWorkspaceContext} from "../../context/useCurrentWorkspace.jsx";
import {useAuthContext} from "../../context/useAuthContext.jsx";

const useDeleteWorkspace = () => {
    const {workspace,setWorkspace} = useCurrentWorkspaceContext()
    const {setAuthUser} = useAuthContext()
    const deleteWorkspace = async () => {
        try{
            const response = await fetch(`/requests/delete/workspace/${workspace.id}`,{
                method: "DELETE",
                headers:{"Content-Type":"application/json"}
            })

            const json = await response.json();

            if (!response.ok){
                console.log(json.error)
            }else{
                const workspaceJSON = json.workspaces.find(work => work.id.toString() === workspace.id.toString())
                setAuthUser(json)
                localStorage.setItem("user", JSON.stringify(json));
                localStorage.setItem('currentWorkspace',JSON.stringify(workspaceJSON))
                setWorkspace(workspaceJSON);
            }

        }catch(error){
            console.log(error)
        }
    }
    return {deleteWorkspace}
}
export  default useDeleteWorkspace;
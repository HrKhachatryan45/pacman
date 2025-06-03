import {useCurrentWorkspaceContext} from "../../context/useCurrentWorkspace.jsx";
import {useAuthContext} from "../../context/useAuthContext.jsx";
import {useSelectedRequestContext} from "../../context/useSelectedRequest.jsx";

const useUpdateRequest = () => {
    const {workspace,setWorkspace} = useCurrentWorkspaceContext()
    const {setAuthUser} = useAuthContext()
    const {selectedRequests,setSelectedRequests} = useSelectedRequestContext()
    const updateRequest = async (requestId,requestName,collectionId) => {
        const response = await fetch(`/requests/update/request/${requestId}`,{
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({requestName})
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
            let updatedRequest = workspace.collections.find(coll => coll.id === collectionId)?.requests?.find(req => req.id === requestId)
            console.log(updatedRequest,'ef')
            let req = selectedRequests?.find((req) => req.id.toString() === requestId.toString())
            console.log(req)
            if (req && Object.keys(req).length > 0) {
                setSelectedRequests((prev) => prev.map((req) => req.id === requestId ? updatedRequest:req ))
            }
        }
    }
    return {updateRequest}
}
export default useUpdateRequest;
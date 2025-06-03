import {useAuthContext} from "../../context/useAuthContext.jsx";
import {useState} from "react";
import {useCurrentWorkspaceContext} from "../../context/useCurrentWorkspace.jsx";
import {useSelectedRequestContext} from "../../context/useSelectedRequest.jsx";

const useLogout = () => {
    const {setAuthUser} = useAuthContext()
    const {setWorkspace} = useCurrentWorkspaceContext()
    const {setSelectedRequests} = useSelectedRequestContext()
    const [loading,setLoading] = useState(false);
    const logout =async () => {
        setLoading(true);
        try{
            await fetch('/auth/logout',{
                method: 'POST',
            })
            setAuthUser(null)
            localStorage.removeItem('user')
            setWorkspace({})
            localStorage.removeItem('currentWorkspace')
            localStorage.removeItem('selectedRequests')
            setSelectedRequests([])
        }catch (e) {
            console.log(e)
        }finally{
            setLoading(false);
        }
    }
    return {logout,loading};
}
export default useLogout;
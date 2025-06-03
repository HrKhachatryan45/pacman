import {useState} from "react";
import {useAuthContext} from "../../context/useAuthContext.jsx";

const useCreateWorkspace = () => {
    const [workspaceLoading, setWorkspaceLoading] = useState(false);
    const {setAuthUser} = useAuthContext();
    const createWorkspace = async (name) => {
        setWorkspaceLoading(true);
        try{
            const response = await fetch('/requests/create/workspace',{
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name})
            })
            const json = await response.json();

            if (!response.ok){
                console.log(json.error)
            }else {
                setAuthUser(json)
                localStorage.setItem("user", JSON.stringify(json));
            }
        }catch(err){
            console.error(err);
        }finally {
            setWorkspaceLoading(false);
        }

    }
    return {createWorkspace,workspaceLoading};
}
export default useCreateWorkspace;
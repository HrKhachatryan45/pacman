import {useAuthContext} from "../../context/useAuthContext.jsx";
import {useState} from "react";

const useLoginGoogle = () => {
    const {setAuthUser} = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const loginGoogle =async (token) => {
        setLoading(true);
        try{
            const response = await fetch('/auth/login/google', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({token}),
            });

            const json = await response.json();
            console.log(json);
            if (json.error){
                setError(json.error);
            }
            if (response.ok){
                localStorage.setItem('user', JSON.stringify(json));
                setAuthUser(json)

            }
        }catch (e) {
            console.log(e)
        }finally {
            setLoading(false);
        }
    }
    return {loginGoogle,loading,error}
}
export  default useLoginGoogle;
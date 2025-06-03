import {useAuthContext} from "../../context/useAuthContext.jsx";
import {useState} from "react";

const useRegisterGoogle = () => {
    const {setAuthUser} = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const registerGoogle =async (token) => {
        setLoading(true);
        try{
            const response = await fetch('/auth/register/google', {
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
    return {registerGoogle,loading,error}
}
export  default useRegisterGoogle;
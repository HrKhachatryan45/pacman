import {useAuthContext} from "../../context/useAuthContext.jsx";
import {useState} from "react";

const useLogin = () => {
    const {setAuthUser} = useAuthContext();
    const [error,setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const login = async (formdata) => {
        setLoading(true);
        try{
            const response = await fetch('/auth/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formdata),
            });

            const json = await response.json();
            console.log(json);
            if (json.error){
                setError(json.error);
                return
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
    return {login,loading,error}
}
export  default useLogin;
import {useState} from "react";

const useSendRequest = () => {
    const [data,setData] = useState({})
    const [loading, setLoading] = useState(false)
    const sendRequest = async (url,method,headers,body) => {
        setLoading(true)
        try {
            const response = await fetch('requests/send/request',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({url,method,headers,body})
            })
            const json = await response.json();


                setData(json)


        }catch(e){
            console.log(e)
        }finally {
            setLoading(false)
        }

    }
    return {sendRequest,data,loading}
}
export default useSendRequest;
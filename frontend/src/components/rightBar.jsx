import {useSelectedRequestContext} from "../context/useSelectedRequest.jsx";
import React, {useEffect, useState} from "react";
import {HiOutlineX} from "react-icons/hi";
import {LuSave} from "react-icons/lu";
import useSaveRequest from "../hooks/requests/useSaveRequest.jsx";
import {useAuthContext} from "../context/useAuthContext.jsx";
import {useCurrentWorkspaceContext} from "../context/useCurrentWorkspace.jsx";
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import useSendRequest from "../hooks/requests/useSendRequest.jsx";
import ReactCodeMirror from "@uiw/react-codemirror";

const RightBar = () => {

    const requestMethods = {
        GET: 'greenC',
        POST: 'yellowC',
        PUT: 'blueC',
        PATCH: 'violetC',
        DELETE: 'redC'
    };
    const {authUser,setAuthUser} = useAuthContext()


    const {selectedRequests,setSelectedRequests} = useSelectedRequestContext()
    console.log(selectedRequests.length)

     const [currentRequest,setCurrentRequest] =  useState(selectedRequests?.find((request) => request.current) || {})


    useEffect(() => {
        setCurrentRequest(selectedRequests?.find((request) => request.current) || {})
    }, [selectedRequests,setAuthUser,setSelectedRequests]);


    const handleSelect = (id) => {
        let requests = JSON.parse(localStorage.getItem('selectedRequests')) || [];
        requests = requests.map(request => {
            if (request.id === id){
                return ({ ...request, current: true })
            }else{
                return ({ ...request, current: false })
            }
        });
        localStorage.setItem('selectedRequests',JSON.stringify(requests))
        setSelectedRequests(requests)
    }

    const handleRemove = (id) => {
        let requests = JSON.parse(localStorage.getItem('selectedRequests')) || [];
        requests = requests.filter(request => request.id !== id);

        if (requests.length > 0){
            requests = requests.map((request,index) => ({
                    ...request,
                    current: index === requests.length - 1
                }))
        }

        localStorage.setItem('selectedRequests',JSON.stringify(requests))
        setSelectedRequests(requests)
    }

    const handleChangeMethod = (ev) => {
        let requests = JSON.parse(localStorage.getItem('selectedRequests')) || [];

            requests = requests.map(req =>
                req.id === currentRequest.id ? { ...req, current: true,method:ev.target.value } : req
            );

        localStorage.setItem('selectedRequests', JSON.stringify(requests));
        setSelectedRequests(requests);
    }

    const {saveRequest} = useSaveRequest()

    const handleSaveAll = async () => {
        try {
            const payload = currentRequest ;
            payload.headers = JSON.stringify(payload.headers);
            delete payload.current;
            delete payload.created_at;

            await saveRequest(payload.id, payload);

        }catch (e) {
            console.log(e)
        }
    }

    const handleChange =async (ev) => {
        const updatedRequest = {...currentRequest,url:ev.target.value}
        const newSelectedRequests = selectedRequests.map((request) => request.id === currentRequest.id ? updatedRequest:request)
        setSelectedRequests(newSelectedRequests)
        localStorage.setItem('selectedRequests',JSON.stringify(newSelectedRequests))
        setCurrentRequest(updatedRequest)
    }

    const {workspace,setWorkspace} = useCurrentWorkspaceContext();

    const getPath = (request) => {
        const wName = workspace.name
        const collectionName = workspace?.collections?.find((collection) => collection.id === request.collection_id)
        return `${wName}/${collectionName?.name}/${request.title}`
    }

    const [selectedSection,setSelectedSection] = useState('Params')

    const [arrOfTr,setArrOfTr] =useState( [])
    const [arrOfHeaders,setArrOfHeaders] =useState( [])


    useEffect(() => {
        const [_, search] = currentRequest.url?.split('?') || [];
        const params = new URLSearchParams(search || '');

        const someArr = [];

        for (const [key, value] of params.entries()) {
            someArr.push({ id: someArr.length, key, value });
        }



        // Always ensure at least one empty row exists
        if (someArr.length === 0 || someArr[someArr.length - 1].key !== '' || someArr[someArr.length - 1].value !== '') {
            someArr.push({ id: someArr.length, key: '', value: '' });
        }

        setArrOfTr(someArr);

    }, [currentRequest.url]);

    useEffect(() => {
        let someArr = [];

        const headers = { ...(currentRequest.headers || {}) };

        // Add Content-Type if it's missing
        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';

            const updatedRequest = { ...currentRequest, headers };
            setCurrentRequest(updatedRequest);

            const updatedRequests = selectedRequests.map((r) =>
                r.id === updatedRequest.id ? updatedRequest : r
            );

            setSelectedRequests(updatedRequests);
            localStorage.setItem('selectedRequests', JSON.stringify(updatedRequests));
        }

        // Convert headers object into array format for table display
        Object.entries(headers).forEach(([key, value], index) => {
            someArr.push({ id: index, key, value });
        });

        // Ensure empty row at end
        if (someArr.length === 0 || someArr[someArr.length - 1].key !== '' || someArr[someArr.length - 1].value !== '') {
            someArr.push({ id: someArr.length, key: '', value: '' });
        }

        setArrOfHeaders(someArr);
    }, [currentRequest.id]);


    const handleAddQuery = (ev,id) => {
      setArrOfTr((prev) => prev.map((tr) =>
          tr.id === id?{...tr,[ev.target.name]:ev.target.value}:tr
      ))
    }
    const handleAddQueryH = (ev,id) => {
        setArrOfHeaders((prev) => prev.map((tr) =>
            tr.id === id?{...tr,[ev.target.name]:ev.target.value}:tr
        ))
    }

    const handleAddKey = (id) => {
        const query = arrOfTr.find((tr) => tr.id === id)
        if (!query.key || !query.value) return;

        const [baseUrl, search] = currentRequest.url.split('?');
        const params = new URLSearchParams(search || '');

        if (params.has(query.key)) return; // prevent duplicate

        params.append(query.key, query.value);
        const updatedUrl = `${baseUrl}?${params.toString()}`;
        const updatedRequest = { ...currentRequest, url: updatedUrl };

        const newRequests = selectedRequests.map((r) =>
            r.id === updatedRequest.id ? updatedRequest : r
        );

        setCurrentRequest(updatedRequest);
        setSelectedRequests(newRequests);
        localStorage.setItem('selectedRequests', JSON.stringify(newRequests));

        const newId = arrOfTr.length > 0 ? Math.max(...arrOfTr.map(tr => tr.id)) + 1 : 1;
        setArrOfTr(prev => [...prev, { id: newId, key: '', value: '' }]);
    }

    const handleAddKeyH = (id) => {
        const header = arrOfHeaders.find((tr) => tr.id === id)
        if (!header.key || !header.value) return;

        const updatedHeaders = {...currentRequest.headers,[header.key]: header.value};

        const updatedRequest = { ...currentRequest, headers:updatedHeaders };

        const newRequests = selectedRequests.map((r) =>
            r.id === updatedRequest.id ? updatedRequest : r
        );

        setCurrentRequest(updatedRequest);
        setSelectedRequests(newRequests);
        localStorage.setItem('selectedRequests', JSON.stringify(newRequests));

        const newId = arrOfTr.length > 0 ? Math.max(...arrOfTr.map(tr => tr.id)) + 1 : 1;
        setArrOfHeaders(prev => [...prev, { id: newId, key: '', value: '' }]);
    }

    const handleRemoveKey = (tr) => {

        let queries = new URLSearchParams(currentRequest.url.split('?')[1])
        queries.delete(tr.key)
            let updatedUrl = currentRequest.url.split('?')[0] + (arrOfTr.length === 1 ? '': '?') + queries.toString()
        const updatedRequest = {...currentRequest,url:updatedUrl}

        const newRequests = selectedRequests.map((r) =>
            r.id === updatedRequest.id ? updatedRequest : r
        );

        setCurrentRequest(updatedRequest);
        setSelectedRequests(newRequests);
        localStorage.setItem('selectedRequests', JSON.stringify(newRequests));
        setArrOfTr((prev) => prev.filter(prev => prev.id !== tr.id))
    }

    const handleRemoveKeyH = (tr) => {
        const headers = {...currentRequest.headers}
        delete headers[tr.key]
        const updatedRequest = {...currentRequest,headers}

        const newRequests = selectedRequests.map((r) =>
            r.id === updatedRequest.id ? updatedRequest : r
        );

        setCurrentRequest(updatedRequest);
        setSelectedRequests(newRequests);
        localStorage.setItem('selectedRequests', JSON.stringify(newRequests));
        setArrOfHeaders((prev) => prev.filter(prev => prev.id !== tr.id))
    }

    const handleBody = (value) => {
        const updatedRequest = {...currentRequest,body:value};
        setCurrentRequest(updatedRequest);

        const newRequests = selectedRequests.map((req) =>req.id === currentRequest.id ? updatedRequest : req)

        setSelectedRequests(newRequests);
        localStorage.setItem('selectedRequests', JSON.stringify(newRequests));
    }
    const {sendRequest,data,loading} = useSendRequest()

    const handleSendRequest = async (ev) => {
        ev.preventDefault()


        let parsedBody = currentRequest.body ? JSON.parse(currentRequest.body) : {};
        await sendRequest(currentRequest.url,currentRequest.method,currentRequest.headers,parsedBody)
        console.log(data)
    }



    return (
        selectedRequests.length > 0? <div className={'w-full h-full flex  flex-col items-center justify-start'}>
            <section
                className={'w-full h-10 border-b-1 border-gray-500 flex overflow-x-auto overflow-y-hidden items-center justify-start'}>{selectedRequests.map((request, index) => (
                <div onClick={() => handleSelect(request.id)} key={request.id}
                     className={`w-[20%] h-full flex items-center relative  justify-center font-bold mr-2  ${selectedRequests.length - 1 === index ? '' : 'border-r-gray-500 border-r-1'}  ${request.current ? 'italic [border-bottom:3px_solid_red] mt-[2px]' : ''} `}>
                    <span className={`mr-2`} style={{color: `var(--color-${requestMethods[request.method]})`}}>  {request.method}</span>
                    {request.title}
                    <HiOutlineX onClick={(ev) => {
                        ev.stopPropagation()
                        handleRemove(request.id)
                    }} className={'absolute cursor-pointer top-2 right-2 text-white'}/>
                </div>
            ))}</section>
            <div className={'w-full h-fit flex items-center justify-between mt-1 px-4'}>
                <h2>{getPath(currentRequest)}</h2>
                <h3 className={'flex items-center justify-center cursor-pointer'} onClick={handleSaveAll}><LuSave
                    className={'mr-2'}/> Save</h3>
            </div>

            <form className={'w-full h-fit flex items-center justify-between mt-1 px-4'} onSubmit={handleSendRequest}>
                <section className={'w-[90%] h-[40px] flex items-center justify-center'}>
                    <select
                        className={`select select-bordered h-full w-[10%] rounded-tr-[0] rounded-br-[0] `}
                        style={{color: `var(--color-${requestMethods[currentRequest.method]})`}}
                        value={currentRequest.method}
                        onChange={handleChangeMethod}
                    >
                        <option value="GET" style={{color: `var(--color-${requestMethods['GET']})`}} >GET</option>
                        <option value="POST" style={{color: `var(--color-${requestMethods['POST']})`}} >POST</option>
                        <option value="PUT" style={{color: `var(--color-${requestMethods['PUT']})`}} >PUT</option>
                        <option value="PATCH" style={{color: `var(--color-${requestMethods['PATCH']})`}} >PATCH</option>
                        <option value="DELETE" style={{color: `var(--color-${requestMethods['DELETE']})`}}>DELETE
                        </option>
                    </select>
                    <input type={'text'} placeholder={'Enter your url'}
                           value={currentRequest.url ? currentRequest.url : ''} onChange={handleChange}
                           className={'input input-bordered h-full w-[90%] rounded-tl-[0] rounded-bl-[0]'}/>
                </section>
                <button className={'btn bg-cyanG w-[9%] h-[40px]  '}>
                    {!loading?'Send':<span className={'loading loading-bars loading-md'}></span>}
                </button>
            </form>

            <div className={'w-full h-[35%] border-b-1 border-gray-500 px-4'}>
                <section className={'w-full h-[10%]   flex items-center mt-2 justify-start'}>
                    <div className={`w-fit px-2 py-1 mr-2 font-rubik cursor-pointer ${selectedSection === 'Params'?'border-b-2 border-redC':''}`} onClick={() => setSelectedSection('Params')}>Params</div>
                    <div className={`w-fit px-2 py-1 mr-2 font-rubik cursor-pointer ${selectedSection === 'Headers'?'border-b-2 border-redC':''}`} onClick={() => setSelectedSection('Headers')}>Headers</div>
                    <div className={`w-fit px-2 py-1 mr-2 font-rubik cursor-pointer ${selectedSection === 'Body'?'border-b-2 border-redC':''}`} onClick={() => setSelectedSection('Body')}>Body</div>
                </section>
                {selectedSection === 'Params' && <div className={'w-full h-[90%] flex flex-col items-start justify-start pt-2 '}>
                    <h4>Query Params</h4>
                    <section className={'w-full h-full overflow-y-auto pb-5'}>
                        <table className={'w-full h-fit border-gray-500 border mt-2 '}>
                         <tbody>
                         <tr className={'border-1 border-gray-500 h-8'}>
                             <td className={'border-1 border-gray-500 w-[6%]'}></td>
                             <td className={'border-1 border-gray-500 pl-2'}>Key</td>
                             <td className={'border-1 border-gray-500 pl-2'}>Value</td>
                             <td className={'border-1 border-gray-500 w-[10%]'}></td>
                         </tr>
                         {arrOfTr.map((tr) => (
                             <tr className="border-1 border-gray-500 h-8" key={tr.id}>
                                 <td className="border border-gray-500 w-[6%]"></td>
                                 <td className="border border-gray-500 pl-2 ">
                                     <input
                                         type="text"
                                         value={tr.key}
                                         onChange={(ev) => handleAddQuery(ev, tr.id)}
                                         name={'key'}
                                         className="w-full text-white bg-transparent outline-none focus:outline-none border-none focus:ring-0"
                                         placeholder="Enter Key"
                                     />
                                 </td>
                                 <td className="border-1 border-gray-500 pl-2 ">
                                     <input
                                         type="text"
                                         value={tr.value}
                                         onChange={(ev) => handleAddQuery(ev, tr.id)}
                                         name={'value'}
                                         className="w-full text-white bg-transparent outline-none focus:outline-none border-none focus:ring-0"
                                         placeholder="Enter Value"
                                     />
                                 </td>
                                 <td className={' border-1 border-gray-500 w-[10%] '}>
                                     <div className="w-full flex items-center justify-center">
                                         {currentRequest?.url?.split('?')[1] && tr.key !== "" && tr.value !== '' && currentRequest.url.split('?')[1].includes(`${tr.key}=${tr.value}`) ?
                                             <button className="btn h-8"
                                                     onClick={() => handleRemoveKey(tr)}>Remove</button> :
                                             <button className="btn h-8"
                                                     onClick={() => handleAddKey(tr.id)}>Add</button>}
                                     </div>
                                 </td>
                             </tr>
                         ))}

                         </tbody>
                        </table>
                    </section>
                </div>}
                {selectedSection === "Body" && <div className={'w-full h-[90%] flex flex-col items-start justify-start pt-2 '}>
                    <CodeMirror
                        className={'w-full min-h-3 max-h-[90%] mt-2'}
                        value={currentRequest.body || "{}"}
                        height={'100%'}
                        theme={"dark"}
                        extensions={[json()]}
                        onChange={(value) => handleBody(value) }
                    />
                </div>}
                {selectedSection === 'Headers' && <div className={'w-full h-[90%] flex flex-col items-start justify-start pt-2 '}>
                    <h4>Request Headers</h4>
                    <section className={'w-full h-full overflow-y-auto pb-5'}>
                        <table className={'w-full h-fit border-gray-500 border mt-2 '}>
                           <tbody>
                           <tr className={'border-1 border-gray-500 h-8'}>
                               <td className={'border-1 border-gray-500 w-[6%]'}></td>
                               <td className={'border-1 border-gray-500 pl-2'}>Key</td>
                               <td className={'border-1 border-gray-500 pl-2'}>Value</td>
                               <td className={'border-1 border-gray-500 w-[10%]'}></td>
                           </tr>
                           {arrOfHeaders.map((tr) => (
                               <tr className="border-1 border-gray-500 h-8" key={tr.id}>
                                   <td className="border border-gray-500 w-[6%]"></td>
                                   <td className="border border-gray-500 pl-2 ">
                                       <input
                                           type="text"
                                           value={tr.key}
                                           onChange={(ev) => handleAddQueryH(ev, tr.id)}
                                           name={'key'}
                                           className="w-full text-white bg-transparent outline-none focus:outline-none border-none focus:ring-0"
                                           placeholder="Enter Key"
                                       />
                                   </td>
                                   <td className="border-1 border-gray-500 pl-2 ">
                                       <input
                                           type="text"
                                           value={tr.value}
                                           onChange={(ev) => handleAddQueryH(ev, tr.id)}
                                           name={'value'}
                                           className="w-full text-white bg-transparent outline-none focus:outline-none border-none focus:ring-0"
                                           placeholder="Enter Value"
                                       />
                                   </td>
                                   <td className={' border-1 border-gray-500 w-[10%] '}>
                                       <div className="w-full flex items-center justify-center">
                                           {currentRequest?.headers?.hasOwnProperty(tr.key) ?
                                               <button className="btn h-8"
                                                       onClick={() => handleRemoveKeyH(tr)}>Remove</button> :
                                               <button className="btn h-8"
                                                       onClick={() => handleAddKeyH(tr.id)}>Add</button>}
                                       </div>
                                   </td>
                               </tr>
                           ))}

                           </tbody>
                        </table>
                    </section>
                </div>}

            </div>
            <div className={'w-full h-[48%] border-b-1 border-gray-500'}>
                {data.status && <ul className={'w-full h-fit flex list-disc items-center justify-start py-1 px-3'}>
                    <li className={'ml-7'}>{data.status}</li>
                    <li className={'ml-7'}>{Math.round(data.time)} ms</li>
                </ul>}
                {typeof data.result === "object" && data.result && <ReactCodeMirror
                    value={JSON.stringify(data.result, null, 2)}
                    theme={'dark'}
                    className={'w-full max-h-[96%] overflow-y-auto'}
                />}
                {typeof data.result === 'string' &&
                    <div dangerouslySetInnerHTML={{__html: data.result}} className={'pl-5 pt-3'}></div>}

            </div>

        </div> : <div className={'flex flex-col items-center justify-center'}>
            <img src={'images/logo.png'}/>
            <h3 className={'font-logo text-[25px]'}>Start Making Requests Now</h3>
        </div>
    )
}
export default RightBar;
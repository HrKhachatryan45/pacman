import React, {useEffect, useRef, useState} from 'react';
import {BsThreeDots} from "react-icons/bs";
import useDeleteRequest from "../hooks/deleteHooks/useDeleteRequest.jsx";
import {useSelectedRequestContext} from "../context/useSelectedRequest.jsx";
import {useCurrentWorkspaceContext} from "../context/useCurrentWorkspace.jsx";
import useUpdateRequest from "../hooks/updateHooks/useUpdateRequest.jsx";
import {MdDownloadDone} from "react-icons/md";

function Request({request}) {
    const requestMethods = {
        GET: 'greenC',
        POST: 'yellowC',
        PUT: 'blueC',
        PATCH: 'violetC',
        DELETE: 'redC'
    };



    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef();

    const handleThreeDots = (ev) => {
        ev.stopPropagation();
        setOpenMenu(prev => !prev);
    }


    useEffect(() => {
        const handleMouseDown = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(false)
            }
        }
        document.addEventListener('mousedown', handleMouseDown)

        return () => {
            document.removeEventListener('mousedown', handleMouseDown)
        }
    }, []);


    const {deleteRequest} = useDeleteRequest()

    const {workspace,setWorkspace } = useCurrentWorkspaceContext()

    const handleRemoveRequest = async () => {
        try {
            await deleteRequest(request.id)
            let user = JSON.parse(localStorage.getItem('user'))
            let userWorkspace = user.workspaces?.find((userWork) => userWork.id === workspace.id)
            let collectionS =  userWorkspace?.collections.find((coll) => coll.id === request.collection_id)
            collectionS.requests = collectionS.requests.filter((reqX) => reqX.id !== request.id)
            userWorkspace.collections = userWorkspace.collections.map((collX) => collX.id === request.collection_id ? collectionS:collX)
            let realWorkspaces = user.workspaces.map((workspaceD) => workspaceD.id === workspace.id ? userWorkspace:workspaceD)

            localStorage.setItem('user',JSON.stringify({...user,workspaces:realWorkspaces}))

            let work = JSON.parse(localStorage.getItem('currentWorkspace'))
            work.collections = work.collections.map((coll) => coll.id === request.collection_id ? collectionS:coll)
            localStorage.setItem('currentWorkspace',JSON.stringify(work))
            setWorkspace(work)
            const updatedRequests = selectedRequests.filter((req) => req.id !== request.id)
            localStorage.setItem('selectedRequests',JSON.stringify(updatedRequests))
            setSelectedRequests(updatedRequests)
        }catch (e) {
            console.log(e)
        }
    }
    const {setSelectedRequests} = useSelectedRequestContext()

    const handleSelect = () => {
        let requests = JSON.parse(localStorage.getItem('selectedRequests')) || [];

        // Set all to current: false
        requests = requests.map(req => ({ ...req, current: false }));

        // Check if the request is already in the list
        const isInArray = requests.find(req => req.id === request.id);

        if (!isInArray) {
            requests.push({ ...request, current: true });
        } else {
            // If it exists, update its current status to true
            requests = requests.map(req =>
                req.id === request.id ? { ...req, current: true } : req
            );
        }

        localStorage.setItem('selectedRequests', JSON.stringify(requests));
        setSelectedRequests(requests);
    };



    const {selectedRequests} = useSelectedRequestContext()
    const currentRequest = selectedRequests.find(request => request.current)


    const [newName,setNewName] = useState(request.title)
    const [openRename,setOpenRename]=useState(false)
    const {updateRequest} = useUpdateRequest()
    const handleRename = async (ev) => {
        ev.stopPropagation()
        try {
            await updateRequest(request.id,newName,request.collection_id)
            setOpenRename(false)
        }catch (e) {
            console.log(e)
        }
    }


    return (
        <div className={'w-full'}>
            <h2 onClick={handleSelect}
                className={`w-full h-fit py-2 flex items-center justify-between pr-3 pl-20 w-full  font-rubik text-white hover:bg-darkGrey cursor-pointer  font-bold ${request.id === currentRequest?.id ? 'bg-darkGrey' : ''} `}>

               <div >
                   {!openRename && <span className={`mr-2 `} style={{color: `var(--color-${requestMethods[request.method]})`}}>  {request.method}</span>}
                   {openRename ? <div className={'w-full h-fit flex items-center jusify-between'}>
                       <input onClick={(ev) => ev.stopPropagation()} type={'text'} placeholder={'Enter New Name'} className={' w-[80%] border-b-1 border-gray-500 focus:outline-none'} value={newName}
                              onChange={(ev) => setNewName(ev.target.value)}/>
                       <MdDownloadDone onClick={handleRename} />
                   </div> : request.title}
               </div>
                <div className={'relative'}>
                    <BsThreeDots className={' cursor-pointer text-[20px] '} onClick={handleThreeDots}/>
                    {openMenu && <ul ref={menuRef}
                                     className={'w-[170px] h-fit px-2 py-3 left-0 rounded-[3px] border-1 bg-darkGrey border-gray-500  absolute z-[900] top-5'}
                                     onClick={(ev) => ev.stopPropagation()}>
                        <li onClick={handleRemoveRequest}
                            className={'font-rubik text-[12px] h-fit py-1 px-2 hover:bg-lightGrey'}>Remove
                            Request
                        </li>
                        <li onClick={() => setOpenRename(!openRename)} className={'font-rubik text-[12px] h-fit py-1 px-2 hover:bg-lightGrey'}>Rename
                            Request
                        </li>

                    </ul>}
                </div>
            </h2>
        </div>
    );
}

export default Request;
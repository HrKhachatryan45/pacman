import React, {useEffect, useRef, useState} from 'react';
import {FaAngleDown, FaAngleRight} from "react-icons/fa6";
import Request from "./Request.jsx";
import useCreateRequest from "../hooks/createHooks/useCreateRequest.jsx";
import useDeleteFolder from "../hooks/deleteHooks/useDeleteFolder.jsx";
import {BsThreeDots} from "react-icons/bs";
import {useCurrentWorkspaceContext} from "../context/useCurrentWorkspace.jsx";
import {useSelectedRequestContext} from "../context/useSelectedRequest.jsx";
import useUpdateCollection from "../hooks/updateHooks/useUpdateCollection.jsx";
import {MdDownloadDone} from "react-icons/md";
import useUpdateFolder from "../hooks/updateHooks/useUpdateFolder.jsx";

function Folder({folder,collection}) {
    const [openFolder, setOpenFolder] = useState(false);


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

    const {createRequest} =useCreateRequest()

    const handleAddRequest =async () => {
        try {
            setTimeout(() => {
                setOpenMenu(false)
            },1000)
            await createRequest(collection.id,folder.id)
            setOpenFolder(true)
        }catch (e) {
            console.log(e)
        }
    }
    const {deleteFolder} = useDeleteFolder()

    const {workspace,setWorkspace} = useCurrentWorkspaceContext()
    const {setSelectedRequests,selectedRequests} = useSelectedRequestContext()
    const handleRemoveFolder = async () => {
        try {
            await deleteFolder(folder.id,collection.id)
            let user = JSON.parse(localStorage.getItem('user'))
            let userWorkspace = user.workspaces?.find((userWork) => userWork.id === workspace.id)
            let collectionS =  userWorkspace?.collections.find((coll) => coll.id === collection.id)
            collectionS.folders = collectionS.folders.filter((folderX) => folderX.id !== folder.id)
            userWorkspace.collections = userWorkspace.collections.map((collX) => collX.id === collection.id ? collectionS:collX)
            let realWorkspaces = user.workspaces.map((workspaceD) => workspaceD.id === workspace.id ? userWorkspace:workspaceD)
            localStorage.setItem('user',JSON.stringify({...user,workspaces:realWorkspaces}))
            let work = JSON.parse(localStorage.getItem('currentWorkspace'))
                work.collections = work.collections.map((coll) => coll.id === collection.id ? collectionS:coll)
            localStorage.setItem('currentWorkspace',JSON.stringify(work))
            setWorkspace(work)
            const updatedRequests = selectedRequests.filter((req) => req.collection_id !== collection.id)
            localStorage.setItem('selectedRequests',JSON.stringify(updatedRequests))
            setSelectedRequests(updatedRequests)
        }catch (e) {
            console.log(e)
        }
    }


    const [newName,setNewName] = useState(folder.name)
    const [openRename,setOpenRename]=useState(false)
    const {updateFolder} = useUpdateFolder()
    const handleRename = async (ev) => {
        ev.stopPropagation()
        try {
            await updateFolder(folder.id,newName)
            setOpenRename(false)
        }catch (e) {
            console.log(e)
        }
    }



    return (
        <>
            <h2 onClick={() => setOpenFolder(!openFolder)}
                className={' w-full h-fit py-2 flex items-center justify-between pr-3 pl-12 w-full  font-rubik text-white hover:bg-darkGrey cursor-pointer  font-bold'}>
                <div className={'flex items-center justify-center'}>
                    {
                        openFolder ?
                            <FaAngleDown className={'mr-2'}/> : <FaAngleRight className={'mr-2'}/>}

                    {openRename ? <div className={'w-full h-fit flex items-center jusify-between'}>
                        <input onClick={(ev) => ev.stopPropagation()} type={'text'} placeholder={'Enter New Name'} className={'border-b-1 border-gray-500 focus:outline-none'} value={newName}
                               onChange={(ev) => setNewName(ev.target.value)}/>
                        <MdDownloadDone onClick={handleRename} />
                    </div> : folder.name}
                </div>

                    <div className={'relative'}>
                        <BsThreeDots className={' cursor-pointer text-[20px] '} onClick={handleThreeDots}/>
                        {openMenu && <ul ref={menuRef}
                                         className={'w-[170px] h-fit px-2 py-3 left-0 rounded-[3px] border-1 bg-darkGrey border-gray-500  absolute z-[900] top-5'}
                                         onClick={(ev) => ev.stopPropagation()}>
                            <li onClick={handleAddRequest}
                                className={'font-rubik text-[12px] h-fit py-1 px-2 hover:bg-lightGrey'}>Add
                                Request
                            </li>
                            <li onClick={handleRemoveFolder}
                                className={'font-rubik text-[12px] h-fit py-1 px-2 hover:bg-lightGrey'}>Remove
                                Folder
                            </li>
                            <li onClick={() => setOpenRename(!openRename)} className={'font-rubik text-[12px] h-fit py-1 px-2 hover:bg-lightGrey'}>Rename
                                Folder
                            </li>

                        </ul>}
                    </div>

            </h2>
            {openFolder && collection.requests.map((request, index) => (

                folder.id == request.folder_id && <Request key={index} request={request}/>
            ))}
        </>
    );
}

export default Folder;
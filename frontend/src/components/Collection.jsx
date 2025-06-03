import React, {useEffect, useRef, useState} from 'react';
import {FaAngleDown, FaAngleRight} from "react-icons/fa6";
import Folder from "./Folder.jsx";
import {BsThreeDots} from "react-icons/bs";
import useCreateCollection from "../hooks/createHooks/useCreateCollection.jsx";
import useDeleteWorkspace from "../hooks/deleteHooks/useDeleteWorkspace.jsx";
import useDeleteCollection from "../hooks/deleteHooks/useDeleteCollection.jsx";
import useCreateFolder from "../hooks/createHooks/useCreateFolder.jsx";
import {useCurrentWorkspaceContext} from "../context/useCurrentWorkspace.jsx";
import {useSelectedRequestContext} from "../context/useSelectedRequest.jsx";
import useUpdateWorkspace from "../hooks/updateHooks/useUpdateWorkspace.jsx";
import {MdDownloadDone} from "react-icons/md";
import useUpdateCollection from "../hooks/updateHooks/useUpdateCollection.jsx";

function Collection({collection}) {
    const [openCollection, setOpenCollection] = useState(false);

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

    const {createFolder} =useCreateFolder()

    const handleAddFolder =async () => {
        try {
            setTimeout(() => {
                setOpenMenu(false)
            },1000)
            await createFolder(collection.id)
            setOpenCollection(true)
        }catch (e) {
            console.log(e)
        }
    }
    const {deleteCollection} = useDeleteCollection()
    const {workspace,setWorkspace} = useCurrentWorkspaceContext()
    const {setSelectedRequests} = useSelectedRequestContext()

    const handleRemoveCollection = async () => {
        try {
            await deleteCollection(collection.id)
            let user = JSON.parse(localStorage.getItem('user'))
            let userWorkspace = user.workspaces?.find((userWork) => userWork.id === workspace.id)
            userWorkspace.collections = userWorkspace?.collections.filter((coll) => coll.id !== collection.id)
            let realWorkspaces = user.workspaces.map((workspaceD) => workspaceD.id === workspace.id ? userWorkspace:workspaceD)
            localStorage.setItem('user',JSON.stringify({...user,workspaces:realWorkspaces}))
            localStorage.removeItem('selectedRequests')
            let work = JSON.parse(localStorage.getItem('currentWorkspace'))
            work.collections = work.collections.filter((coll) => coll.id !== collection.id)
            localStorage.setItem('currentWorkspace',JSON.stringify(work))
            setWorkspace(work)
            setSelectedRequests([])



        }catch (e) {
            console.log(e)
        }
    }

    const [newName,setNewName] = useState(collection.name)
    const [openRename,setOpenRename]=useState(false)
    const {updateCollection} = useUpdateCollection()
    const handleRename = async (ev) => {
        ev.stopPropagation()
        try {
            await updateCollection(collection.id,newName)
            setOpenRename(false)
        }catch (e) {
            console.log(e)
        }
    }



    return (
        <>
            <h2 onClick={() => setOpenCollection(!openCollection)}
                className={' w-full h-fit py-2 flex  items-center justify-between  pl-8 pr-3 w-full  font-rubik text-white hover:bg-darkGrey cursor-pointer  font-bold'}>{
      <div className={'flex items-center justify-center'}>{openCollection ? <FaAngleDown className={'mr-2'}/> : <FaAngleRight className={'mr-2'}/>}
          {openRename ? <div className={'w-full h-fit flex items-center jusify-between'}>
              <input onClick={(ev) => ev.stopPropagation()} type={'text'} placeholder={'Enter New Name'} className={'border-b-1 border-gray-500 focus:outline-none'} value={newName}
                     onChange={(ev) => setNewName(ev.target.value)}/>
              <MdDownloadDone onClick={handleRename} />
          </div> : collection.name}</div>}
            <div className={'relative'}>
                <BsThreeDots className={' cursor-pointer text-[20px] '} onClick={handleThreeDots}/>
                {openMenu && <ul ref={menuRef}
                                 className={'w-[170px] h-fit px-2 py-3 left-0 rounded-[3px] border-1 bg-darkGrey border-gray-500  absolute z-[900] top-5'}
                                 onClick={(ev) => ev.stopPropagation()}>
                    <li onClick={handleAddFolder}
                        className={'font-rubik text-[12px] h-fit py-1 px-2 hover:bg-lightGrey'}>Add
                        Folder
                    </li>
                    <li onClick={handleRemoveCollection}
                        className={'font-rubik text-[12px] h-fit py-1 px-2 hover:bg-lightGrey'}>Remove
                        Collection
                    </li>
                    <li onClick={() => setOpenRename(!openRename)} className={'font-rubik text-[12px] h-fit py-1 px-2 hover:bg-lightGrey'}>Rename Collection
                    </li>

                </ul>}
            </div>
            </h2>

            {openCollection && collection.folders.map((folder, index) => (
                <Folder key={index} folder={folder} collection={collection}/>
            ))}
        </>
    );
}

export default Collection;
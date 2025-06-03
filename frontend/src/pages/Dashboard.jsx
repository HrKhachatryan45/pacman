import React, {useEffect, useRef, useState} from 'react';
import Navbar from "../components/Navbar.jsx";
import {useCurrentWorkspaceContext} from "../context/useCurrentWorkspace.jsx";
import {FaAngleDown, FaAngleRight} from "react-icons/fa6";
import Collection from "../components/Collection.jsx";
import {BsThreeDots} from "react-icons/bs";
import useCreateCollection from "../hooks/createHooks/useCreateCollection.jsx";
import useDeleteWorkspace from "../hooks/deleteHooks/useDeleteWorkspace.jsx";
import RightBar from "../components/rightBar.jsx";
import {useSelectedRequestContext} from "../context/useSelectedRequest.jsx";
import {MdDownloadDone} from "react-icons/md";
import useUpdateWorkspace from "../hooks/updateHooks/useUpdateWorkspace.jsx";

function Dashboard(props) {
    const {workspace,setWorkspace} = useCurrentWorkspaceContext()
    const [openWorkspace, setOpenWorkspace] = useState(true);
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

    const {createCollection} =useCreateCollection()

    const handleAddCollection =async () => {
        try {
            setTimeout(() => {
                setOpenMenu(false)
            },1000)
            await createCollection()
            setOpenWorkspace(true)
        }catch (e) {
            console.log(e)
        }
    }
    const {deleteWorkspace} = useDeleteWorkspace()
    const {selectedRequests,setSelectedRequests} = useSelectedRequestContext()

    const handleRemoveWorkspace = async () => {
        try {
            await deleteWorkspace()
            let user = JSON.parse(localStorage.getItem('user'))
            let userWorkspaces = user.workspaces.filter((work) => work.id !== workspace.id)
            localStorage.setItem('user',JSON.stringify({...user,workspaces:userWorkspaces}))
            localStorage.removeItem('currentWorkspace')
            localStorage.removeItem('selectedRequests')
            setWorkspace({})
            setSelectedRequests([])
        }catch (e) {
            console.log(e)
        }
    }

    const [newName,setNewName] = useState(workspace.name)
    const [openRename,setOpenRename]=useState(false)
    const {updateWorkspace} = useUpdateWorkspace()
    const handleRenameWorkspace = async (ev) => {
        ev.stopPropagation()
        try {
            await updateWorkspace(newName)
            setOpenRename(false)
        }catch (e) {
            console.log(e)
        }
    }


    return (
        <div>
            <div className={'w-full relative bg-white h-screen  flex flex-col items-center justify-start pt-[55px]'}>
                <Navbar/>
                <section className={'w-full h-[100%]  flex items-center justify-center'}>
                    <div className={'w-[20%] h-full bg-lightGrey border-r-1 border-gray-500' + (Object.keys(workspace).length > 0 ?'':' flex items-center justify-center' )}>
                        {Object.keys(workspace).length > 0 ? <>
                            <h2
                                onClick={() => setOpenWorkspace(!openWorkspace)}
                                className={' w-full h-fit py-2 flex items-center justify-between px-3 w-full  font-rubik  text-white hover:bg-darkGrey cursor-pointer  font-bold'}>
                                <div className={'flex items-center justify-center'}>{
                                    openWorkspace ?
                                    <FaAngleDown className={'mr-2'}/> :
                                    <FaAngleRight className={'mr-2'}/>}
                                    {openRename ? <div className={'w-full h-fit flex items-center jusify-between'}>
                                        <input onClick={(ev) => ev.stopPropagation()} type={'text'} placeholder={'Enter New Name'} className={'border-b-1 border-gray-500 focus:outline-none'} value={newName}
                                               onChange={(ev) => setNewName(ev.target.value)}/>
                                        <MdDownloadDone onClick={handleRenameWorkspace} />
                                    </div> : workspace.name}
                                </div>
                                <div className={'relative'}>
                                    <BsThreeDots className={' cursor-pointer text-[20px] '} onClick={handleThreeDots}/>
                                    {openMenu && <ul ref={menuRef}
                                                     className={'w-[170px] h-fit px-2 py-3 left-0 rounded-[3px] border-1 bg-darkGrey border-gray-500  absolute z-[900] top-5'}
                                                     onClick={(ev) => ev.stopPropagation()}>
                                        <li onClick={handleAddCollection}  className={'font-rubik text-[12px] h-fit py-1 px-2 hover:bg-lightGrey'}>Add
                                            Collection
                                        </li>
                                        <li onClick={handleRemoveWorkspace} className={'font-rubik text-[12px] h-fit py-1 px-2 hover:bg-lightGrey'}>Remove
                                            Workspace
                                        </li>
                                        <li onClick={() =>{
                                            setOpenRename(!openRename)
                                            setOpenMenu(false)
                                        }} className={'font-rubik text-[12px] h-fit py-1 px-2 hover:bg-lightGrey'}>Rename Workspace
                                        </li>

                                    </ul>}
                                </div>

                            </h2>
                                <div className={'w-full h-fit flex flex-col items-center justify-center '}>
                                    {openWorkspace && workspace?.collections?.map((collection) => (
                                        <Collection key={collection.id} collection={collection}/>
                                ))}
                            </div>
                        </>:
                            <h2 className={'text-white font-rubik text-[18px]'}>No Workspace Selected!</h2>
                        }
                    </div>
                    <div className={`w-[80%] h-full bg-darkGrey ${ selectedRequests.length > 0? 'flex flex-col items-center justify-start':'flex items-center justify-center'}`}>
                        <RightBar />
                    </div>
                </section>

            </div>
        </div>
    );
}

export default Dashboard;
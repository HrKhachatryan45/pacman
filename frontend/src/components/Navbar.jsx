import React, {useEffect, useRef, useState} from 'react';
import {Link} from "react-router-dom";
import {FaRegUser} from "react-icons/fa";
import {useAuthContext} from "../context/useAuthContext.jsx";
import useLogout from "../hooks/authHooks/useLogout.jsx";
import {IoIosArrowDown, IoIosLogOut} from "react-icons/io";
import useCreateWorkspace from "../hooks/createHooks/useCreateWorkspace.jsx";
import {useCurrentWorkspaceContext} from "../context/useCurrentWorkspace.jsx";
import {useSelectedRequestContext} from "../context/useSelectedRequest.jsx";

function Navbar(props) {
    const {authUser } = useAuthContext();
    const {logout,loading} = useLogout()

    const dropDownRef = useRef();

        useEffect(() => {
            function handleClickOutside(event) {
                if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                    setDropDownShow(false);
                }
            }

            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, []);

    const handleLogOut = async () => {
        await logout()
    }
    const [dropDownShow,setDropDownShow] = useState(false)
    const [createShow,setCreateShow] = useState(false)
    const [workspaceC,setWorkspaceC] = useState('')

    const {createWorkspace,workspaceLoading} = useCreateWorkspace()

    const handleCreateWorkSpace =async (ev) => {
            ev.preventDefault()
            await createWorkspace(workspaceC)
        setCreateShow(false)
        setWorkspaceC('')
    }
    const [searchQuery,setSearchQuery] = useState('')

    const filtered = authUser && authUser.workspaces.filter(workspace =>
        workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const {workspace,setWorkspace} = useCurrentWorkspaceContext()
    const {setSelectedRequests} = useSelectedRequestContext()

    const selectCurrent = async (workSpaceFromParams) => {
        localStorage.removeItem('selectedRequests');
        setSelectedRequests([])
        setWorkspace(workSpaceFromParams)
        localStorage.setItem('currentWorkspace',JSON.stringify(workSpaceFromParams))
        setDropDownShow(false)

    }



    return (
        <div className={'absolute top-0 left-0 text-white w-full h-14 bg-lightGrey border-b-1 border-gray-500 flex items-center justify-between px-7'}>
            <div className={'w-[40%] flex items-center justify-start'}>
                <section className={'h-full flex items-center mr-3 justify-center'}>
                    <img className={'w-[50px] h-[50px]'}
                         src={'images/logo.png'}/>
                    <h2 className={'text-[17px] font-logo font-normal'}>PACMAN</h2>
                </section>
                {authUser && <div className={'w-fit h-full flex items-center justify-center cursor-pointer relative'}>
                    <h2 className={'flex items-center justify-center text-[15px] '}
                        onClick={() => setDropDownShow(!dropDownShow)}>Workspaces <IoIosArrowDown
                        className={'ml-1'}/></h2>
                    {dropDownShow && <div ref={dropDownRef}
                        className={'w-[350px] z-[999] h-[500px] bg-[#212121] border-1 border-gray-500 rounded-[5px] absolute top-10 left-0 px-2 py-3 cursor-default'}>
                            <section className={'w-full h-fit flex items-center justify-between relative '}>
                                <input type={'text'} value={searchQuery} onChange={(ev) => setSearchQuery(ev.target.value)} className={'input input-bordered focus:outline-none  w-[48%]'} placeholder={'Search Workspace'}/>
                                <button className={'btn btn-md w-[48%] bg-cyanG'} onClick={() => setCreateShow(!createShow)} >Create Workspace</button>

                            </section>
                        {createShow && <form onSubmit={handleCreateWorkSpace}
                                             className={'w-[100%] h-[40px] mt-3  rounded-[5px]  bg-lightGrey  flex items-center justify-between'}>
                            <input type={'text'} value={workspaceC} onInput={(ev) => setWorkspaceC(ev.target.value)} placeholder={'Workspace name'} className={'input input-bordered focus:outline-none  w-[68%]'}/>
                            <button className={'w-[28%] btn bg-cyanG'}>{!workspaceLoading?"Create":<span className={'loading loading-spinner loading-md'}></span>}</button>
                        </form>}
                        <section className={'w-full h-[80%] overflow-auto  flex flex-col items-center justify-start px-5 mt-2 cursor-pointer'}>
                            {(authUser.workspaces.length > 0 && searchQuery === '') ? authUser.workspaces.map(workspace => (
                                <section
                                    onClick={() => selectCurrent(workspace)}
                                    className={'w-full h-fit border-b-1 py-2 text-white flex  items-center justify-start pl-3'}
                                    key={workspace.id}>
                                    <span>{workspace.name}</span>
                                </section>
                            )) : filtered.length > 0 ? filtered.map(workspace => (
                                <section
                                    onClick={() => selectCurrent(workspace)}
                                    className={'w-full h-fit border-b-1 py-2 text-white flex  items-center justify-start pl-3'}
                                    key={workspace.id}>
                                    <span>{workspace.name}</span>
                                </section>
                            )) : <section className="w-full h-full flex flex-col items-center justify-center">
                                <img src={'images/404.svg'} alt="No workspaces yet"/>
                                <h4 className="mt-2 font-rubik text-[15px]">No Workspaces {searchQuery === ''?'Yet':'Found'}</h4>
                            </section>}
                        </section>
                    </div>}
                </div>}
            </div>
            {!authUser ?
                <Link to={'/login'}>
                    <section className={'flex items-center justify-center h-full text-[20px]'}>
                        <FaRegUser/>
                        <h2 className={'ml-1 font-customOne font-normal '}>Login</h2>
                    </section>
                </Link> :
                <section className={'flex items-center justify-center h-full text-[20px]'}>
                    <img className={'w-10 h-10'} src={authUser.user.profileImage}/>
                    <h2 className={'ml-1 font-customOne font-normal mr-2'}>{authUser.user.name}</h2>
                    {loading ? <span className={'loading loading-spinner  loading-md'}></span> : <IoIosLogOut className={'cursor-pointer'} onClick={handleLogOut} />}

                </section>
            }
        </div>
    );
}

export default Navbar;
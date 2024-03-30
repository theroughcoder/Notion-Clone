import { Outlet } from "react-router-dom"
import { useState } from 'react'
import Header from '../component/header';
import Sidebar from "../component/sidebar";


const Layout = () => {

    const [open, setOpen] = useState(false);
    const [dark, setDark] = useState(true);

    return (
        <>
            <div className={dark && "dark" + " dark:bg-zinc-700 min-h-screen "}>
                <Sidebar open={open} setOpen={setOpen} setDark={setDark} dark={dark} />
                <div className=" sm:ml-64">
                    <Header setOpen={setOpen}/>
                    <Outlet />
                </div>
            </div>

        </>
    )
}

export default Layout;
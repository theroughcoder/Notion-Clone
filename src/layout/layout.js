import { Outlet } from "react-router-dom"
import { useContext, useState } from 'react'
import Header from '../component/header';
import Sidebar from "../component/sidebar";
import { ModeContext } from "../App";


const Layout = () => {
    const {dark} = useContext(ModeContext);

    const [open, setOpen] = useState(false);

    return (
        <>
            <div className={ dark && "dark "+" dark:bg-zinc-700 min-h-screen "}>
                <Sidebar open={open} setOpen={setOpen}  />
                <div className=" sm:ml-64">
                    <Header setOpen={setOpen}/>
                    <Outlet />
                </div>
            </div>

        </>
    )
}

export default Layout;
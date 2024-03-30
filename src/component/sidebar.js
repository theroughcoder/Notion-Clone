
import { Button, Stack, Switch } from "@mui/material";
import React, { useEffect } from "react"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { DeviceTabletIcon, HomeIcon, StarIcon } from "@heroicons/react/24/solid";
const label = { inputProps: { 'aria-label': 'Switch demo' } };

const Sidebar = ({ open, setOpen, dark, setDark }) => {

  function signoutHandler() {



    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      toast.success(`User has been logged out successfully`, {
        theme: "light",
      });
    }).catch((error) => {
      // An error happened.
    });

  }
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      } else{
        // console.log(user);
      }
    });

  }, [])
  return (
    <div className={` dark:bg-zinc-900 p-5 flex flex-col  z-10 fixed sm:left-0 transition-all duration-200 ease-in-out bg-gray-900 w-64 h-full  ${open ? "left-0" : "-left-64"}  `}>
      <Stack direction="row" spacing={1}   >
        <Button onClick={() => setOpen(false)} variant="outlined" color="secondary" sx={{ borderRadius: "20px" }}>
          Close
        </Button>
        <Button onClick={signoutHandler} variant="contained" color="secondary" sx={{ color: 'white', borderRadius: "20px" }}>
          Sign Out
        </Button>
      </Stack>
      <div className=" bg-slate-500 rounded my-5 flex justify-between items-center pr-5">

        <Switch {...label} defaultChecked checked={dark} onChange={(e) => setDark(e.target.checked)} />
        <span className="text-white">{dark ? "Dark Mode" : "Light Mode"}</span>
      </div>
      <div className="p-2 flex flex-col">

        <Link to="/" className=" text-slate-50 text-xl py-2 "> <div className="flex gap-3"><HomeIcon className="w-5 inline " /> <span>Home</span></div> </Link>
        <div className=" text-slate-50 text-xl   dark:border-t-zinc-800 py-2 " ><div className="flex gap-3"><StarIcon className="w-5 inline " /> <span>Favourite</span></div> </div>
        <Link to="/kanban-board" className=" text-slate-50 text-xl   dark:border-t-zinc-800 py-2 "><div className="flex gap-3"><DeviceTabletIcon className="w-5 inline " /> <span>Kanban Board</span></div></Link>
      </div>
    </div>
  )
};

export default Sidebar;

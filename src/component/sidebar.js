
import { Button, Stack, Switch } from "@mui/material";
import React from "react"
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";
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
  return (
    <div className={` dark:bg-zinc-900 p-5 flex flex-col  z-10 fixed sm:left-0 transition-all duration-200 ease-in-out bg-gray-900 w-64 h-full  ${open ? "left-0" : "-left-64"}  `}>
      <Stack direction="row" spacing={1}   >
        <Button onClick={()=> setOpen(false) } variant="outlined" color="secondary" sx={{ borderRadius: "20px" }}>
          Close
        </Button>
        <Button onClick={signoutHandler} variant="contained" color="secondary" sx={{ color: 'white', borderRadius: "20px" }}>
          Sign Out
        </Button>
      </Stack>
      <div className=" bg-slate-500 rounded my-5 flex justify-between items-center pr-5">

      <Switch {...label} defaultChecked  checked={dark} onChange={(e)=> setDark( e.target.checked)}/>
      <span className="text-white">{dark ? "Dark Mode"  :  "Light Mode"}</span>
      </div>
    </div>
  )
};

export default Sidebar;

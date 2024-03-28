
import React, { useEffect, useState } from "react"
// import "./style.css"
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Stack, Tab, Tabs, } from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Bars3Icon, BeakerIcon, SparklesIcon, UserCircleIcon, UserIcon } from '@heroicons/react/24/solid'

const navbarItems = [
  { label: "Home", path: "/" },
  { label: "Hindi", path: "/feed" },
  
]

const Header = (props) => {


  const navigate = useNavigate();
  const path = useLocation();
  // console.log(path)
  const [value, setValue] = React.useState(path.pathname);
  const [userInfo, setUserInfo] = React.useState(null);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  
  const navigateHandle = (path) => {
    navigate('/');
  }
  
  useEffect(() => {
    
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserInfo(user);
     
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
    
 

  }, [])


  return (
    <header >
      <div className=" dark:bg-zinc-800 flex bg-gray-800 h-14 items-center px-5">

        {/* this is the logo of the website  */}
        <a onClick={() => props.setOpen((e) => !e)}>
        <Bars3Icon className="h-10 w-10 text-gray-400 sm:hidden mr-5" />
 
        </a>

          {/* <img id="logo" src="./logo.png" /> */}
          <SparklesIcon className="h-8 w-10 text-gray-400  mr-5" />
        {/* this is search box */} 


        {/* this is profile pic */}
        <div className="flex-1 flex justify-end items-center gap-5" >
         
            <span className=" text-stone-100 text-xl ">
              {
                userInfo != null && userInfo.displayName
              }
            </span>
            <a id="profile-pic" href="#" className="rounded-s" data-bs-toggle="dropdown" aria-expanded="false">
              {
                userInfo && userInfo.photoURL != null ?

                <img src={ userInfo.photoURL.toString()} alt="mdo" width="42" height="42" className=" block rounded-md" /> :
                < UserCircleIcon className="h-10 w-10 text-gray-300  mr-5"/>
              }
            </a>

        </div>

      </div>
      {/* <div className=" bg-gray-300">
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          {
            navbarItems.map((e) => {
              return <Tab sx={{  width: "150px" }}
                key={e.path} onClick={() => navigateHandle(e.path)} value={e.path} label={e.label} />

            })
          }
        </Tabs>

      </div> */}
    </header>
  )
};

export default Header;

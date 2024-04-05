
import { Button, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, Stack, Switch, Tooltip } from "@mui/material";
import React, { useContext, useEffect, useState } from "react"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { CheckIcon, DeviceTabletIcon, EllipsisHorizontalIcon, HomeIcon, NewspaperIcon, PencilIcon, PlusIcon, ShareIcon, StarIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import firebaseConfig from "../firebaseConfig";
import { initializeApp } from "firebase/app";
import Menu from '@mui/material/Menu';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { ModeContext } from "../App";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const Sidebar = ({ open, setOpen,  }) => {
  
  const {dark, setDark} = useContext(ModeContext);
  const [pages, setPages] = useState([]);
  const [favourite, setfavourite] = useState([]);
  const [openPageMenu, setOpenPageMenu] = React.useState(false);
  const anchorRef = React.useRef(null);
  
  const [rename, setRename] = useState("");
  const [renameInput, setRenameInput] = useState(null);
  const [ shareLinkTooltip, setShareLinkTooltip] = useState(null);
  const label = { inputProps: { 'aria-label': 'Switch demo' } };
  
  
  const handleToggle = () => {
    setOpenPageMenu((prevOpen) => !prevOpen);
  };
  
  const handleClose = (event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target)
      ) {
        return;
      }
      
      setOpenPageMenu(false);
    };
    
    async function createPageHandler(model) {

    let pageFrame = {}
    if (model == "Kanban") {
      pageFrame = [
        {
          name: "Not started",
          tasks: [{
            task: "Running"
          }]
        },
        {
          name: "In Progress",
          tasks: [{
            task: "walking"
          }]
        },
        {
          name: "Done",
          tasks: [{
            task: "Drink"
          }]
        },
      ]
    } else {

      pageFrame = {
        title: "",
        des: ""
      }

    }
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, "pages"), { title: "Untitle Page", model, [model]: pageFrame });
    setPages((pre) => [...pre, { name: "Untitle Page", model, pid: docRef.id }])

    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user);

    if (user) {

      const uid = user.uid;
      const washingtonRef = doc(db, "users", uid);
      // Atomically add a new region to the "regions" array field.
      await updateDoc(washingtonRef, {
        pages: arrayUnion({ name: "Untitle Page", model, pid: docRef.id })
      });

      // console.log(user);

    }
  }

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
      } else {
        (async function () {

          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            let data = docSnap.data()
            setPages(data.pages || []);
            setfavourite(data.favourite || []);
          }

        }
        )()
      }
    })


  }, [])

  function renameHandle(obj, index) {

    pages[index].name = rename;

    setPages(pages);
    setRenameInput(null)
    setRename("");
    const user = auth.currentUser;

    // Create an initial document to update.
    const frankDocRef = doc(db, "users", user.uid);
    (async () => {
      await setDoc(frankDocRef, {
        pages
      })
    })();
  }
  function deletePage(i) {

    const user = auth.currentUser;
    const cityRef = doc(db, 'pages', pages[i].pid);

    // Remove the 'capital' field from the document
    (async () => {
      await deleteDoc(doc(db, "pages", pages[i].pid));

    })();
    let list = [...pages]

    list.splice(i, 1);

    setPages(list);

    // Create an initial document to update.
    const frankDocRef = doc(db, "users", user.uid);
    (async () => {
      await setDoc(frankDocRef, {
        pages: list
      })
    })();
  }

  async function favouriteHandle(ele) {
    if (favourite.find((e) => e.pid == ele.pid)) return
    setfavourite((pre) => [...pre, ele]);

    const auth = getAuth();
    const user = auth.currentUser;
    // Add a new document with a generated id.

    const washingtonRef = doc(db, "users", user.uid);

    // Set the "capital" field of the city 'DC'
    await updateDoc(washingtonRef, {
      favourite: [...favourite, ele]
    });
  }
  async function deleteFavouriteHandle(index) {

    let list = [...favourite];
    list.splice(index, 1);
    setfavourite(list);

    const auth = getAuth();
    const user = auth.currentUser;
    const washingtonRef = doc(db, "users", user.uid);

    // Set the "capital" field of the city 'DC'
    await updateDoc(washingtonRef, {
      favourite: list
    });
  }

  let dragItem = null;
  let dragOverItem = null;

  const dragStart = (e, position) => {
    dragItem = position;
    console.log(e.target.innerHTML);
  };

  const dragEnter = (e, position) => {
    dragOverItem = position;
    console.log("Enter", e.target.innerHTML);
  };

  const drop = async () => {
    // e.stopPropagation();
    console.log(dragItem, dragOverItem);
    let list = [...pages];
    let element = list[dragItem];

    list.splice(dragItem, 1);

    list.splice(dragOverItem, 0, element);

    setPages(list)
    const auth = getAuth();
    const user = auth.currentUser;
    // Add a new document with a generated id.

    const washingtonRef = doc(db, "users", user.uid);

    // Set the "capital" field of the city 'DC'
    await updateDoc(washingtonRef, {
      pages: list
    });

    dragItem = null;
    dragOverItem = null;

  }

  function shareLinkHandle(id, i) {
    if (window.location.hostname == "localhost") {

      console.log(`${window.location.hostname}:3000/share-readonly-page/${id}`);
      navigator.clipboard.writeText(`${window.location.hostname}:3000/share-readonly-page/${id}`);
    } else {

      console.log(`${window.location.hostname}/share-readonly-page/${id}`);
      navigator.clipboard.writeText(`${window.location.hostname}/share-readonly-page/${id}`);
    }

    setShareLinkTooltip(i);
    setTimeout(()=> setShareLinkTooltip(null), 2000);

  }

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

        <Switch  {...label} defaultChecked checked={dark} onChange={(e) => { setDark(e.target.checked); localStorage.setItem('darkMode', e.target.checked ) }} />
        <span className="text-white">{dark ? "Dark Mode" : "Light Mode"}</span>
      </div>
      <div className="p-2 flex flex-col">

        <Link to="/" className=" text-slate-50 text-xl py-1 "> <div className="flex gap-3"><HomeIcon className="w-5 inline " /> <span>Home</span></div> </Link>
        <div className=" text-slate-50 text-xl   dark:border-t-zinc-800 py-1 " ><div className="flex gap-3"><StarIcon className="w-5 inline " /> <span>Favourite</span></div> </div>
        <div className="w-full  max-h-32 overflow-auto">
          {
            favourite.map((e, i) => <div className="ml-4   " key={e.id}>


              <div className="  flex justify-between text-zinc-500 mt-0.5">
                <div onClick={() => { navigate(`/page/${e.model}/${e.pid}`) }} >{e.name}</div>

                <div className="flex gap-2 w-8" >

                  <TrashIcon className="w-5 h-5" onClick={() => deleteFavouriteHandle(i)} />
                </div>
              </div>


            </div>)
          }
        </div>
        <div className=" text-zinc-500 text-xl   dark:border-t-zinc-400 mt-5 " ><div className="flex gap-3"><span className=" text-sm">Workspace</span></div> </div>

        <div className=" flex items-center text-slate-50 text-xl   dark:border-t-zinc-800 py-1 mt-1 " ><div className="flex gap-3 flex-1"><NewspaperIcon className="w-5 inline " /> <span>Page</span></div>
          <div>
            <Button
              ref={anchorRef}
              id="composition-button"
              aria-controls={openPageMenu ? 'composition-menu' : undefined}
              aria-expanded={openPageMenu ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
            >
              <PlusIcon className="w-8" />
            </Button>
            <Popper
              open={openPageMenu}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom-start' ? 'left top' : 'left bottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                      // onKeyDown={handleListKeyDown}
                      >
                        <MenuItem onClick={(e) => { handleClose(e); createPageHandler("MDX") }}>MDX Page</MenuItem>
                        <MenuItem onClick={(e) => { handleClose(e); createPageHandler("Kanban") }}>Kanban Board</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
        </div>
        <div className="flex flex-col gap-1 max-h-32 overflow-auto">
          {
            pages.map((e, i) => <div draggable onDragStart={(e) => dragStart(e, i)} onDragEnter={(e) => dragEnter(e, i)} onDragEnd={(e) => drop(e)} className="ml-4 flex justify-between " key={e.id}>
              <div className="w-full">
              <Tooltip open={shareLinkTooltip == i}
                                   PopperProps={{
                                    disablePortal: true,
                                  }}
                                  disableFocusListener
                                  disableHoverListener
                                  disableTouchListener
                                  title="Link Copied">
                {
                  renameInput == i ? <div className=" bg-zinc-800 rounded">
                    <input onChange={(e) => setRename(e.target.value)} className="w-full bg-zinc-500 rounded" type="text" />
                    <div className="flex  justify-end gap-2 text-white">
                      <CheckIcon className="w-8" onClick={() => renameHandle(e, i)} />
                      <XMarkIcon className="w-8" onClick={() => { setRenameInput(null); setRename("") }} />
                    </div>
                  </div>
                    :
                    <div className="flex justify-between text-zinc-500 ">
                      <div onClick={() => { navigate(`/page/${e.model}/${e.pid}`) }} >{e.name}</div>

                      <div className="flex gap-2 w-8 h-6" >
                        <PopupState variant="popover" popupId="demo-popup-menu">
                          {(popupState) => (
                            <React.Fragment>
                              <EllipsisHorizontalIcon {...bindTrigger(popupState)} />

                              <Menu {...bindMenu(popupState)}>
                                <MenuItem onClick={() => { popupState.close(); favouriteHandle(e) }}> <StarIcon className="w-4 mr-2" /> Favourite</MenuItem>
                                <MenuItem onClick={() => { popupState.close(); setRenameInput(i) }}>  <PencilIcon className="w-4 mr-2" />Rename</MenuItem>
                                <MenuItem onClick={() => { popupState.close(); deletePage(i) }}> <TrashIcon className="w-4 mr-2" /> Delete</MenuItem>
                             
                                  <MenuItem onClick={() => { popupState.close(); shareLinkHandle(e.pid, i) }}> <ShareIcon className="w-4 mr-2" />  Share Link</MenuItem>

                              </Menu>
                            </React.Fragment>
                          )}
                        </PopupState>

                      </div>
                    </div>
                }
                </Tooltip>
              </div>

            </div>)
          }
        </div>
        {/* <Link to="/kanban-board" className=" text-slate-50 text-xl   dark:border-t-zinc-800 py-2 "><div className="flex gap-3"><DeviceTabletIcon className="w-5 inline " /> <span>Kanban Board</span></div></Link> */}
      </div>
    </div>
  )
};

export default Sidebar;


import React, { useEffect, useRef, useState } from "react"
import { Bars3Icon, CheckIcon, PencilIcon, PlusIcon, TrashIcon, XMarkIcon, } from '@heroicons/react/24/solid'
import firebase from "firebase/compat/app";
// Required for side-effects
import "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getDoc, getFirestore, serverTimestamp } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useParams } from "react-router-dom";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
// Your web app's Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyBuYRME1b5uoRa5tEPmKo3xxriY1RPiRdU",

    authDomain: "notion-clone-auth.firebaseapp.com",

    projectId: "notion-clone-auth",

    storageBucket: "notion-clone-auth.appspot.com",

    messagingSenderId: "432255897708",

    appId: "1:432255897708:web:34fbf9a98d97f511100849"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const taskFrame = {
    task: "",
    dueDate: "",
    type: "",
    priority: ""
}

const ShareReadOnlyPage = (props) => {
    const [createGroupForm, setCreateGroupForm] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [createTaskForm, setCreateTaskForm] = useState(null);
    const [taskObj, setTaskObj] = useState(taskFrame);
    const [editTaskForm, setEditTaskForm] = useState({});
    const [editTaskName, setEditTaskName] = useState("");


    const { id } = useParams();
    const [data, setdata] = useState(null);
    const auth = getAuth();


    useEffect(() => {

        // ...
        (async function () {

            const docRef = doc(db, "pages", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log(data);


                setdata(data)
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        })()



    }, [])









    return (
        <div className="p-5">
            <h1 className=" dark:text-zinc-400 text-2xl">Kanban Board</h1>


            {
                data && <div> {data.model == "Kanban" ?
                <div className="flex gap-5 overflow-auto ">
                        {data.Kanban && data.Kanban.map((item, index) => {
                            return (
                                <div
                                    key={index} className="flex-none  w-64 h-96 bg-slate-400 dark:bg-zinc-800 rounded-lg mt-5">
                                    <div className="dark:text-slate-400 text-xl p-2 text-center">{item.name}</div>
                                    <div className="p-2 flex flex-col gap-2">
                                        {
                                            item.tasks.map((e, i) => {
                                                return (

                                                    <div

                                                        key={e.task}
                                                        className="px-2 gap-2 flex border-slate-600 bg-slate-300 px-1 py-2 rounded-md"
                                                    >
                                                        <div className="flex-1 ">

                                                            <div>Task: {e.task}</div>
                                                            {e.dueDate && <div>Due Date: {e.dueDate}</div>}
                                                            {e.createdAt && <div>Created At:  {e.createdAt}</div>}
                                                            {e.updatedAt && <div>Updated At: {e.updatedAt}</div>}
                                                            {e.type && <div> Type: {e.type}</div>}
                                                            {e.priority && <div> Priority: {e.priority}</div>}
                                                            {e.status && <div> Status: {e.status}</div>}
                                                        </div>

                                                    </div>

                                                )
                                            })
                                        }

                                    </div>
                                </div>
                            )
                        })}
                    </div> :
                    <div className="p-5">
                        <h1 className=" dark:text-zinc-400 text-2xl">MDX Page</h1>
                        <div className="flex gap-5 overflow-auto mt-5 flex-col">

                            <div><input value={data.MDX.title} oncCh className=" text-slate-800 dark:text-zinc-200 text-5xl bg-transparent w-full  focus:outline-none" placeholder="Title of the page" /> </div>
                            {/* <div onClick={()=> setTitleCreateForm(true)} className="dark:text-zinc-400 text-5xl"> {title} </div> */}


                            <div><textarea value={data.MDX.des} className=" text-slate-800 dark:text-zinc-300 text-xl bg-transparent focus:outline-none w-full  h-64  max " placeholder="Description of the page" /> </div>
                            {/* <div onClick={()=> setDesCreateForm(true)} className="dark:text-zinc-400 text-xl"> {des} </div> */}


                        </div>
                    </div>
                }
                </div>

            }

        </div>
    );
};

export default ShareReadOnlyPage;


import React, { useEffect, useRef, useState } from "react"
import { Bars3Icon, CheckIcon, PencilIcon, PlusIcon, TrashIcon, XMarkIcon, } from '@heroicons/react/24/solid'
import TextInput from "../component/common/textInput";
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

const KanbanBoard = (props) => {
    const [createGroupForm, setCreateGroupForm] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [createTaskForm, setCreateTaskForm] = useState(null);
    const [taskObj, setTaskObj ] = useState(taskFrame);
    const [editTaskForm, setEditTaskForm] = useState({});
    const [editTaskName, setEditTaskName] = useState("");
    
    
    const {id } = useParams();
    const [group, setGroup] = useState([]);
    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                const uid = user.uid;
                user = uid;
                // ...
                (async function () {

                    const docRef = doc(db, "pages", id);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        console.log(data);
                        setGroup(data.Kanban || [])
                    } else {
                        // docSnap.data() will be undefined in this case
                        console.log("No such document!");
                    }
                })()
            } else {
                // User is signed out
                // ...
            }
        });

    }, [])
    let dragItemGroup = null;
    let dragOverItemGroup = null;
    let dragItem = null;
    let dragOverItem = null;
    let count = 0;

    const dragStart = (e, position, group) => {
        dragItem = position;
        dragItemGroup = group;
        console.log(e.target.innerHTML);
    };

    const dragEnter = (e, position) => {
        dragOverItem = position;
        count++;
        console.log("Enter", e.target.innerHTML);
    };
    const dragEnterForGroup = (e, position) => {
        dragOverItemGroup = position;
        dragOverItem = group[position].tasks.length;
        console.log("Enter", e.target.innerHTML);
    };

    const drop = (e) => {
        e.stopPropagation();
        console.log("see", e);

        let list = [...group];
        let element = list[dragItemGroup].tasks[dragItem];
        element.status = group[dragOverGroup].name

        console.log(dragItemGroup, dragOverItemGroup, dragItem, dragOverItem, null);

        list[dragItemGroup].tasks.splice(dragItem, 1);

        list[dragOverItemGroup].tasks.splice(dragOverItem, 0, element);

        setGroup(list);
        updateServer(list);
        dragItemGroup = null;
        dragOverItemGroup = null;
        dragItem = null;
        dragOverItem = null;
        console.log(group);

    }

    let dragGroup = null;
    let dragOverGroup = null;

    const groupDragStart = (e, position) => {
        dragGroup = position;
        console.log(e.target.innerHTML);
    };

    const groupDragEnter = (e, position) => {
        dragOverGroup = position;
        console.log("Enter", e.target.innerHTML);
    };
    const groupDrop = () => {
        let list = [...group];
        let temp = list[dragGroup];
        list.splice(dragGroup, 1);
        list.splice(dragOverGroup, 0, temp);

        setGroup(list);
        updateServer(list);


        dragGroup = null;
        dragOverGroup = null;
    }



    const addGroupHandle = (task) => {
        if (task == "") return;

        setGroupName("");

        group.push({
            name: task,
            tasks: []
        })
        setGroup(group);
        updateServer(group);
        
        setCreateGroupForm(false);
        
    }
    
    const addTaskHandle = (task, index) => {
        if (task == "") return;
        setTaskObj(taskFrame);

        let d = new Date;
        let date = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();

        group[index].tasks.push({
            ...task,
            createdAt: date,
            status: group[index].name,

        })
        setGroup(group);
        updateServer(group);
        setCreateTaskForm(null);
        
    }
    const editTaskHandle = (task, groupIndex, taskIndex, obj) => {
        if (task == "") return;
        
        setEditTaskName("");
        let d = new Date;
        let date = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();

        group[groupIndex].tasks[taskIndex] = {...obj, task, updatedAt: date};
        setGroup(group);
        updateServer(group);
        setEditTaskForm({})

    }
    const deleteTaskHandle = (groupIndex, taskIndex) => {
        console.log(groupIndex, taskIndex);

        let list = [...group];

        list[groupIndex].tasks.splice(taskIndex, 1);
        setGroup(list);
        updateServer(list);



    }

    

    function updateServer(group, task){

        
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
               
                // ...
                const washingtonRef = doc(db, "pages", id);

                
                
                (async function () {
                    
                    await updateDoc(washingtonRef, {
                        Kanban: group,
                    });
                })()
            } else {
                // User is signed out
                // ...
            }
        });
    }
        // Set the "capital" field of the city 'DC'
        // (async function () {

        //     await updateDoc(washingtonRef, {
        //     ...kanban, kanban : group
        //     });
        // })()

   



    return (
        <div className="p-5">
            <h1 className=" dark:text-zinc-400 text-2xl">Kanban Board</h1>
            <div className="flex gap-5  ">

                {
                    group.map((item, index) => {
                        return (
                            <div draggable
                                onDragStart={(e) => groupDragStart(e, index)}
                                onDragEnd={(e) => groupDrop()}
                                onDragEnter={(e) => { dragEnterForGroup(e, index); groupDragEnter(e, index) }}
                                key={index} className="flex-none overflow-auto  w-64   bg-slate-400 dark:bg-zinc-800 rounded-lg mt-5">
                                <div className="dark:text-slate-400 text-xl p-2 text-center">{item.name}</div>
                                <div className="p-2 flex flex-col gap-2 max-h-96 overflow-auto">
                                    {
                                        item.tasks.map((e, i) => {
                                            return (
                                                (editTaskForm.group == index && editTaskForm.task == i) ? <div key={e.task}  className="p-2 flex flex-col gap-1 dark:bg-zinc-900 bg-slate-800 rounded">
                                                    <input value={editTaskName} onChange={(e) => setEditTaskName(e.target.value)} type="text" className="h-10 rounded p-2 dark:bg-zinc-600 dark:text-slate-100" placeholder="Task name" />
                                                    <div className="flex  justify-end gap-2 text-white">
                                                        <CheckIcon className="w-8" onClick={() => editTaskHandle(editTaskName, index, i, e)} />
                                                        <XMarkIcon className="w-8" onClick={() => { setEditTaskForm({}); setEditTaskName("") }} />
                                                    </div>

                                                </div> :
                                                    <div

                                                        onDragStart={(e) => {
                                                            dragStart(e, i, index)
                                                        }
                                                        }
                                                        onDragOver={(e) => {
                                                            dragEnter(e, i)
                                                        }
                                                        }
                                                        onDragEnd={drop}
                                                        draggable key={e.task} 
                                                        className="px-2 gap-2 flex border-slate-600 bg-slate-300 px-1 py-2 rounded-md"
                                                      >
                                                        <div className="flex-1 ">

                                                           <div>Task: {e.task}</div> 
                                                           {e.dueDate && <div>Due Date: {e.dueDate}</div> }
                                                           {e.createdAt && <div>Created At:  {e.createdAt  }</div> }
                                                           {e.updatedAt && <div>Updated At: {e.updatedAt  }</div> }
                                                           {e.type && <div> Type: {e.type  }</div> }
                                                           {e.priority && <div> Priority: {e.priority  }</div> }
                                                           {e.status && <div> Status: {e.status  }</div> }
                                                        </div>
                                                        <div className="w-5" onClick={() => { setEditTaskForm({ group: index, task: i }); setEditTaskName(e.task) }}>
                                                            <PencilIcon />
                                                        </div>
                                                        <div className="w-5" onClick={() => { deleteTaskHandle(index, i) }} >
                                                            <TrashIcon />
                                                        </div>
                                                    </div>

                                            )
                                        })
                                    }
                                    {
                                        (createTaskForm == index) ?
                                            <div className="p-2 flex flex-col gap-1 dark:bg-zinc-900 bg-slate-900 rounded-lg">
                                                <label>Due Date</label>
                                                <input type="date"value={taskObj.dueDate} onChange={(e) => setTaskObj( (pre) => { return{ ...pre, dueDate : e.target.value}} )}   className="h-10 rounded p-2 dark:bg-zinc-600 dark:text-slate-100" placeholder="Task Due date" />
                                                <input value={taskObj.task} onChange={(e) => setTaskObj( (pre) => { return{ ...pre, task : e.target.value}} )} type="text" className="h-10 rounded p-2 dark:bg-zinc-600 dark:text-slate-100" placeholder="Task name" />
                                                <input value={taskObj.type} onChange={(e) => setTaskObj( (pre) => { return{ ...pre, type : e.target.value}} )} type="text" className="h-10 rounded p-2 dark:bg-zinc-600 dark:text-slate-100" placeholder="Task type" />
                                                <input value={taskObj.priority} onChange={(e) => setTaskObj( (pre) => { return{ ...pre, priority : e.target.value}} )} type="text" className="h-10 rounded p-2 dark:bg-zinc-600 dark:text-slate-100" placeholder="Task Priority" />
                                                <div className="flex  justify-end gap-2 text-white">
                                                    <CheckIcon className="w-8" onClick={() => addTaskHandle(taskObj, index)} />
                                                    <XMarkIcon className="w-8" onClick={() => { setCreateTaskForm(null); setTaskObj(taskFrame) }} />
                                                </div>

                                            </div>

                                            :
                                            <div onClick={() => setCreateTaskForm(index)} className=" h-10 border-slate-600 dark:bg-zinc-600 bg-slate-800 text-white  px-1 py-2 rounded-md flex justify-center gap-2">
                                                {/* <PlusIcon /> */}
                                                <span>Create New Task</span>
                                            </div>
                                    }
                                </div>
                            </div>
                        )
                    })

                }{

                    createGroupForm ? <div className="flex-none w-60 h-28 bg-slate-400 dark:bg-zinc-800 rounded-lg mt-5">
                        <div className="dark:text-slate-400 text-xl p-2 text-center"></div>
                        <div className="p-2 flex flex-col gap-1">
                            <input value={groupName} onChange={(e) => setGroupName(e.target.value)} type="text" className="h-10 rounded p-2 dark:bg-zinc-600 dark:text-slate-100" placeholder="Group name" />
                            <div className="flex  justify-end gap-2 text-white">
                                <CheckIcon className="w-8" onClick={() => addGroupHandle(groupName)} />
                                <XMarkIcon className="w-8" onClick={() => { setCreateGroupForm(false); setGroupName("") }} />
                            </div>

                        </div>
                    </div> : <div onClick={() => setCreateGroupForm(true)} className="flex-none w-10 h-10 bg-gray-300 mt-5 rounded p-1">
                        <PlusIcon />
                    </div>

                }

            </div>
        </div>
    );
};

export default KanbanBoard;

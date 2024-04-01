
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import firebaseConfig from "../firebaseConfig";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


const MDXPage = (props) => {
    const {id } = useParams();

    const [title, setTitle] = useState("");
    const [des, setDes] = useState("");

    let timeId = "";

    useEffect(()=> {
        clearTimeout(timeId);
        timeId = setTimeout(()=> {
            const washingtonRef = doc(db, "pages", id);
            
            
            
            (async function () {
                
                await updateDoc(washingtonRef, {
                    MDX: {
                        title,
                        des
                    },
                });
            })()
        }, 1000);

    }, [title, des])
    useEffect(()=> {
        (async function () {

            const docRef = doc(db, "pages", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log(data);
                setTitle( data.MDX.title )
                setDes( data.MDX.des )
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        })()

    }, [id])

    return (
        <div className="p-5">
            <h1 className=" dark:text-zinc-400 text-2xl">MDX Page</h1>
            <div className="flex gap-5 overflow-auto mt-5 flex-col">
                 
                     <div><input onChange={(e)=> setTitle(e.target.value)} value={title} oncCh className=" text-slate-800 dark:text-zinc-200 text-5xl bg-transparent w-full  focus:outline-none" placeholder="Title of the page"/> </div> 
                     {/* <div onClick={()=> setTitleCreateForm(true)} className="dark:text-zinc-400 text-5xl"> {title} </div> */}

               
                     <div><textarea  onChange={(e)=> setDes(e.target.value)} value={des} className=" text-slate-800 dark:text-zinc-300 text-xl bg-transparent focus:outline-none w-full  h-64  max " placeholder="Description of the page"/> </div> 
                      {/* <div onClick={()=> setDesCreateForm(true)} className="dark:text-zinc-400 text-xl"> {des} </div> */}

                 
            </div>
        </div>
    )
};

export default MDXPage;

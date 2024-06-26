
import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react"
import TextInput from "../component/common/textInput";
import PasswordInput from "../component/common/passwordInput";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithPopup, updateProfile } from "firebase/auth";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import firebaseConfig from "../firebaseConfig";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const provider = new GoogleAuthProvider();
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();


const user = {
  username: "",
  email: "",
  password: "",
}

const Signup = (props) => {

  const [userInfo, setUserInfo] = useState(user);
  const navigate = useNavigate();

  function submitHandler(e) {

    e.preventDefault()
    createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;

        updateProfile(auth.currentUser, {
          displayName: userInfo.username
        }).then((user) => {
          // Profile updated!
          console.log(user);
          // ...
        }).catch((error) => {
          // An error occurred
          // ...
        });
        toast.success("User has been registered successfully", {
          theme: "light",
        });
        // ...
        setTimeout(() => navigate('/'), 2000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        toast.error(errorMessage, {

          theme: "light",
        });
        // ..
      });

  }
  useEffect(() => {

    onAuthStateChanged(auth, async (user) => {
      if (user) {


        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");

          // Add a new document in collection "cities"
          await setDoc(doc(db, "users", user.uid), {
            nameID: user.uid,
            // username: user.displayName,


          });
        }
        // console.log(user);

        // navigate('/');
      }
    });
  }, [])

  function googleHandle() {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        if (user) {


          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
          } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
            // Add a new document in collection "cities"
            await setDoc(doc(db, "users", user.uid), {
              nameID: user.uid,
              // username: user.displayName,


            });

          }
          // console.log(user);

          navigate('/');
        }
      });

  }
  return (
    <form onSubmit={submitHandler} className="p-5 flex flex-col justify-center sm:p-14 max-w-xl m-auto">

      <h1 className="sm:text-5xl text-4xl  py-6">Sign up</h1>
      <TextInput label="Username" placeholder="Enter your name" name="username" setUserInfo={setUserInfo} userInfo={userInfo} />
      <TextInput label="Email" placeholder="Enter your email" name="email" setUserInfo={setUserInfo} userInfo={userInfo} />
      <PasswordInput label="Password" placeholder="Enter your password" name="password" setUserInfo={setUserInfo} userInfo={userInfo} />
      <button type="submit" className="mt-8 rounded h-11 bg-green-500 text-white">Signup</button>
      <button type="button" onClick={googleHandle} className="my-8 rounded h-11  bg-stone-200 "><img className="w-6 inline mr-5" src="https://cdn-icons-png.flaticon.com/256/2504/2504739.png" />Sign in with Google</button>
      <Link to="/login" className=" text-blue-600"> Go back to login page</Link>
    </form>
  )
};

export default Signup;

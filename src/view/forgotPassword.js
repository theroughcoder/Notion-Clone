
import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react"
import TextInput from "../component/common/textInput";
import PasswordInput from "../component/common/passwordInput";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithPopup, updateProfile } from "firebase/auth";
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
  email: "",
}

const ForgotPassword = (props) => {

  const [userInfo, setUserInfo] = useState(user);
  const navigate = useNavigate();

  function submitHandler(e) {

    e.preventDefault()
    sendPasswordResetEmail(auth, userInfo.email)
      .then(() => {
        // Password reset email sent!
        // ..
        toast.success("Password reset link sent to your email address", {
          theme: "light",
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });

  }
  useEffect(() => {

    onAuthStateChanged(auth, async (user) => {
      if (user) {




        navigate('/');
      }
    });
  }, [])


  return (
    <form onSubmit={submitHandler} className="p-5 flex flex-col justify-center sm:p-14 max-w-xl m-auto">

      <h1 className="sm:text-5xl text-4xl  py-6">Reset Password</h1>
      <TextInput label="Email" placeholder="Enter your email" name="email" setUserInfo={setUserInfo} userInfo={userInfo} />
      <button type="submit" className="mt-8 rounded h-11 bg-green-500 text-white">Reset</button>
      <Link to="/login" className=" text-blue-600 mt-5"> Go back to login page</Link>
    </form>
  )
};

export default ForgotPassword;


import React, { useEffect, useState } from "react"
import TextInput from "../component/common/textInput";
import PasswordInput from "../component/common/passwordInput";
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebaseConfig";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();

const user = {
    email: "",
    password: "",
}
const provider = new GoogleAuthProvider();


const Login = (props) => {
    const [userInfo, setUserInfo] = useState(user);
    const navigate = useNavigate();

    function submitHandler(e) {
        e.preventDefault()

        signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
                toast.success(`User has been logged in successfully`, {
                    theme: "light",
                });
                // ...
                setTimeout(() => navigate('/'), 2000);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                toast.error(errorMessage, {

                    theme: "light",
                });
            });
    }
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/');
            }
        });

    }, [])
    function googleHandle() {
        signInWithPopup(auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
          }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
          });
      }
    return (
        <div className=" h-screen grid sm:grid-cols-2 grid-cols-1">
            <div className="h-full sm:block hidden  overflow-hidden bg-red-50" >
                <img className="h-full w-full" src='./login-image.png' />
            </div>
            <form onSubmit={submitHandler} className="p-5 flex flex-col justify-center sm:p-14 max-w-xl">

                <h1 className="sm:text-5xl text-4xl  p-6">Login</h1>
                <TextInput label="Email" placeholder="Enter your email" name="email" setUserInfo={setUserInfo} userInfo={userInfo} />
                <PasswordInput label="Password" placeholder="Enter your password" name="password" setUserInfo={setUserInfo} userInfo={userInfo} />
                <button type="submit" className="mt-8 rounded-md h-11  bg-green-500 text-white">Login</button>
                <button onClick={googleHandle} className="mt-8 rounded h-11  bg-stone-200 "><img className="w-6 inline mr-5" src="https://cdn-icons-png.flaticon.com/256/2504/2504739.png" />Sign in with Google</button>
                <button onClick={() => navigate('/signup')} className="mt-8 rounded-md h-11 bg-black text-white">Create Account</button>
            </form>

        </div>
    )
};

export default Login;

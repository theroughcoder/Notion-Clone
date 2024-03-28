import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from "../firebaseConfig";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";

const app = initializeApp(firebaseConfig);
const auth = getAuth();


const Home = (props) => {
  const navigate = useNavigate();

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
    <div className=" dark:bg-zinc-700 min-h-screen">
      Home

    </div>
  )
};

export default Home;



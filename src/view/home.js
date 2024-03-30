import firebaseConfig from "../firebaseConfig";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);


const Home = (props) => {
  
  return (
    <div className=" dark:bg-zinc-700 min-h-screen">
      Home

    </div>
  )
};

export default Home;



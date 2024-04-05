import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import Home from './view/home';
import Layout from './layout/layout';
import { createTheme, ThemeProvider } from '@mui/material';
import Login from './view/login';
import Signup from './view/signup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import KanbanBoard from './view/kanban';
import MDXPage from './view/mdxPage';
import ShareReadOnlyPage from './view/shareReadOnlyPage';
import ForgotPassword from './view/forgotPassword';
import {  createContext, useContext, useState } from 'react';
const darkLocalStorageValue = localStorage.getItem('darkMode');

export const ModeContext = createContext(null);

function App() {
 
  console.log(  darkLocalStorageValue);
  const [dark, setDark] = useState(darkLocalStorageValue == "false" ? false : true);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
      secondary: {
        main: '#00b8d4',
      },
    },
  });
  const router = createBrowserRouter([
    {
      // parent route component
      element: <Layout />,
      // child route components
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/page/kanban/:id",
          element: <KanbanBoard />,
        },
        {
          path: "/page/MDX/:id",
          element: <MDXPage />,
        },
        // other pages....

      ],
    },
    {
      path: "login",
      element: <Login />,

    },
    {
      path: "signup",
      element: <Signup />,

    },
    {
      path: "forgot-password",
      element: <ForgotPassword />,

    },
    {
      path: "share-readonly-page/:id",
      element: <ShareReadOnlyPage />,

    },
  ])

  return (
    <ModeContext.Provider value={{ dark, setDark} }>
      <div className={ "App"} >
        <ThemeProvider theme={theme}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={true}
            theme="light"

          />
          <RouterProvider router={router} />
        </ThemeProvider>
      </div>
    </ModeContext.Provider>
  );
}

export default App;

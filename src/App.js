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



function App() {
  

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
          path: "/kanban-board",
          element: <KanbanBoard />,
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
  ])

  return (
    <div className="App " >
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
  );
}

export default App;

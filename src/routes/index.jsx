import { createBrowserRouter, Navigate } from "react-router-dom";


import AuthLayout from "../layouts/AuthLayout";
import App from "../App";
import Login from "../pages/Login";
import Root from "./Root";
import NotFound from "@/pages/NotFound";
import Logout from "@/pages/Logout";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
    ],
  },

  {
    path: "dashboard",
    element: <App />,
  },
  {
    path: "*",
    element: <NotFound />,
  }


  
]);

export default routes;
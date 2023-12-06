import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import AuthLayout from "../layouts/AuthLayout";
import App from "../App";
const Login= lazy(()=> import("../pages/Login"))

import Root from "./Root";
import NotFound from "@/pages/NotFound";
import Logout from "@/pages/Logout";
import ContentLayout from "@/layouts/ContentLayout";
import Loader from "@/components/Loader";

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
        element: <Suspense fallback={<Loader />}>
           <Login />
        </Suspense>,
      },
      {
        path: "logout",
        element: <Logout />,
      },
    ],
  },

  {
    path: "*",
    element: <ContentLayout />,
    children:[
    {
      path: "dashboard",
      element: <App />
    },
    {
      path: "*",
      element: <NotFound />,
    }

    ]
  },
 

]);

export default routes;

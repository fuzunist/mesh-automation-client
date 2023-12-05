import Header from "@/components/Header";
import { useUser } from "@/store/hooks/user";

import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const ContentLayout = () => {
  const user = useUser();


  console.log("content layout", user.tokens.access_token);
  if (!user.tokens.access_token) return <Navigate to="/" />;

  return (
    <div className="flex flex-col w-screen">
      <Header />
      <Outlet />
    </div>
  );
};

export default ContentLayout;

import Header from "@/components/Header";
import { useUser } from "@/store/hooks/user";

import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useGetAllKesmeQuery } from "@/store/reducers/kesme";

const ContentLayout = () => {
  const user = useUser();

  if (!user.tokens.access_token) return <Navigate to="/" />;

  return (
    <div className="flex flex-col w-screen">
      <Header />
      <Outlet />
    </div>
  );
};

export default ContentLayout;

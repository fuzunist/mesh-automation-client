import Header from "@/components/Header";
import { useUser } from "@/store/hooks/user";

import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const ContentLayout = () => {
  const user = useUser();

  if (!user.tokens.access_token) return <Navigate to="/" />;

  return (
    <div className="min-h-screen w-screen scroll-smooth overflow-hidden">
      <Header />
     <div className="mx-2">
      <Outlet />
      </div>
    </div>
  );
};

export default ContentLayout;

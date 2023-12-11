import React from "react";
import { LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/store/hooks/user";
import Logo from "@/assets/img/logo-mg.png";
import { Outlet } from "react-router-dom";

const Header = ({ children }) => {
  const navigate = useNavigate();
  const user = useUser();

  return (
    <header className="top-0 bg-white z-10 overflow-hidden mb-2">
      <div className=" max-h-16 flex p-4 justify-between items-center ">
        <div className="flex h-15 items-center">
          <img
            className="w-56"
            src={Logo}
            alt=""
            onClick={() => navigate("/")}
          />

        </div>
        <div className="w-[40%]">{children}</div>


        <div className="flex text-sm gap-1 cursor-pointer mr-4 items-center text-gray-500">
          <div className="text-sm mr-4">Hoşgeldin, {user.username}!</div>
          <span className="flex items-center gap-x-2" onClick={() => navigate("/auth/logout")}>
            {" "}
            Çıkış
            <LogOutIcon className="w-4 h-4" />
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;

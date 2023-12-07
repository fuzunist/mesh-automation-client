import React from "react";
import { LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/store/hooks/user";
import Logo from "@/assets/img/logo-mg.png";

const Header = () => {
  const navigate = useNavigate();
  const user = useUser();

  return (
    <header className="flex w-full h-[48px] bg-white text-gray-400 justify-between items-center">
      <div className="flex p-0 m-0" onClick={() => navigate("/")}>
        <img className="flex max-w-[96px] max-h-[48px]" src={Logo} alt="" />
      </div>
      <div className="text-gray-800 mx-auto font-bold ml-auto">
        Mesh Hasır Hesaplama
      </div>

      <div
        className="flex text-sm gap-1 cursor-pointer mr-4 items-center text-gray-500"
        onClick={() => navigate("/auth/logout")}
      >
        <div className="text-sm mr-4">Hoşgeldin, {user.username}!</div>
        Çıkış
        <LogOutIcon className="w-4 h-4" />
      </div>
    </header>
  );
};

export default Header;

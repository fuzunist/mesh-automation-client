import React from "react";
import { LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/store/hooks/user";
import Logo from "@/assets/img/logo-mg.png";

const Header = () => {
  const navigate = useNavigate();
  const user = useUser();

  return (
    <header className="flex w-full h-[76px] bg-white text-gray-400 items-center justify-between">
      <div className="flex items-center" onClick={() => navigate("/")}>
        <img className="max-w-[392px] max-h-[196px]" src={Logo} alt="" />
      </div>
      <div className="text-gray-800 mx-auto font-bold text-xl ml-auto">
        Otomatik Hasır Hesaplama Programı
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

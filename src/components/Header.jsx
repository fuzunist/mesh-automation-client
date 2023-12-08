import React from "react";
import { LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/store/hooks/user";
import Logo from "@/assets/img/logo-mg.png";

const Header = () => {
  const navigate = useNavigate();
  const user = useUser();

  return (
    <header className="top-0 bg-white z-10 overflow-hidden mb-2">
      <div className=" max-h-16 flex p-4 justify-between items-center ">
        <div className="flex h-15 items-center" onClick={() => navigate("/")}>
          <img className="w-56" src={Logo} alt="" />
        </div>
        <div className="text-gray-800 mx-auto font-bold  text-sm md:text-md lg:text-lg xl:text-xl  text-center ml-auto">
          Oto Hasır Hesaplama Programı
        </div>

        <div
          className="flex text-sm gap-1 cursor-pointer mr-4 items-center text-gray-500"
          onClick={() => navigate("/auth/logout")}
        >
          <div className="text-sm mr-4">Hoşgeldin, {user.username}!</div>
          Çıkış
          <LogOutIcon className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};

export default Header;

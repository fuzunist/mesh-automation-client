import React from "react";
import { LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate=useNavigate()
  return (
    <header className="w-full text-gray-600 p-2  flex justify-end items-center">
      {/* <h1 className="text-md">Application Header</h1> */}
      <div className="flex gap-2 cursor-pointer mr-2" onClick={()=>navigate("/auth/logout")}>
        Çıkış
        <LogOutIcon />
      </div>
    </header>
  );
};

export default Header;

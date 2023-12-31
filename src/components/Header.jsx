import React, { useEffect, useState } from "react";
import { LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/store/hooks/user";
import Logo from "@/assets/img/logo-mg.png";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { ChevronDown } from "lucide-react";
import useWindowWidth from "@/hooks/useWindowWidth";

const Header = ({ children }) => {
  const navigate = useNavigate();
  const user = useUser();
  const width = useWindowWidth();

  return (
    <header className="top-0 bg-white overflow-hidden mb-2 ">
      <div className="flex flex-col">
        <div className="flex max-h-16 p-4 justify-between items-center ">
          <div className="flex h-15 items-center">
            <img
              className="w-56"
              src={Logo}
              alt=""
              onClick={() => navigate("/")}
            />
          </div>
          {width > 960 && (
            <div id="web" className="w-[60%] lg:w-[50%]">
              {children}
            </div>
          )}
          <div className="flex text-xs  cursor-pointer  items-center text-gray-500">
            <Menu
              animate={{
                mount: { y: 0 },
                unmount: { y: 25 },
              }}
            >
              <MenuHandler>
                <Button
                  variant="text"
                  className="flex items-center gap-1 text-xs md:text-sm text-gray-800  capitalize tracking-normal "
                >
                  {" "}
                  Hoşgeldin, {user.username}!
                  <ChevronDown />
                </Button>
              </MenuHandler>
              <MenuList>
                <MenuItem>
                  {" "}
                  <span
                    className="flex items-center gap-x-2"
                    onClick={() => navigate("/auth/logout")}
                  >
                    {" "}
                    Çıkış
                    <LogOutIcon className="w-4 h-4" />
                  </span>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
        {width <= 960 && (
          <div
            className={`flex h-12 justify-center items-center p-4 bg-gray-50 `}
          >
            <div id="mobile" className={`w-full`}>
              {children}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

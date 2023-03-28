import React from "react";
import Drawer from "react-modern-drawer";
import Sidebar from "../layout/Sidebar";
import "react-modern-drawer/dist/index.css";
import { useState } from "react";
import Drawbar from "../layout/Drawbar";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiSearchLine } from "react-icons/ri";
import { SelectedMenuContext } from "../contexts/SelectedMenuContext";
import { useContext } from "react";
const Home = ({ children }) => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const { selectedMenu } = useContext(SelectedMenuContext);
  const handleDrawer = () => {
    setIsOpenDrawer((prev) => !prev);
  };

  return (
    <div className="flex min-w-screen min-h-screen justify-start flex-col md:flex-row md:justify-center p-0 md:p-20  bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-sky-700 via-blue-900 to-gray-900 max-w-screen max-h-screen overflow-x-hidden">
      <div className="flex text-white w-full justify-start items-center h-14 px-1 md:hidden">
        <div className="flex w-10">
          <button
            onClick={() => handleDrawer()}
            className="flex w-10 h-10 justify-center items-center"
          >
            <RxHamburgerMenu className="text-2xl" />
          </button>
        </div>
        <div className="flex w-full justify-center items-center">
          <span className="text-gray-100 text-xl font-bold">BDBDg협회</span>
        </div>
        <div className="flex w-10 h-10">
          <button>
            <RiSearchLine className="text-2xl" />
          </button>
        </div>
      </div>
      <Drawer
        open={isOpenDrawer}
        onClose={handleDrawer}
        direction="left"
        size={200}
        className="flex w-full h-full"
      >
        <Drawbar setOpen={handleDrawer} />
      </Drawer>
      <div className="hidden md:flex w-1/3 justify-end items-start ">
        <Sidebar />
      </div>
      <div className="flex w-full justify-start items-start flex-col p-3 md:px-10 md:py-3">
        <div className="flex w-full h-10 ml-2">
          <span className="text-sm text-gray-300">{selectedMenu}</span>
        </div>
        <div className="flex w-full">{children}</div>
      </div>
    </div>
  );
};

export default Home;

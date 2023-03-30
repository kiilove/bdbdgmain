import React, { useEffect, useState } from "react";
import { useContext } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Menus } from "../consts/MenuArray";
import { SelectedMenuContext } from "../contexts/SelectedMenuContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState({
    menuIndex: -1,
    isHidden: true,
  });
  const { selectedMenu, setSelectedMenu } = useContext(SelectedMenuContext);

  const handleMenuClick = (idx) => {
    if (Menus[idx].subMenu) {
      setSelectedMenu(Menus[idx].title);
      if (menuVisible.menuIndex === idx) {
        setMenuVisible({
          menuIndex: null,
          isHidden: true,
        });
      } else {
        setMenuVisible({
          menuIndex: idx,
          isHidden: false,
        });
      }
    } else {
      setSelectedMenu(Menus[idx].title);

      navigate(Menus[idx].link);
    }
  };

  const handleSubMenuClick = (parentIdx, subIdx) => {
    setSelectedMenu(
      `${Menus[parentIdx].title} - ${Menus[parentIdx].subMenu[subIdx].title}`
    );

    navigate(Menus[parentIdx].subMenu[subIdx].link);
  };

  useEffect(() => {
    setMenuVisible({ menuIndex: 0, isHidden: true });
  }, []);

  const isSelected = (menuTitle, submenuTitle = null) => {
    if (submenuTitle) {
      return selectedMenu === `${menuTitle} - ${submenuTitle}`;
    }
    return selectedMenu === menuTitle;
  };

  return (
    <div
      className="flex flex-col  rounded-lg w-96 p-10 gap-y-2"
      style={{ backgroundColor: "rgba(16,26,66,0.7)", minHeight: "800px" }}
    >
      <div className="flex w-full h-20">
        <span className="text-gray-100 text-2xl font-bold">BDBDg관리자</span>
      </div>
      {Menus.map((menu, idx) => (
        <div
          key={menu.index}
          className="flex flex-col font-bold text-sm md:text-base lg:text-xl"
        >
          <div
            className={`${
              menuVisible.index === menu.index && "bg-blue-900 "
            } flex w-full h-10 justify-start items-center hover:bg-gray-600 hover:text-white  text-gray-300 rounded-lg md:px-1 lg:px-3`}
            onClick={() => handleMenuClick(idx)}
          >
            <div className="flex justify-between w-full items-center">
              <div className="flex">
                <button className="flex w-full h-10 justify-start items-center ml-4">
                  <span className="">{menu.title}</span>
                </button>
              </div>
              <div className="flex">
                {/* {menu?.subMenu ? (
                  menuVisible.index === idx && menuVisible.isHidden ? (
                    <MdOutlineKeyboardArrowDown />
                  ) : (
                    <MdOutlineKeyboardArrowUp />
                  )
                ) : null} */}
              </div>
            </div>
          </div>
          {menuVisible.menuIndex === idx &&
            menuVisible.isHidden === false &&
            menu?.subMenu && (
              <div className="flex flex-col text-gray-400 text-base">
                {menu.subMenu.map((submenu, sIdx) => (
                  <div className="flex w-full">
                    <div className="flex" key={submenu.index}>
                      <button
                        className="py-2 px-10 hover:text-gray-200 w-full flex justify-start items-center"
                        onClick={() => handleSubMenuClick(idx, sIdx)}
                      >
                        {submenu.title}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;

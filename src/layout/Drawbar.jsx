import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Menus } from "../consts/MenuArray";
import { SelectedMenuContext } from "../contexts/SelectedMenuContext";

const Drawbar = ({ setOpen }) => {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState({
    menuIndex: 0,
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
      setOpen();
      navigate(Menus[idx].link);
    }
  };

  const handleSubMenuClick = (parentIdx, subIdx) => {
    setSelectedMenu(
      `${Menus[parentIdx].title} - ${Menus[parentIdx].subMenu[subIdx].title}`
    );
    setOpen();
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
      className="flex flex-col w-full py-10 gap-y-2"
      style={{ backgroundColor: "rgba(16,26,66,1)" }}
    >
      {Menus.map((menu, idx) => (
        <div key={menu.index} className="flex flex-col font-bold text-sm">
          <div
            className={`${
              isSelected(menu.title) && "bg-blue-900 "
            } flex w-full h-10 justify-start items-center hover:bg-gray-600 hover:text-white  text-gray-300 rounded-lg md:px-1 lg:px-3`}
            onClick={() => handleMenuClick(idx)}
          >
            <div className="flex justify-between w-full items-center">
              <div className="flex">
                <button className="flex w-full h-10 justify-start items-center ml-4">
                  <span className="">{menu.title}</span>
                </button>
              </div>
              <div className="flex"></div>
            </div>
          </div>
          {menuVisible.menuIndex === idx &&
            menuVisible.isHidden === false &&
            menu?.subMenu && (
              <div className="flex flex-col text-gray-400 text-sm">
                {menu.subMenu.map((submenu, sIdx) => (
                  <div className="flex w-full">
                    <div className="flex w-full" key={submenu.index}>
                      <button
                        className={`${
                          isSelected(menu.title, submenu.title) &&
                          "bg-gray-700 "
                        } py-2 px-5 hover:text-gray-200 w-full flex justify-start items-center`}
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

export default Drawbar;

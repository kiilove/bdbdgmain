import React, { useEffect, useState } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
const Menus = [
  {
    index: 0,
    title: "새로운 대회 개설",
    link: "/",
  },
  {
    index: 1,
    title: "대회 시작전 업무",
    link: "/",
    subMenu: [
      { index: 0, title: "대회공고", link: "/" },
      { index: 1, title: "참가신청서", link: "/" },
      { index: 2, title: "종목/체급관리", link: "/" },
      { index: 3, title: "심판배정", link: "/" },
      { index: 4, title: "확정명단", link: "/" },
    ],
  },
  {
    index: 2,
    title: "대회 당일 업무",
    link: "/",
    subMenu: [
      { index: 0, title: "계측/월체", link: "/" },
      { index: 1, title: "종목/체급별 심판배정", link: "/" },
      { index: 2, title: "종목/체급별 선수명단", link: "/" },
      { index: 3, title: "종목/체급별 성적집계", link: "/" },
    ],
  },
  {
    index: 3,
    title: "종료된 대회 업무",
    link: "/",
    subMenu: [
      { index: 0, title: "대회목록", link: "/" },
      { index: 1, title: "참가신청서출력", link: "/" },
      { index: 2, title: "확정명단출력", link: "/" },
      { index: 3, title: "집계 출력", link: "/" },
    ],
  },
];

const Sidebar = () => {
  const [menuVisible, setMenuVisible] = useState({
    menuIndex: 0,
    isHidden: true,
  });

  const handleMenuClick = (idx) => {
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
  };

  useEffect(() => {
    console.log(menuVisible);
  }, [menuVisible]);

  return (
    <div
      className="flex flex-col  rounded-lg w-96 p-10 gap-y-2"
      style={{ backgroundColor: "rgba(16,26,66,1)" }}
    >
      <div className="flex w-full h-20">
        <span className="text-gray-100 text-2xl font-bold">BDBDg협회</span>
      </div>
      {Menus.map((menu, idx) => (
        <div key={menu.index} className="flex flex-col font-bold text-lg">
          <div
            className="flex w-full h-10 justify-start items-center hover:bg-gray-600 hover:text-white  text-gray-300 rounded-lg px-3"
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
                      <button className="py-2 px-10 hover:text-gray-200 w-full flex justify-start items-center">
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

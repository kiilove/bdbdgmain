export const Menus = [
  {
    index: 0,
    title: "홈",
    link: "/",
  },
  {
    index: 1,
    title: "대회 개설",
    link: "/startcontest",
    subMenu: [
      { index: 0, title: "새로운 대회 개설", link: "/startcontest" },
      { index: 1, title: "미완성목록", link: "/contestuncompleted" },
    ],
  },
  {
    index: 2,
    title: "대회 시작전 업무",
    link: "/",
    subMenu: [
      { index: 0, title: "대회공고", link: "/contestlistpre" },
      { index: 1, title: "참가신청서", link: "/" },
      { index: 2, title: "종목/체급관리", link: "/" },
      { index: 3, title: "심판배정", link: "/" },
      { index: 4, title: "확정명단", link: "/" },
    ],
  },
  {
    index: 3,
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
    index: 4,
    title: "종료된 대회 업무",
    link: "/",
    subMenu: [
      { index: 0, title: "대회목록", link: "/" },
      { index: 1, title: "참가신청서출력", link: "/" },
      { index: 2, title: "확정명단출력", link: "/" },
      { index: 3, title: "집계 출력", link: "/" },
    ],
  },
  {
    index: 5,
    title: "관리자메뉴",
    link: "/",
    subMenu: [
      { index: 0, title: "종목/체급관리", link: "/categoryonlyadmin" },
      { index: 1, title: "협회관리", link: "/promoteronlyadmin" },
      { index: 2, title: "심판관리", link: "/judgeonlyadmin" },
    ],
  },
];

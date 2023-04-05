import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CurrentContestContext } from "../contexts/CurrentContestContext";
import { useFirestoreGetDocument } from "../hooks/useFirestores";
import ContestNotice from "./ContestNotice";
import Loading from "./Loading";
import { RiMap2Fill, RiCalendarFill, RiApps2Fill } from "react-icons/ri";
import { useRef } from "react";
import CategoryList from "./basedata/CategoryList";
import EntryList from "./EntryList";

const ContestView = () => {
  const param = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [getNoticeData, setGetNoticeData] = useState({});
  const [selectedTab, setSelectedTab] = useState({
    id: "대회공고",
    text: "대회공고",
    component: (
      <ContestNotice
        mode={"read"}
        propContestNoticeId={getNoticeData.id}
        syncState={setGetNoticeData}
      />
    ),
  });
  const tabs = [
    {
      id: "대회공고",
      text: "대회공고",
      component: (
        <ContestNotice
          mode={"read"}
          propContestNoticeId={getNoticeData.id}
          syncState={setGetNoticeData}
        />
      ),
    },
    { id: "참가신청서", text: "참가신청서", component: <EntryList /> },
    {
      id: "종목체급관리",
      text: "종목/체급 관리",
      component: <CategoryList mode="choice" />,
    },
    { id: "심판선발", text: "심판 선발" },
  ];

  const refs = useRef(
    tabs.reduce((acc, tab) => {
      acc[tab.id] = React.createRef();
      return acc;
    }, {})
  );

  const {
    data: contestData,
    loading: contestLoading,
    error: contestError,
    getDocument: contestDocument,
  } = useFirestoreGetDocument("contests");

  const {
    data: noticeData,
    loading: noticeLoading,
    error: noticeError,
    getDocument: noticeDocument,
  } = useFirestoreGetDocument("contest_notice");
  const { currentContest, setCurrentContest } = useContext(
    CurrentContestContext
  );

  useEffect(() => {
    const fetchData = async () => {
      await contestDocument(param.contestId);
    };
    fetchData();
  }, [param.contestId]);

  useEffect(() => {
    if (contestData) {
      setCurrentContest({ ...contestData });
      localStorage.setItem(
        "currentContest",
        JSON.stringify({ ...contestData })
      );
      const fetchData = async () => {
        await noticeDocument(contestData.contestNoticeId);
      };
      fetchData();
    }
  }, [contestData]);

  useEffect(() => {
    if (noticeData) {
      setGetNoticeData({ ...noticeData });
      setIsLoading(false);
    }
  }, [noticeData]);

  useEffect(() => {
    console.log(getNoticeData);
  }, [getNoticeData]);

  function handleTabClick(tab) {
    setSelectedTab(tab);
  }

  return (
    <div className="flex w-full h-full flex-col gap-y-5 mt-5">
      <div
        className="flex w-full h-full rounded-lg flex-col"
        style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
      >
        <div className="flex h-full w-full px-2 md:px-5 flex-col">
          <span className="text-white p-5 font-semibold md:text-lg">
            대회요약
          </span>
          {isLoading && <Loading />}
          {getNoticeData && (
            <div className="flex flex-col md:flex-row  gap-y-2 md:gap-y-0">
              <div className="flex w-full px-2 md:px-5 md:w-1/5 lg:1/6">
                <img
                  src={getNoticeData.contestPosterTitle}
                  className="w-44 h-40 md:w-60 object-cover object-top rounded-lg"
                />
              </div>
              <div className="flex w-full flex-col px-2 md:px-5 gap-y-2 md:w-4/5 lg:w-4/6 ">
                <div className="flex items-start text-gray-300">
                  <div className="font-san font-semibold text-sm md:text-lg">
                    <div className="flex h-full justify-start items-center">
                      <span>{getNoticeData.contestFullTitle}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start text-gray-400 gap-x-3 flex-col md:flex-row">
                  <div className="flex h-full justify-start items-center text-gray-500">
                    <RiCalendarFill className="mr-1 test-sm" />
                    <span className="font-san font-semibold text-sm md:text-base">
                      {getNoticeData.contestDate}
                    </span>
                  </div>
                  <div className="flex h-full justify-start items-center text-gray-500">
                    <RiMap2Fill className="mr-1 text-sm" />
                    <span className="font-san font-semibold text-sm md:text-base">
                      {getNoticeData.contestLocation}
                    </span>
                  </div>
                  <div className="flex h-full justify-start items-center text-gray-500">
                    <RiApps2Fill className="mr-1 text-sm text-green-500" />
                    <span className="font-san font-semibold text-sm md:text-base">
                      {getNoticeData.contestStatus}
                    </span>
                  </div>
                </div>
                <div className="flex items-start text-gray-200 mt-2 gap-x-3">
                  <div className="flex w-40 h-20 border border-dashed border-gray-500 rounded-lg flex-col">
                    <div className="flex h-1/2 justify-start items-center ml-4">
                      <span className="text-lg font-bold">123</span>
                    </div>
                    <div className="flex h-1/2 justify-start items-center ml-4 text-gray-400">
                      <span className="text-sm font-bold">참가신청자</span>
                    </div>
                  </div>
                  <div className="flex w-40 h-20 border border-dashed border-gray-500 rounded-lg flex-col">
                    <div className="flex h-1/2 justify-start items-center ml-4">
                      <span className="text-lg font-bold">12</span>
                    </div>
                    <div className="flex h-1/2 justify-start items-center ml-4 text-gray-400">
                      <span className="text-sm font-bold">심판 배정</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex w-full h-full mt-2 overflow-visible md:gap-x-2 items-end">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={
                  selectedTab.id === tab.id
                    ? "flex w-32 h-20 justify-center items-end cursor-pointer border-b-4 border-gray-400"
                    : "flex w-32 h-20 justify-center items-end cursor-pointer border-transparent border-b-4"
                }
                onClick={() => handleTabClick(tab)}
                ref={refs.current[tab.id]}
                id={tab.id}
              >
                <div className="flex w-full h-18 justify-center items-center">
                  <span className="text-gray-200 mb-2 font-sans md:font-semibold text-sm md:text-base">
                    {tab.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {<div className="flex w-full">{selectedTab.component}</div>}
    </div>
  );
};

export default ContestView;

import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestoreQuery } from "../../hooks/useFirestores";

import Loading from "../Loading";

import { JudgeContext } from "../../contexts/JudgeContext";
import manualPlayerList from "../basedata/ManualPlayerList";
import JudgeManage from "../basedata/JudgeManage";
import { ManualPlayerContext } from "../../contexts/ManualPlayerContext";
import { where } from "firebase/firestore";
import { CurrentContestContext } from "../../contexts/CurrentContestContext";
import ManualPlayerList from "../basedata/ManualPlayerList";
import ManualPlayerManage from "../basedata/ManualPlayerManage";

const ManualPlayerOnlyAdmin = ({ mode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [getJudges, setGetJudges] = useState([]);

  const [selectedTab, setSelectedTab] = useState({
    id: "전체목록",
    text: "전체목록",
  });

  const { manualPlayerList, setManualPlayerList } =
    useContext(ManualPlayerContext);

  const { currentCotenst } = useContext(CurrentContestContext);

  const manualPlayerQuery = useFirestoreQuery();

  const fetchManual = async () => {
    try {
      const fetchData = await manualPlayerQuery.getDocuments(
        "manual_player_pool"
      );

      setManualPlayerList(fetchData);
    } catch (error) {
      setManualPlayerList(undefined);
      console.error(error.code);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();
  const tabs = [
    {
      id: "전체목록",
      text: "전체목록",
    },

    {
      id: "선수추가",
      text: "선수추가",
    },
  ];

  const refs = useRef(
    tabs.reduce((acc, tab) => {
      acc[tab.id] = React.createRef();
      return acc;
    }, {})
  );

  useEffect(() => {
    fetchManual();
  }, []);

  function handleTabClick(tab) {
    setSelectedTab(tab);
  }

  return (
    <div className="flex w-full flex-col mt-5">
      <div
        className="flex w-full rounded-lg flex-col"
        style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
      >
        <div className="flex  w-full px-2 md:px-5 flex-col ">
          <span className="text-white p-5 font-semibold md:text-lg">
            수동모드 선수관리
          </span>
          {isLoading && <Loading />}

          <div className="flex w-full h-full mt-2 md:gap-x-2 items-end">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={
                  selectedTab.id === tab.id
                    ? "flex w-32 h-10 justify-center items-end cursor-pointer border-b-4 border-gray-400"
                    : "flex w-32 h-10 justify-center items-end cursor-pointer border-transparent border-b-4"
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
      {
        <div className="flex w-full">
          {selectedTab.id === "전체목록" && manualPlayerList?.length > 0 && (
            <ManualPlayerList setSelectedTab={setSelectedTab} />
          )}
          {selectedTab.id === "선수정보" && manualPlayerList?.length > 0 && (
            <ManualPlayerManage mode={"read"} playerId={selectedTab.playerId} />
          )}
          {selectedTab.id === "선수수정" && manualPlayerList?.length > 0 && (
            <ManualPlayerManage mode={"edit"} playerId={selectedTab.playerId} />
          )}
          {selectedTab.id === "선수추가" && <ManualPlayerManage mode={"add"} />}
        </div>
      }
    </div>
  );
};

export default ManualPlayerOnlyAdmin;

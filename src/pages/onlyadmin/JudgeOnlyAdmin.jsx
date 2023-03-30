import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestoreQuery } from "../../hooks/useFirestores";

import Loading from "../Loading";

import { JudgeContext } from "../../contexts/JudgeContext";
import JudgeList from "../basedata/JudgeList";
import JudgeManage from "../basedata/JudgeManage";

const JudgeOnlyAdmin = ({ mode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [getJudges, setGetJudges] = useState([]);

  const [selectedTab, setSelectedTab] = useState({
    id: "전체목록",
    text: "전체목록",
  });

  const { judgeList, setJudgeList } = useContext(JudgeContext);

  const judgeQuery = useFirestoreQuery();

  const fetchJudge = async () => {
    try {
      const fetchData = await judgeQuery.getDocuments("judge_pool");

      const documents = fetchData.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setGetJudges(documents);
    } catch (error) {
      setGetJudges(undefined);
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
      id: "심판추가",
      text: "심판추가",
    },
  ];

  const refs = useRef(
    tabs.reduce((acc, tab) => {
      acc[tab.id] = React.createRef();
      return acc;
    }, {})
  );

  useEffect(() => {
    fetchJudge();
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
            심판관리
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
          {selectedTab.id === "전체목록" && judgeList?.length > 0 && (
            <JudgeList setSelectedTab={setSelectedTab} />
          )}
          {selectedTab.id === "심판정보" && judgeList?.length > 0 && (
            <JudgeManage mode={"read"} judgeId={selectedTab.id} />
          )}
          {selectedTab.id === "심판수정" && judgeList?.length > 0 && (
            <JudgeManage mode={"edit"} judgeId={selectedTab.id} />
          )}
          {selectedTab.id === "심판추가" && <JudgeManage mode={"add"} />}
        </div>
      }
    </div>
  );
};

export default JudgeOnlyAdmin;

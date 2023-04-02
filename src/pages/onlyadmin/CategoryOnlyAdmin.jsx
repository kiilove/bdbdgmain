import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryGradePairContext } from "../../contexts/CategoryGradePairContext";
import { useFirestoreQuery } from "../../hooks/useFirestores";
import CategoryManage from "../basedata/CategoryManage";
import CategoryList from "../basedata/CategoryList";
import Loading from "../Loading";

const CategoryOnlyAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState({
    id: "전체목록",
    text: "전체목록",
  });
  const tabs = [
    {
      id: "전체목록",
      text: "전체목록",
    },

    {
      id: "종목추가",
      text: "종목추가",
    },
  ];

  const refs = useRef(
    tabs.reduce((acc, tab) => {
      acc[tab.id] = React.createRef();
      return acc;
    }, {})
  );

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
            종목/체급
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
          {selectedTab.id === "전체목록" && (
            <CategoryList setSelectedTab={setSelectedTab} />
          )}
          {selectedTab.id === "종목보기" && (
            <CategoryManage
              mode={"read"}
              categoryIndex={selectedTab.categoryIndex}
            />
          )}
          {selectedTab.id === "종목수정" && (
            <CategoryManage
              mode={"edit"}
              categoryIndex={selectedTab.categoryIndex}
            />
          )}
          {selectedTab.id === "종목추가" && <CategoryManage mode={"add"} />}
        </div>
      }
    </div>
  );
};

export default CategoryOnlyAdmin;

import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestoreQuery } from "../../hooks/useFirestores";
import CategoryList from "../basedata/CategoryList";
import Loading from "../Loading";
import { PromoterContext } from "../../contexts/PromoterContext";
import PromoterList from "../basedata/PromoterList";
import PromoterManage from "../basedata/PromoterManage";

const PromoterOnlyAdmin = ({ mode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [getPromoters, setGetPromoters] = useState([]);

  const [selectedTab, setSelectedTab] = useState({
    id: "전체목록",
    text: "전체목록",
  });

  const { promoterList, setPromoterList } = useContext(PromoterContext);

  const promoterQuery = useFirestoreQuery();

  const fetchPromoter = async () => {
    try {
      const fetchData = await promoterQuery.getDocuments("promoter_pool");

      setPromoterList(fetchData);
    } catch (error) {
      setPromoterList(undefined);
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
      id: "협회추가",
      text: "협회추가",
    },
  ];

  const refs = useRef(
    tabs.reduce((acc, tab) => {
      acc[tab.id] = React.createRef();
      return acc;
    }, {})
  );

  useEffect(() => {
    fetchPromoter();
  }, []);

  function handleTabClick(tab) {
    console.log(tab);
    setSelectedTab(tab);
  }

  useEffect(() => {
    console.log(selectedTab);
  }, [selectedTab]);

  return (
    <div className="flex w-full flex-col mt-5">
      <div
        className="flex w-full rounded-lg flex-col"
        style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
      >
        <div className="flex  w-full px-2 md:px-5 flex-col ">
          <span className="text-white p-5 font-semibold md:text-lg">
            협회관리
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
          {selectedTab.id === "전체목록" && promoterList?.length > 0 && (
            <PromoterList setSelectedTab={setSelectedTab} />
          )}
          {selectedTab.id === "협회내용" && promoterList?.length > 0 && (
            <PromoterManage mode={"read"} promoterId={selectedTab.promoterId} />
          )}
          {selectedTab.id === "협회수정" && promoterList?.length > 0 && (
            <PromoterManage mode={"edit"} promoterId={selectedTab.id} />
          )}
          {selectedTab.id === "협회추가" && <PromoterManage mode={"add"} />}
        </div>
      }
    </div>
  );
};

export default PromoterOnlyAdmin;

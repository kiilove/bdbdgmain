import React from "react";
import { useContext } from "react";
import { useState, Fragment } from "react";

import { RiSearchLine } from "react-icons/ri";
import { ReactComponent as AppIcon } from "../assets/svg/gen022.svg";
import { useEffect } from "react";
import { useRef } from "react";
import { CurrentContestContext } from "../contexts/CurrentContestContext";
import { useFirestoreQuery } from "../hooks/useFirestores";
import { where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const EntryList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [popupMenu, setPopupMenu] = useState(false);
  const [getEntrysData, setGetEntrysData] = useState([]);
  const [filterdEntrysData, setFilterdEntrysData] = useState([]);
  const [error, setError] = useState(null);

  const popupMenuRef = useRef(null);
  const { currentContest } = useContext(CurrentContestContext);
  const getEntryQuery = useFirestoreQuery();
  const navigate = useNavigate();

  const fetchEntryList = async () => {
    try {
      const fetchData = await getEntryQuery.getDocuments("contest_entry_list", [
        where("refContestId", "==", currentContest.id),
      ]);
      if (fetchData?.length > 0) {
        setGetEntrysData([...fetchData]);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleOutsideClick = (event) => {
    if (popupMenuRef.current && !popupMenuRef.current.contains(event.target)) {
      setPopupMenu(false);
    }
  };

  useEffect(() => {
    console.log(getEntrysData);
    setFilterdEntrysData([...getEntrysData]);
  }, [getEntrysData]);

  useEffect(() => {
    fetchEntryList();
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="flex w-full h-full flex-col gap-y-5">
      <div
        className="flex w-full h-full rounded-lg flex-wrap gap-2 box-border justify-between items-start p-5 "
        style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
      >
        <div className="flex justify-between items-center h-10 px-2 md:px-5 w-full relative">
          <div className="flex w-1/2 items-center">
            <span className="text-white py-5 font-semibold md:text-lg">
              참가신청서
            </span>
          </div>
          <div className="flex w-1/2 items-center justify-end">
            <button
              className="w-8 h-8 bg-blue-700 flex justify-center items-center rounded-lg"
              onClick={() => setPopupMenu(!popupMenu)}
            >
              <AppIcon className=" text-gray-200 w-6 h-6" />
            </button>
          </div>
          {popupMenu && (
            <div
              id="popupMenu"
              className="absolute right-3 md:right-6 top-10 w-56 h-56 md:w-72 md:h-72  shadow-lg rounded-lg flex flex-col"
              style={{ backgroundColor: "rgba(11,17,66,1)" }}
              ref={popupMenuRef}
            >
              <div className="flex w-full h-10 md:h-12 justify-start items-center font-sans text-sm lg:text-base font-semibold text-gray-200 px-5">
                검색조건
              </div>
              <div className="flex w-full h-1 justify-center items-center mb-4">
                <div
                  className="w-full bg-gray-600"
                  style={{
                    height: "1px",
                  }}
                ></div>
              </div>
              <div className="flex w-full flex-col gap-y-5">
                <div className="flex w-full justify-start items-center font-sans text-sm lg:text-base text-gray-200 flex-col px-5 gap-y-2">
                  <span className="flex w-full justify-start">확정여부 : </span>
                  <div className="flex w-full justify-start ">
                    <select className=" rounded-lg px-2 outline-none bg-gray-800 w-full h-10">
                      <option className="bg-transparent text-gray-200 font-sans">
                        전체
                      </option>
                      <option className="bg-transparent text-gray-200 font-sans">
                        입금대기
                      </option>
                      <option className="bg-transparent text-gray-200 font-sans">
                        확정
                      </option>
                    </select>
                  </div>
                </div>
                <div className="flex w-full justify-start items-center font-sans text-sm lg:text-base text-gray-200 flex-col px-5 gap-y-2">
                  <span className="flex w-full justify-start">확정여부 : </span>
                  <div className="flex w-full justify-start ">
                    <div className="flex w-full h-10 bg-gray-800 rounded-lg text-gray-200">
                      <span className="w-10 h-10 flex justify-center items-center">
                        <RiSearchLine />
                      </span>
                      <div className="flex w-full justify-start items-center">
                        <input
                          type="text"
                          className="w-full mr-3 bg-transparent outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex w-full h-1 justify-center items-center mb-4">
          <div
            className="w-full"
            style={{
              height: "1px",
              background: "radial-gradient(farthest-side,#a3a3a3, #0c1964)",
            }}
          ></div>
        </div>
        {filterdEntrysData?.length <= 0 && (
          <div
            className="flex w-full text-gray-200 rounded-lg  flex-col gap-y-3 border-gray-600 border-2 justify-center items-center"
            style={{
              backgroundColor: "rgba(11,17,66,0.7)",
              minHeight: "100px",
            }}
          >
            <span className="font-san font-semibold">
              아직 신청 접수된 내역이 없습니다.
            </span>
          </div>
        )}
        {filterdEntrysData?.length > 0 &&
          filterdEntrysData.map((data, idx) => (
            <div
              className="flex w-full lg:w-56 text-gray-200 rounded-lg  flex-col gap-y-3 border-gray-600 border-2  hover:cursor-pointer  hover:border-gray-200 box-border"
              style={{
                backgroundColor: "rgba(11,17,66,0.7)",
                minHeight: "100px",
              }}
              onClick={() =>
                navigate("/entrymanage", {
                  state: { entryId: data.id, entryList: [...getEntrysData] },
                })
              }
            >
              <div className="flex w-full justify-center items-center rounded-lg text-sm font-normal lg:text-base lg:font-semibold p-2">
                <div className="flex w-1/3 justify-center items-center">
                  {data.entryPlayerTitleProfile ? (
                    <img
                      src={data.entryPlayerTitleProfile.compressedUrl}
                      className="w-16 h-16 rounded-lg shadow-sm"
                    />
                  ) : (
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/bdbdgmain.appspot.com/o/images%2Fplayer_profiles%2Foriginal%2Fblank_profile.jpeg?alt=media&token=267d6700-3813-45a7-9c5d-d67f84f0c4ea"
                      className="w-16 h-16 rounded-lg shadow-sm"
                    />
                  )}
                </div>
                <div className="flex w-2/3">
                  <div className="flex flex-col w-full ml-3">
                    <div className="flex">
                      <span className="font-normal">
                        {data.entryPlayerName}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-normal">
                        {data.entryPlayerEmail}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-normal">
                        {data.entryPlayerPhoneNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="flex w-full flex-wrap gap-2 justify-start items-center h-full  rounded-lg text-sm p-3 flex-col"
                style={{
                  backgroundColor: "rgba(11,17,46,0.7)",
                  minHeight: "30px",
                }}
              ></div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default EntryList;

import React, { useEffect } from "react";
import { useContext } from "react";

import { useState } from "react";

import { ManualPlayerContext } from "../../contexts/ManualPlayerContext";

const ManualPlayerList = ({ setSelectedTab }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { manualPlayerList, setManualPlayerList } =
    useContext(ManualPlayerContext);
  const [filteredManualPlayerList, setFilteredManualPlayerList] = useState([
    manualPlayerList,
  ]);

  useEffect(() => {
    setFilteredManualPlayerList(manualPlayerList);
  }, [manualPlayerList]);

  return (
    <div className="flex w-full h-full flex-col gap-y-5 mt-5">
      <div
        className="flex w-full h-full rounded-lg flex-wrap gap-2 box-border justify-between items-start p-5"
        style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
      >
        <div className="flex justify-between items-center h-10 px-2 md:px-5">
          <span className="text-white p-5 font-semibold md:text-lg">
            전체목록
          </span>
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
        {manualPlayerList?.length > 0 &&
          filteredManualPlayerList.map((data, idx) => (
            <div
              className="flex w-full lg:w-56 text-gray-200 rounded-lg  flex-col gap-y-3 border-gray-600 border-2  hover:cursor-pointer  hover:border-gray-200 "
              style={{
                backgroundColor: "rgba(11,17,66,0.7)",
                minHeight: "100px",
              }}
              onClick={() =>
                setSelectedTab({ id: "선수정보", playerId: data.id })
              }
            >
              <div className="flex w-full justify-center items-center h-10  rounded-lg text-sm font-normal lg:text-base lg:font-semibold">
                {data.playerName}
              </div>
              <div
                className="flex w-full flex-wrap gap-2 justify-start items-center h-full  rounded-lg text-sm p-3 flex-col"
                style={{
                  backgroundColor: "rgba(11,17,46,0.7)",
                  minHeight: "30px",
                }}
              >
                <div className="flex">{data.judgeGym}</div>
                <div className="flex">{data.judgePhoneNumber}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ManualPlayerList;

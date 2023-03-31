import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiTwotoneAppstore } from "react-icons/ai";
import { ReactComponent as AppIcon } from "../assets/svg/gen022.svg";

const InvoiceList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
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

  return (
    <div className="flex w-full flex-col mt-5">
      <div
        className="flex w-full rounded-lg flex-col"
        style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
      >
        <div className="flex justify-between items-center h-10 px-2 md:px-5 w-full flex-col lg:flex-row">
          <div className="flex w-1/3 h-full justify-start items-center">
            <span className="text-white p-5 font-semibold md:text-lg">
              참가신청서
            </span>
          </div>
          <div className="flex w-1/3 h-full"></div>
          <div className="flex w-1/3 h-full justify-end items-center">
            <div className="flex w-8 h-8 bg-blue-900 p-1 rounded-lg">
              <AppIcon className="text-gray-200 " />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;

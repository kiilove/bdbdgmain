import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CurrentContestContext } from "../contexts/CurrentContestContext";
import { useFirestoreGetDocument } from "../hooks/useFirestores";
import ContestNotice from "./ContestNotice";
import Loading from "./Loading";

const ContestView = () => {
  const param = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [getNoticeData, setGetNoticeData] = useState({});
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

  return (
    <div className="flex w-full h-full flex-col gap-y-5">
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
              <div className="flex w-full flex-col px-2 md:px-5 gap-y-2 md:w-2/5 lg:w-3/6">
                <div className="flex items-start text-gray-200">
                  <span className="font-san font-semibold text-sm md:text-lg">
                    {getNoticeData.contestFullTitle}
                  </span>
                </div>
                <div className="flex items-start text-gray-400 gap-x-3">
                  <span className="font-san font-semibold text-sm md:text-base">
                    {getNoticeData.contestDate}
                  </span>
                  <span className="font-san font-semibold text-sm md:text-base">
                    {getNoticeData.contestLocation}
                  </span>
                  <span className="font-san font-semibold text-sm md:text-base">
                    {getNoticeData.contestStatus}
                  </span>
                </div>
                <div className="flex items-start text-gray-200 mt-2 gap-x-3">
                  <div className="flex w-44 h-20 border border-dashed border-gray-500 rounded-lg flex-col">
                    <div className="flex h-1/2 justify-start items-center ml-4">
                      <span className="text-lg font-bold">123</span>
                    </div>
                    <div className="flex h-1/2 justify-start items-center ml-4 text-gray-400">
                      <span className="text-sm font-bold">참가신청자</span>
                    </div>
                  </div>
                  <div className="flex w-44 h-20 border border-dashed border-gray-500 rounded-lg flex-col">
                    <div className="flex h-1/2 justify-start items-center ml-4">
                      <span className="text-lg font-bold">12</span>
                    </div>
                    <div className="flex h-1/2 justify-start items-center ml-4 text-gray-400">
                      <span className="text-sm font-bold">배정된 심판</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex w-full h-20 gap-x-0 md:gap-x-3">
            <div className="flex w-32 h-full border-transparent border-b-2 border-blue-700 justify-center items-end">
              <span className="text-gray-200 mb-4 font-sans md:font-semibold text-sm md:text-base">
                대회공고
              </span>
            </div>
            <div className="flex w-32 h-full border-transparent border-b-2 border-blue-700 justify-center items-end">
              <span className="text-gray-200 mb-4 font-sans md:font-semibold text-sm md:text-base">
                참가신청서
              </span>
            </div>
            <div className="flex w-32 h-full border-transparent border-b-2 border-blue-700 justify-center items-end">
              <span className="text-gray-200 mb-4 font-sans md:font-semibold text-sm md:text-base">
                종목/체급 관리
              </span>
            </div>
            <div className="flex w-32 h-full border-transparent border-b-2 border-blue-700 justify-center items-end">
              <span className="text-gray-200 mb-4 font-sans md:font-semibold text-sm md:text-base">
                심판 선발
              </span>
            </div>
          </div>
        </div>
      </div>
      {getNoticeData.id && (
        <div className="flex w-full">
          <ContestNotice mode={"read"} propContestNoticeId={getNoticeData.id} />
        </div>
      )}
    </div>
  );
};

export default ContestView;

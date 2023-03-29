import { where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useFirestoreQuery } from "../hooks/useFirestores";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

const ContestsList = ({ group }) => {
  const [getNotices, setGetNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const {
    data: noticeData,
    loading: noticeLoading,
    error: noticeError,
  } = useFirestoreQuery("contest_notice", [
    where("contestStatus", "==", "접수중"),
  ]);

  const handleRedirect = (contestId, contestNoticeId) => {
    navigate(`/contestview/${contestId}`);
  };

  const noticeCard = (contestId, contestNoticeId, imgSrc, title, status) => (
    <div
      className="flex w-56 h-full flex-col shadow border-2 border-gray-600 hover:cursor-pointer hover:border-gray-200 rounded-lg"
      onClick={() => {
        handleRedirect(contestId, contestNoticeId);
      }}
      style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
    >
      <div className="flex w-full h-44">
        <img
          src={imgSrc}
          className="w-full h-full object-cover object-top rounded-t-lg"
        />
      </div>
      <div className="flex w-full h-full p-3 bg-gray-100 rounded-b-md flex-col gap-y-2">
        <span className="text-gray-800 font-sans font-semibold text-sm">
          {title}
        </span>
        <span className="text-gray-800 font-sans font-semibold text-sm">
          {status}
        </span>
      </div>
    </div>
  );

  useEffect(() => {
    if (noticeData.length > 0) {
      setGetNotices([...noticeData]);
      setIsLoading(false);
    }
  }, [noticeData]);

  return (
    <div className="flex w-full h-full ">
      <div
        className="flex w-full h-full rounded-lg flex-col"
        style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
      >
        <div className="flex justify-between items-center h-16 px-5">
          <span className="text-white p-5 font-semibold md:text-lg">
            대회공고 리스트{group === "pre" && <span>(접수중)</span>}
          </span>
        </div>
        <div className="flex w-full h-1 justify-center items-center">
          <div
            className="w-full"
            style={{
              height: "1px",
              background: "radial-gradient(farthest-side,#a3a3a3, #0c1964)",
            }}
          ></div>
        </div>
        <div className="flex h-full w-full p-5 ">
          {isLoading && <Loading />}
          {getNotices.length > 0 &&
            getNotices.map((notice, idx) =>
              noticeCard(
                notice.refContestId,
                notice.id,
                notice.contestPosterTitle,
                notice.contestFullTitle,
                notice.contestStatus
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default ContestsList;

import React, { useMemo } from "react";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import {
  useFirestoreAddData,
  useFirestoreUpdateData,
} from "../hooks/useFirestores";

const StartPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const contestHook = useFirestoreAddData("contests");
  const updateContest = useFirestoreUpdateData("contests");
  const contestNoticeHook = useFirestoreAddData("contest_notice");
  const contestJudgesListHook = useFirestoreAddData("contest_judges_list");
  const contestCategoryListHook = useFirestoreAddData("contest_category_list");
  const contestGradesListHook = useFirestoreAddData("contest_grades_list");
  const contestInvoicesListHook = useFirestoreAddData("contest_invoices_list");

  const navigate = useNavigate();

  const handleStart = async () => {
    setIsLoading(true);

    try {
      const addedContest = await contestHook.addData({});

      const [
        contestNoticeData,
        contestJudgesListData,
        contestCategoryListData,
        contestGradesListData,
        contestInvoicesListData,
      ] = await Promise.all([
        contestNoticeHook
          .addData({
            refContestId: addedContest.id,
          })
          .catch((error) => {
            console.error("Error adding contest notice:", error);
            return null;
          }),
        contestJudgesListHook
          .addData({
            refContestId: addedContest.id,
            judgeIds: [],
          })
          .catch((error) => {
            console.error("Error adding contest judges list:", error);
            return null;
          }),
        contestCategoryListHook
          .addData({
            refContestId: addedContest.id,
            categoryIds: [],
          })
          .catch((error) => {
            console.error("Error adding contest category list:", error);
            return null;
          }),
        contestGradesListHook
          .addData({
            refContestId: addedContest.id,
            categoryIds: [],
          })
          .catch((error) => {
            console.error("Error adding contest grades list:", error);
            return null;
          }),
        contestInvoicesListHook
          .addData({
            refContestId: addedContest.id,
            invoiceIds: [],
          })
          .catch((error) => {
            console.error("Error adding contest invoices list:", error);
            return null;
          }),
      ]);

      // Check if any errors occurred during the Promise.all execution
      if (
        contestNoticeData &&
        contestJudgesListData &&
        contestCategoryListData &&
        contestGradesListData &&
        contestInvoicesListData
      ) {
        await updateContest.updateData(addedContest.id, {
          contestNoticeId: contestNoticeData.id,
          contestJudgesListId: contestJudgesListData.id,
          contestCategoryListId: contestCategoryListData.id,
          contestGradesListId: contestGradesListData.id,
          contestInvoicesListId: contestInvoicesListData.id,
        });
      } else {
        console.error(
          "One or more errors occurred while adding data to collections."
        );
      }
    } catch (error) {
      console.error("Error during the handleStart process:", error);
    } finally {
      setIsLoading(false);
      navigate("/contestnotice");
    }
  };

  return (
    <div className="flex w-full h-screen bg-transparent flex-col">
      <div className="flex w-full h-1/2 flex-col p-10">
        <div className="flex w-full h-full justify-center items-center flex-col gap-y-5">
          <h1 className="text-white md:text-2xl lg:text-4xl font-extrabold w-full text-center align-middle">
            대회 개설을 준비합니다.
          </h1>{" "}
          <h1 className="text-white md:text-2xl lg:text-4xl font-extrabold w-full text-center align-middle">
            개설 준비가 완료되면
          </h1>{" "}
          <h1 className="text-white md:text-2xl lg:text-4xl font-extrabold w-full text-center align-middle">
            다음 페이지로 자동으로 이동합니다.
          </h1>
        </div>
        <div className="flex w-full justify-center items-end mt-5">
          {isLoading ? (
            <button className=" w-40 h-10 md:h-14 bg-gray-900 border text-white text-lg font-bold">
              <span className="flex w-full h-full text-white text-base justify-center items-center">
                <ThreeDots
                  height="40"
                  width="40"
                  radius="9"
                  color="#fff"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              </span>
            </button>
          ) : (
            <button
              className=" w-40 h-10 md:h-14 bg-gray-900 border text-white text-lg font-bold"
              onClick={() => handleStart()}
            >
              <span>대회개설</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartPage;

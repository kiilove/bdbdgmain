import React from "react";
import { useState } from "react";
import {
  useFirestoreGetDocument,
  useFirestoreQuery,
} from "../hooks/useFirestores";
import { where } from "firebase/firestore";
import { useEffect } from "react";
import { CurrentContestContext } from "../contexts/CurrentContestContext";
import { useContext } from "react";
import { CategoryGradePairContext } from "../contexts/CategoryGradePairContext";
import useFirebaseStorage from "../hooks/useFirebaseStorage";
import CategoryList from "./basedata/CategoryList";

const EntryForm = ({ mode }) => {
  const [renderMode, setRenderMode] = useState(mode || "edit");
  const [files, setFiles] = useState([]);
  const [getNotices, setGetNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contestGradePair, setContestGradePair] = useState([]);
  const [entryInfo, setEntryInfo] = useState({});
  const [entryGrades, setEntryGrades] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const { currentContest } = useContext(CurrentContestContext);

  const noticeQuery = useFirestoreQuery();
  const { getDocument: contestGradePairDocument } = useFirestoreGetDocument(
    "contest_grades_list"
  );

  const { progress, urls, errors, representativeImage } = useFirebaseStorage(
    files,
    "images/player_profiles"
  );
  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
  };
  const fetchNotices = async () => {
    try {
      const fetchData = await noticeQuery.getDocuments("contest_notice", [
        where("contestStatus", "==", "접수중"),
      ]);

      setGetNotices(fetchData);
    } catch (error) {
      setGetNotices(undefined);
      console.error(error.code);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGradePair = async () => {
    try {
      const getData = await contestGradePairDocument(
        currentContest.contestGradesListId
      );

      if (getData.contestGrades.length > 0) {
        console.log(getData.contestGrades);

        setSelectedItems(getData.contestGrades);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const repackagePair = (data) => {
    const groupedData = data.reduce((acc, curr) => {
      const existingCategory = acc.find(
        (item) => item.category.id === curr.category.id
      );
      if (existingCategory) {
        existingCategory.matchedGrades.push(curr.matchedGrades);
      } else {
        acc.push({
          category: curr.category,
          matchedGrades: [curr.matchedGrades],
        });
      }
      return acc;
    }, []);

    // 결과 확인
    return groupedData;
  };

  const handleContestListOptions = () => {
    let contestOptions = [];
    if (getNotices?.length > 0) {
      getNotices.map((notice, idx) =>
        contestOptions.push({
          id: "entryContestId" + (idx + 1),
          name: "entryContestId" + (idx + 1),
          value: notice.id,
          text: notice.contestFullTitle,
        })
      );
    } else {
      contestOptions.push({
        id: "entryContestId1",
        name: "entryContestId1",
        value: "",
        text: "접수가능한 대회가 없습니다.",
      });
    }
    return contestOptions;
  };
  useEffect(() => {
    fetchNotices();
    fetchGradePair();
    console.log(getNotices);
  }, []);

  useEffect(() => {
    if (selectedItems.length > 0) {
      console.log(selectedItems);
    }
  }, [selectedItems]);

  const handleInputChange = (e) => {};
  const entry_inputs = [
    {
      index: 1,
      type: "select",
      name: "entryContestId",
      id: "entryContestId",

      disabled: renderMode === "add" || renderMode === "edit" ? false : true,
      label:
        renderMode === "add" || renderMode === "edit" ? (
          <span className="ml-2 lg:h-10  items-center flex">
            대회선택
            <span className="text-red-600 text-lg ml-2 align-middle ">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-8 items-center flex ">
            대회선택
          </span>
        ),
      tailClass:
        (renderMode === "add" || renderMode === "edit") &&
        "w-full h-10 rounded-lg px-4 outline-none text-gray-200",
      inlineStyleBg:
        (renderMode === "add" || renderMode === "edit") &&
        "rgba(5, 11, 54, 0.7)",

      options: handleContestListOptions(),
    },

    {
      index: 2,
      type: "text",
      name: "entryPlayerName",
      id: "entryPlayerName",
      required: true,
      value: entryInfo.contestFullTitle,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10  flex items-center">
            선수이름
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full  flex items-center">
            선수이름
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-center",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 3,
      type: "text",
      name: "entryPlayerAssociate",
      id: "entryPlayerAssociate",
      required: true,
      value: entryInfo.contestFullTitle,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10  flex items-center">
            소속(학교,체육관명)
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full  flex items-center">
            소속(학교,체육관명)
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-center",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 4,
      type: "text",
      name: "entryPlayerPhoneNumber",
      id: "entryPlayerPhoneNumber",
      required: true,
      value: entryInfo.contestFullTitle,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10  flex items-center">
            연락처
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full  flex items-center">
            연락처
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-center",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 5,
      type: "text",
      name: "entryPlayerBirthday",
      id: "entryPlayerBirthday",
      required: true,
      value: entryInfo.contestFullTitle,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10  flex items-center">
            생년월일
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full  flex items-center">
            생년월일
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-center",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 6,
      type: "text",
      name: "entryPlayerEmail",
      id: "entryPlayerEmail",
      required: true,
      value: entryInfo.contestFullTitle,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10  flex items-center">
            이메일
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full  flex items-center">
            이메일
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-center",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
  ];

  const entryInputRender = (
    <div className="flex w-full flex-col gap-y-0 md:gap-y-5 md:px-5 ">
      <div className="flex w-full flex-wrap p-5 flex-col gap-y-3 lg:gap-y-4 ">
        <div className="flex w-full flex-col ld:flex-row">
          <div className="flex w-full md:w-1/3 text-gray-300 font-semibold font-san h-10 items-center text-sm">
            {renderMode === "edit" ? (
              <span className="ml-2 flex items-center">
                프로필사진
                <span className="text-red-600 text-lg ml-2 align-middle">
                  *
                </span>
              </span>
            ) : (
              <span className="ml-2 text-gray-500 flex items-center">
                프로필사진
              </span>
            )}
          </div>
          <div className="flex w-full md:w-2/3">
            <label htmlFor="contestPoster">
              <input
                type="file"
                name="contestPoster"
                id="contestPoster"
                className="hidden"
                disabled={renderMode === "edit" ? false : true}
                onChange={handleFileChange}
              />
              {entryInfo.entryPlayerTitleProfile !== undefined && (
                <div className="flex ml-2 mb-2">
                  <img
                    src={entryInfo.entryPlayerTitleProfile}
                    className="w-20 rounded-lg"
                  />
                </div>
              )}
              {renderMode === "edit" && (
                <div className="w-32 h-8 mb-4 md:mb-0 rounded-lg px-2 bg-sky-500 text-white font-semibold text-sm flex justify-center items-center cursor-pointer">
                  사진선택
                </div>
              )}
            </label>
          </div>
        </div>

        {entry_inputs.map((input) => (
          <div className="flex w-full flex-col lg:flex-row lg:h-10">
            <div className="flex w-full lg:w-1/3 text-gray-300 font-semibold font-san items-center text-sm">
              {input.label}
            </div>
            <div className="flex w-full md:w-2/3 ">
              {input.type === "select" && renderMode !== "read" && (
                <select
                  name={input.name}
                  id={input.id}
                  className={input.tailClass}
                  style={{ backgroundColor: input.inlineStyleBg }}
                  onChange={(e) => handleInputChange(e)}
                >
                  {input.options.map((option) => (
                    <option
                      value={option.value}
                      selected={
                        renderMode !== "add" &&
                        option.value === entryInfo[input.name]
                      }
                    >
                      {option.text}
                    </option>
                  ))}
                </select>
              )}
              {input.type === "select" && renderMode === "read" && (
                <div className="flex justify-start items-center lg:h-10 font-sm font-normal lg:font-semibold text-gray-200 ">
                  {entryInfo[input.name]}
                </div>
              )}

              {input.type !== "select" && (
                <input
                  type={input.type}
                  name={input.name}
                  id={input.id}
                  value={input.value}
                  autoComplete="off"
                  disabled={input.disabled}
                  className={input.tailClass}
                  style={{ backgroundColor: input.inlineStyleBg }}
                  onChange={(e) => handleInputChange(e)}
                />
              )}
            </div>
          </div>
        ))}

        <div className="flex w-full flex-col lg:flex-row">
          <div className="flex w-full md:w-1/3 text-gray-300 font-semibold font-san h-10 items-center text-sm">
            {renderMode === "edit" ? (
              <span className="ml-2 flex items-center">
                출전동기
                <span className="text-red-600 text-lg ml-2 align-middle">
                  *
                </span>
              </span>
            ) : (
              <span className="ml-2 text-gray-500 flex items-center">
                출전동기
              </span>
            )}
          </div>
          <div className="flex w-full md:w-2/3">
            <textarea
              name="entryPlayerMotivation"
              id="entryPlayerMotivation"
              rows="4"
              className={
                renderMode === "edit"
                  ? "w-full rounded-lg px-4 outline-none text-gray-200"
                  : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent"
              }
              style={{
                backgroundColor:
                  renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
              }}
            />
          </div>
        </div>
        <div className="flex w-full flex-col lg:flex-row">
          <div className="flex md:w-1/3 text-gray-300 font-semibold font-san h-10 items-center text-sm">
            {renderMode === "edit" || renderMode === "add" ? (
              <span className="ml-2 flex items-center ">
                종목선택
                <span className="text-red-600 text-lg ml-2 align-middle">
                  *
                </span>
              </span>
            ) : (
              <span className="ml-2 text-gray-500 flex items-center">
                종목선택
              </span>
            )}
          </div>
          <div className="flex w-full md:w-2/3">
            <CategoryList mode={"entry"} setEntryGrades={setSelectedItems} />
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="flex w-full h-full flex-col gap-y-5">
      <div
        className="flex w-full h-full rounded-lg flex-wrap gap-2 box-border justify-between items-start p-5 "
        style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
      >
        <div className="flex justify-between items-center h-10 px-2 md:px-5 w-full relative">
          <div className="flex w-1/2 items-center">
            <span className="text-white py-5 font-semibold md:text-lg">
              참가신청서 대리작성
            </span>
          </div>
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
        <div className="flex h-full w-full p-0">{entryInputRender}</div>
      </div>
    </div>
  );
};

export default EntryForm;

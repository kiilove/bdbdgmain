import React from "react";
import { useState } from "react";
import {
  useFirestoreAddData,
  useFirestoreGetDocument,
  useFirestoreQuery,
  useFirestoreUpdateData,
} from "../hooks/useFirestores";
import { where } from "firebase/firestore";
import { useEffect } from "react";
import { CurrentContestContext } from "../contexts/CurrentContestContext";
import { useContext } from "react";
import { CategoryGradePairContext } from "../contexts/CategoryGradePairContext";
import useFirebaseStorage from "../hooks/useFirebaseStorage";
import CategoryList from "./basedata/CategoryList";
import { useLocation } from "react-router-dom";
import { generateEntryDocuID, koDate, parseDate } from "../functions/bdbdg";
import dayjs from "dayjs";

const EntryManage = ({ mode }) => {
  const [renderMode, setRenderMode] = useState(mode || "add");
  const [files, setFiles] = useState([]);
  const [getNotices, setGetNotices] = useState([]);
  const [entryId, setEntryId] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [contestGradePair, setContestGradePair] = useState([]);
  const [entryInfo, setEntryInfo] = useState({});
  const [entryList, setEntryList] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [message, setMessage] = useState({});
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const addEntry = useFirestoreAddData("contest_entry_list");
  const updateEntry = useFirestoreUpdateData("contest_entry_list");
  const { currentContest } = useContext(CurrentContestContext);

  const noticeQuery = useFirestoreQuery();
  const location = useLocation();

  const { getDocument: contestGradePairDocument } = useFirestoreGetDocument(
    "contest_grades_list"
  );

  const { progress, urls, errors, representativeImage } = useFirebaseStorage(
    files,
    "images/player_profiles"
  );

  dayjs.locale("ko");

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
  };
  const handleSavedConfirm = async () => {
    setIsMessageOpen(false);
  };

  const handleModalClose = () => {
    setIsMessageOpen(false);
  };

  const handleAddEntry = async () => {
    if (!entryInfo.entryPlayerName || selectedItems.length <= 0) {
      setIsMessageOpen(true);

      setMessage({
        title: "오류",
        body: "이름과 종목선택이 없습니다.",
        body: "두가지 항목은 반드시 입력되어야 합니다.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
      return;
    }
    try {
      const dateNow = dayjs().format("YYYY-MM-DD HH:MM:ss");
      console.log(dateNow);
      const addedData = await addEntry.addData({
        docuId: generateEntryDocuID(),
        entryIncomeDate: dateNow,
        ...entryInfo,
      });

      if (addedData) {
        setIsMessageOpen(true);
        setRenderMode("read");
        setMessage({
          title: "추가성공",
          body: "저장 되었습니다.",
          isButton: true,
          confirmButtonText: "확인",
          cancelButtonText: "",
        });
        const newEntryList = [...entryList];
        newEntryList.push({
          ...entryInfo,
        });
        setEntryList(newEntryList);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleUpdateEntry = async () => {
    if (!entryInfo.entryPlayerName || selectedItems.length <= 0) {
      setIsMessageOpen(true);

      setMessage({
        title: "오류",
        body: "이름과 종목선택이 없습니다.",
        body: "두가지 항목은 반드시 입력되어야 합니다.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
      return;
    }
    try {
      const updatedData = await updateEntry.updateData(entryId, {
        ...entryInfo,
      });

      if (updatedData) {
        setIsMessageOpen(true);
        setRenderMode("read");
        setMessage({
          title: "업데이트성공",
          body: "수정 되었습니다.",
          isButton: true,
          confirmButtonText: "확인",
          cancelButtonText: "",
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEntryInfo = () => {
    if (location.state?.entryList?.length > 0) {
      const findEntry = location.state.entryList.find(
        (entry) => entry.id === entryId
      );
      console.log(findEntry);
      setEntryInfo({ ...findEntry });
    }
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

    if (renderMode !== "add") {
      setEntryId(location.state.entryId);
    }

    console.log(getNotices);
  }, []);

  useEffect(() => {
    if (getNotices.length > 0) {
      setEntryInfo({
        ...entryInfo,
        refContestId: getNotices[0].refContestId,
        refcontestFullTitle: getNotices[0].contestFullTitle,
      });
    }
  }, [getNotices]);

  useEffect(() => {
    if (selectedItems.length > 0) {
      setEntryInfo({ ...entryInfo, entrySelectedGrades: [...selectedItems] });
    }
  }, [selectedItems]);

  useEffect(() => {
    if (urls.length > 0) {
      setFiles([]);
      console.log(urls);
      setEntryInfo({
        ...entryInfo,
        entryPlayerTitleProfile: { ...urls[0] },
      });
    }
  }, [urls]);

  useEffect(() => {
    console.log(entryInfo);
  }, [entryInfo]);

  useEffect(() => {
    if (renderMode !== "add" && location.state.entryList.length > 0) {
      setEntryList([...location.state.entryList]);
    }
  }, [location.state]);

  useEffect(() => {
    if (entryList.length) {
      handleEntryInfo();
    }
  }, [entryList]);

  const handleInputChange = (e) => {
    let inputValue;
    switch (e.target.name) {
      case "entryPlayerBirthday":
        inputValue = koDate(e.target.value);
        console.log(inputValue);

      default:
        inputValue = e.target.value;
    }
    setEntryInfo((prev) => ({
      ...prev,
      [e.target.name]: inputValue,
    }));
  };

  useEffect(() => {
    console.log(renderMode);
  }, [renderMode]);

  const entry_inputs = [
    {
      index: 1,
      type: "select",
      name: "refcontestFullTitle",
      id: "refcontestFullTitle",
      value: entryInfo.refcontestFullTitle,
      disabled: renderMode === "add" || renderMode === "edit" ? false : true,
      label:
        renderMode === "add" || renderMode === "edit" ? (
          <span className="ml-2 lg:h-10  items-center flex">
            대회선택
            <span className="text-red-600 text-lg ml-2 align-middle ">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-8 items-center flex ">
            대회명
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
      value: entryInfo.entryPlayerName,
      disabled: renderMode === "edit" || renderMode === "add" ? false : true,
      label:
        renderMode === "edit" || renderMode === "add" ? (
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
        renderMode === "edit" || renderMode === "add"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-center",
      inlineStyleBg:
        renderMode === "edit" || renderMode === "add"
          ? "rgba(5, 11, 54, 0.7)"
          : null,
    },
    {
      index: 3,
      type: "text",
      name: "entryPlayerAssociate",
      id: "entryPlayerAssociate",
      required: true,
      value: entryInfo.entryPlayerAssociate,
      disabled: renderMode === "edit" || renderMode === "add" ? false : true,
      label:
        renderMode === "edit" || renderMode === "add" ? (
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
        renderMode === "edit" || renderMode === "add"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-center",
      inlineStyleBg:
        renderMode === "edit" || renderMode === "add"
          ? "rgba(5, 11, 54, 0.7)"
          : null,
    },
    {
      index: 4,
      type: "text",
      name: "entryPlayerPhoneNumber",
      id: "entryPlayerPhoneNumber",
      required: true,
      value: entryInfo.entryPlayerPhoneNumber,
      disabled: renderMode === "edit" || renderMode === "add" ? false : true,
      label:
        renderMode === "edit" || renderMode === "add" ? (
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
        renderMode === "edit" || renderMode === "add"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-center",
      inlineStyleBg:
        renderMode === "edit" || renderMode === "add"
          ? "rgba(5, 11, 54, 0.7)"
          : null,
    },
    {
      index: 5,
      type: "text",
      name: "entryPlayerBirthday",
      id: "entryPlayerBirthday",
      required: true,
      value: entryInfo.entryPlayerBirthday,
      disabled: renderMode === "edit" || renderMode === "add" ? false : true,
      label:
        renderMode === "edit" || renderMode === "add" ? (
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
        renderMode === "edit" || renderMode === "add"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-center",
      inlineStyleBg:
        renderMode === "edit" || renderMode === "add"
          ? "rgba(5, 11, 54, 0.7)"
          : null,
    },
    {
      index: 6,
      type: "text",
      name: "entryPlayerEmail",
      id: "entryPlayerEmail",
      required: true,
      value: entryInfo.entryPlayerEmail,
      disabled: renderMode === "edit" || renderMode === "add" ? false : true,
      label:
        renderMode === "edit" || renderMode === "add" ? (
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
        renderMode === "edit" || renderMode === "add"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-center",
      inlineStyleBg:
        renderMode === "edit" || renderMode === "add"
          ? "rgba(5, 11, 54, 0.7)"
          : null,
    },
  ];

  const entryInputRender = (
    <div className="flex w-full flex-col gap-y-0 lg:gap-y-5 lg:px-5 ">
      <div className="flex w-full flex-wrap p-5 flex-col gap-y-3 lg:gap-y-4 ">
        <div className="flex w-full flex-col lg:flex-row">
          <div className="flex w-full lg:w-1/3 text-gray-300 font-semibold font-san h-10 items-center text-sm">
            {renderMode === "edit" || renderMode === "add" ? (
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
          <div className="flex w-full lg:w-2/3">
            <label htmlFor="contestPoster">
              <input
                type="file"
                name="contestPoster"
                id="contestPoster"
                className="hidden"
                disabled={
                  renderMode === "edit" || renderMode === "add" ? false : true
                }
                onChange={handleFileChange}
              />
              {entryInfo.entryPlayerTitleProfile !== undefined && (
                <div className="flex ml-2 mb-2">
                  <img
                    src={entryInfo.entryPlayerTitleProfile.compressedUrl}
                    className="w-20 rounded-lg"
                  />
                </div>
              )}
              {renderMode === "edit" ||
                (renderMode === "add" && (
                  <div className="w-32 h-8 mb-4 lg:mb-0 rounded-lg px-2 bg-sky-500 text-white font-semibold text-sm flex justify-center items-center cursor-pointer">
                    사진선택
                  </div>
                ))}
            </label>
          </div>
        </div>

        {entry_inputs.map((input) => (
          <div className="flex w-full flex-col lg:flex-row lg:h-10">
            <div className="flex w-full lg:w-1/3 text-gray-300 font-semibold font-san items-center text-sm">
              {input.label}
            </div>
            <div className="flex w-full lg:w-2/3 ">
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
                <div className="flex ml-2 justify-start items-center lg:h-10 font-sm font-semibold text-gray-200 ">
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
          <div className="flex w-full lg:w-1/3 text-gray-300 font-semibold font-san h-10 items-center text-sm">
            {renderMode === "edit" || renderMode === "add" ? (
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
          <div className="flex w-full lg:w-2/3">
            <textarea
              name="entryPlayerMotivation"
              id="entryPlayerMotivation"
              onChange={(e) => handleInputChange(e)}
              rows="2"
              value={entryInfo.entryPlayerMotivation}
              className={
                renderMode === "edit" || renderMode === "add"
                  ? "w-full rounded-lg px-4 outline-none text-gray-200"
                  : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent"
              }
              style={{
                backgroundColor:
                  renderMode === "edit" || renderMode === "add"
                    ? "rgba(5, 11, 54, 0.7)"
                    : null,
              }}
            />
          </div>
        </div>
        <div className="flex w-full flex-col lg:flex-row">
          <div className="flex lg:w-1/3 text-gray-300 font-semibold font-san h-10 items-center text-sm">
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
          <div className="flex w-full lg:w-2/3">
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
        <div className="flex justify-between items-center h-10 px-2 lg:px-5 w-full relative">
          <div className="flex w-1/2 items-center">
            <span className="text-white py-5 font-semibold lg:text-lg">
              {renderMode === "add" && "참가신청서 대리작성"}
              {renderMode === "read" && "참가신청서 정보"}
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
        <div className="flex h-full w-full p-0">
          <div className="flex w-full h-full flex-col">
            {entryInputRender}
            {renderMode === "add" && (
              <>
                <div className="flex w-full h-1 justify-center items-center">
                  <div
                    className="w-full"
                    style={{
                      height: "1px",
                      background:
                        "radial-gradient(farthest-side,#a3a3a3, #0c1964)",
                    }}
                  ></div>
                </div>

                <div className="flex h-full w-full p-5 justify-end">
                  <button
                    className="bg-gray-200 px-4 h-10 rounded-lg"
                    onClick={() => handleAddEntry()}
                  >
                    <span className="text-gray-900 font-semibold">
                      작성완료
                    </span>
                  </button>
                </div>
              </>
            )}
            {renderMode === "edit" && (
              <>
                <div className="flex w-full h-1 justify-center items-center">
                  <div
                    className="w-full"
                    style={{
                      height: "1px",
                      background:
                        "radial-gradient(farthest-side,#a3a3a3, #0c1964)",
                    }}
                  ></div>
                </div>

                <div className="flex h-full w-full p-5 justify-end">
                  <button
                    className="bg-gray-200 px-4 h-10 rounded-lg"
                    onClick={() => handleUpdateEntry()}
                  >
                    <span className="text-gray-900 font-semibold">
                      수정완료
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryManage;

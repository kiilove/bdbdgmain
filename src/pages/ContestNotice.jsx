import dayjs from "dayjs";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import useFirebaseStorage from "../hooks/useFirebaseStorage";
import {
  useFirestoreGetDocument,
  useFirestoreUpdateData,
} from "../hooks/useFirestores";
import ConfirmationModal from "../messageboxs/ConfirmationModal";

const ContestNotice = ({ mode, propContestNoticeId, syncState }) => {
  const [renderMode, setRenderMode] = useState(mode || "edit");
  const [contestNotice, setContestNotice] = useState({});
  const [files, setFiles] = useState([]);
  const [posterTheme, setPosterTheme] = useState([]);
  const [posterTitle, setPosterTitle] = useState(undefined);
  const [message, setMessage] = useState({});
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const updateContestNotice = useFirestoreUpdateData("contest_notice");
  const [contestNoticeId, setContestNoticeId] = useState(undefined);

  const {
    data: noticeData,
    loading: noticeLoading,
    error: noticeError,
    getDocument: noticeDocument,
  } = useFirestoreGetDocument("contest_notice");

  const { progress, urls, errors, representativeImage } = useFirebaseStorage(
    files,
    "images/poster"
  );

  const numberWithCommas = (x) => {
    if (x === undefined || x === "") {
      return;
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseDate = (dateStr) => {
    if (dateStr === undefined || dateStr === "") {
      return;
    }
    const today = dayjs();
    let date = dayjs(dateStr, ["M-D", "YYYY-M-D"], true);
    if (!date.isValid()) {
      return "";
    }
    // 입력받은 문자열이 '12-31' 형태인 경우에는 올해 연도를 자동으로 붙인다
    if (dateStr.length <= 6) {
      date = date.year(today.year());
    }
    return date.format("YYYY-MM-DD");
  };

  const handleInputChange = (e) => {
    switch (e.target.name) {
      case "contestBasicFee":
        setContestNotice((prev) => ({
          ...prev,
          [e.target.name]: parseInt(e.target.value.replace(/[^0-9]/g, "")),
        }));

        break;
      case "contestExtraFee":
        setContestNotice((prev) => ({
          ...prev,
          [e.target.name]: parseInt(e.target.value.replace(/[^0-9]/g, "")),
        }));
        break;
      default:
        setContestNotice((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
    }
  };

  const handleEditCancel = () => {
    setContestNotice({ ...noticeData });
    setRenderMode("read");
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
  };

  const handleSaveContestNotice = async () => {
    if (!contestNoticeId) {
      setIsMessageOpen(true);

      setMessage({
        title: "업데이트",
        body: "업데이트에 실패했습니다. 잠시후 다시 시도해주세요",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
      return;
    }
    try {
      const updatedData = await updateContestNotice.updateData(
        contestNoticeId,
        { ...contestNotice }
      );

      if (updatedData) {
        setIsMessageOpen(true);
        setRenderMode("read");
        setMessage({
          title: "업데이트",
          body: "저장되었습니다.",
          isButton: true,
          confirmButtonText: "확인",
          cancelButtonText: "",
        });
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      syncState(() => ({ ...contestNotice }));
    }
  };
  useMemo(() => {
    if (urls.length > 0) {
      setFiles([]);
      setPosterTitle(urls[0].compressedUrl);
      setPosterTheme([...urls[0].colorTheme]);
      setContestNotice((prev) => ({
        ...prev,
        contestPosterTitle: urls[0].compressedUrl,
        contestPosterTheme: [...urls[0].colorTheme],
      }));
    }
  }, [urls]);

  useEffect(() => {
    if (propContestNoticeId === undefined) {
      const currentContest = JSON.parse(localStorage.getItem("currentContest"));

      if (!currentContest) {
        setMessage({
          title: "오류",
          body: "대회정보를 읽어오지 못했습니다.",
          body2: "잘못된 진입일 수 있습니다.",
          isButton: true,
          confirmButtonText: "확인",
          cancelButtonText: "",
        });
        setIsMessageOpen(true);
        return;
      }

      setContestNoticeId(currentContest.contestNoticeId);
      const fetchData = async () => {
        await noticeDocument(currentContest.contestNoticeId);
      };
      fetchData();
    } else {
      setContestNoticeId(propContestNoticeId);
      const fetchData = async () => {
        await noticeDocument(propContestNoticeId);
      };
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (noticeData) {
      setContestNotice({ ...noticeData });
      setContestNoticeId(noticeData.id);
    }
  }, [noticeData]);

  const handleSavedConfirm = async () => {
    setIsMessageOpen(false);
    //navigate("/lobby", { replace: true });
  };

  const handleModalClose = () => {
    setIsMessageOpen(false);
  };
  const contest_inputs = [
    {
      index: 1,
      type: "text",
      name: "contestFullTitle",
      id: "contestFullTitle",
      required: true,
      value: contestNotice.contestFullTitle,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10  flex items-center">
            대회명 (전체이름)
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full  flex items-center">
            대회명 (전체이름)
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-center",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 2,
      type: "text",
      name: "contestShortTitle",
      id: "contestShortTitle",
      value: contestNotice.contestShortTitle,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10  flex items-center">
            대회명 (단축이름)
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full  flex items-center">
            대회명 (단축이름)
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-end",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 3,
      type: "number",
      name: "contestCount",
      id: "contestCount",
      required: true,
      value: contestNotice.contestCount,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10  flex items-center">
            회차
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full  flex items-center">
            회차
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 4,
      type: "text",
      name: "contestOrg",
      id: "contestOrg",
      required: true,
      value: contestNotice.contestOrg,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10  flex items-center">
            주관
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full  flex items-center">
            주관
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 5,
      type: "text",
      name: "contestPromoter",
      id: "contestPromoter",
      required: true,
      value: contestNotice.contestPromoter,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10 flex items-center">
            주최
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full flex items-center">
            주최
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 6,
      type: "text",
      name: "contestLocation",
      id: "contestLocation",
      required: true,
      value: contestNotice.contestLocation,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10 flex items-center">
            대회장소
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full flex items-center">
            대회장소
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 7,
      type: "text",
      name: "contestLocationAddress",
      id: "contestLocationAddress",
      value: contestNotice.contestLocationAddress,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10 flex items-center">대회장주소</span>
        ) : (
          <span className="ml-2 text-gray-500 h-full flex items-center">
            대회장주소
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 8,
      type: "text",
      name: "contestDate",
      id: "contestDate",
      required: true,
      value: contestNotice.contestDate,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10 flex items-center">
            개최일자
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full flex items-center">
            개최일자
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-32 h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-32 rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 9,
      type: "text",
      name: "contestBasicFee",
      id: "contestBasicFee",
      required: true,
      value: numberWithCommas(contestNotice.contestBasicFee),
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10 flex items-center">
            참가비
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full flex items-center">
            참가비
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-32 h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-32 rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
      externalComponent: (
        <div className="hidden md:flex ml-2 h-10 w-full items-center gap-x-2">
          <button
            className="bg-sky-500 px-2 rounded-lg h-8 w-14"
            onClick={() =>
              setContestNotice((prev) => ({
                ...prev,
                contestBasicFee:
                  parseInt(contestNotice.contestBasicFee) + 100000,
              }))
            }
          >
            <span className="text-gray-200 text-sm font-semibold">+10만</span>
          </button>
          <button
            className="bg-sky-500 px-2 rounded-lg h-8 w-14"
            onClick={() =>
              setContestNotice((prev) => ({
                ...prev,
                contestBasicFee:
                  parseInt(contestNotice.contestBasicFee) + 50000,
              }))
            }
          >
            <span className="text-gray-200 text-sm font-semibold">+5만</span>
          </button>
          <button
            className="bg-sky-500 px-2 rounded-lg h-8 w-14"
            onClick={() =>
              setContestNotice((prev) => ({
                ...prev,
                contestBasicFee:
                  parseInt(contestNotice.contestBasicFee) + 10000,
              }))
            }
          >
            <span className="text-gray-200 text-sm font-semibold">+1만</span>
          </button>
          <button
            className="bg-sky-500 px-2 rounded-lg h-8 w-16"
            onClick={() =>
              setContestNotice((prev) => ({
                ...prev,
                contestBasicFee: 0,
              }))
            }
          >
            <span className="text-gray-200 text-sm font-semibold">초기화</span>
          </button>
        </div>
      ),
    },

    {
      index: 10,
      type: "text",
      name: "contestExtraFee",
      id: "contestExtraFee",
      required: true,
      value: numberWithCommas(contestNotice.contestExtraFee),
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10 flex items-center">
            중복참가비
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full flex items-center">
            중복참가비
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-32 h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-32 rounded-lg px-4 font-semibold outline-none text-gray-200 bg-transparent ",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
      beforeExternalComponet:
        renderMode === "edit" ? (
          <div
            className="w-36 h-10 mr-2 bg-transparent flex justify-start items-center px-2 rounded-lg"
            style={{ backgroundColor: "rgba(5, 11, 54, 0.7) " }}
          >
            <select
              name="contestExtraType"
              id="contestExtraType"
              onChange={(e) =>
                setContestNotice((prev) => ({
                  ...prev,
                  contestExtraType: e.target.value,
                }))
              }
              className="w-full h-full text-gray-200 bg-transparent outline-none"
            >
              <option className="text-black " disabled>
                청구방식
              </option>
              <option
                className="text-black"
                value="정액"
                selected={contestNotice.contestExtraType === "정액"}
              >
                정액
              </option>
              <option
                className="text-black "
                value="누적"
                selected={contestNotice.contestExtraType === "누적"}
              >
                누적
              </option>
              <option
                className="text-black "
                value="없음"
                selected={contestNotice.contestExtraType === "없음"}
              >
                없음
              </option>
            </select>
          </div>
        ) : (
          <div className="flex w-16 px-2 text-white font-semibold justify-start items-center text-sm">
            {contestNotice.contestExtraType}
          </div>
        ),

      externalComponent: (
        <div className="ml-2 h-10 w-full items-center gap-x-2 hidden md:flex">
          <button
            className="bg-sky-500 px-2 rounded-lg h-8 w-14"
            onClick={() =>
              setContestNotice((prev) => ({
                ...prev,
                contestExtraFee:
                  parseInt(contestNotice.contestExtraFee) + 100000,
              }))
            }
          >
            <span className="text-gray-200 text-sm font-semibold">+10만</span>
          </button>
          <button
            className="bg-sky-500 px-2 rounded-lg h-8 w-14"
            onClick={() =>
              setContestNotice((prev) => ({
                ...prev,
                contestExtraFee:
                  parseInt(contestNotice.contestExtraFee) + 50000,
              }))
            }
          >
            <span className="text-gray-200 text-sm font-semibold">+5만</span>
          </button>
          <button
            className="bg-sky-500 px-2 rounded-lg h-8 w-14"
            onClick={() =>
              setContestNotice((prev) => ({
                ...prev,
                contestExtraFee:
                  parseInt(contestNotice.contestExtraFee) + 10000,
              }))
            }
          >
            <span className="text-gray-200 text-sm font-semibold">+1만</span>
          </button>
          <button
            className="bg-sky-500 px-2 rounded-lg h-8 w-16"
            onClick={() =>
              setContestNotice((prev) => ({
                ...prev,
                contestExtraFee: 0,
              }))
            }
          >
            <span className="text-gray-200 text-sm font-semibold">초기화</span>
          </button>
        </div>
      ),
    },
  ];

  const inputRender = (
    <div className="flex w-full flex-col gap-y-0 md:gap-y-5 md:px-5 ">
      <ConfirmationModal
        isOpen={isMessageOpen}
        onConfirm={handleSavedConfirm}
        onCancel={handleModalClose}
        message={message}
      />
      <div className="flex flex-col md:flex-row">
        <div className="flex w-full md:w-1/3 text-gray-300 font-semibold font-san h-10 items-center text-sm">
          {renderMode === "edit" ? (
            <span className="ml-2 flex items-center">
              대회포스터
              <span className="text-red-600 text-lg ml-2 align-middle">*</span>
            </span>
          ) : (
            <span className="ml-2 text-gray-500 flex items-center">
              대회포스터
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
            {contestNotice.contestPosterTitle !== undefined && (
              <div className="flex ml-2 mb-2">
                <img
                  src={contestNotice.contestPosterTitle}
                  className="w-20 rounded-lg"
                />
              </div>
            )}
            {renderMode === "edit" && (
              <div className="w-32 h-8 mb-4 md:mb-0 rounded-lg px-2 bg-sky-500 text-white font-semibold text-sm flex justify-center items-center cursor-pointer">
                포스터올리기
              </div>
            )}
          </label>
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="flex w-full md:w-1/3 text-gray-300 font-semibold font-san items-center text-sm">
          {renderMode === "edit" ? (
            <span className="ml-2">
              대회상태
              <span className="text-red-600 text-lg ml-2 align-middle">*</span>
            </span>
          ) : (
            <span className="ml-2 text-gray-500 h-full">대회상태</span>
          )}
        </div>
        <div className="flex w-full md:w-2/3">
          {renderMode === "edit" ? (
            <div
              className="w-36 h-10 mr-2 mb-4 md:mb-0 bg-transparent flex justify-start items-center px-2 rounded-lg"
              style={{ backgroundColor: "rgba(5, 11, 54, 0.7) " }}
            >
              <select
                name="contestStatus"
                id="contestStatus"
                onChange={(e) => handleInputChange(e)}
                className="w-full h-full text-gray-200 bg-transparent outline-none"
              >
                <option value="접수중" className="text-black">
                  접수중
                </option>
                <option value="접수마감" className="text-black">
                  접수마감
                </option>
                <option value="대회종료" className="text-black">
                  대회종료
                </option>
              </select>
            </div>
          ) : (
            <div className="flex text-gray-200 mb-4 items-center ">
              <span className="ml-2 font-semibold">
                {contestNotice.contestStatus}
              </span>
            </div>
          )}
        </div>
      </div>
      {contest_inputs.map((input, idx) => (
        <div className="flex md:h-10 flex-col md:flex-row ">
          <div className="flex w-full md:w-1/3 text-gray-300 font-semibold font-san items-center text-sm ">
            {input.label}
          </div>
          <div className="flex w-full md:w-2/3 gap-x-2 mb-4">
            {input.beforeExternalComponet && input.beforeExternalComponet}
            {input.name === "contestDate" ? (
              <input
                type={input.type}
                name={input.name}
                id={input.id}
                value={input.value}
                required={input.required}
                autoComplete="off"
                disabled={input.disabled}
                className={input.tailClass}
                style={{ backgroundColor: input.inlineStyleBg }}
                onBlur={(e) =>
                  setContestNotice({
                    ...contestNotice,
                    contestDate: parseDate(e.target.value),
                  })
                }
                onChange={(e) => handleInputChange(e)}
              />
            ) : (
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

            {input.externalComponent &&
              renderMode === "edit" &&
              input.externalComponent}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex w-full h-full ">
      <div
        className="flex w-full h-full rounded-lg flex-col"
        style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
      >
        <div className="flex justify-between items-center h-16 px-2 md:px-5">
          <span className="text-white p-5 font-semibold md:text-lg">
            {renderMode === "edit" ? "대회공고작성" : "대회공고"}
          </span>

          {renderMode !== "edit" && (
            <button
              className="bg-gray-200 px-4 h-10 rounded-lg mr-2"
              onClick={() => setRenderMode("edit")}
            >
              <span className="text-gray-900 font-semibold">수정</span>
            </button>
          )}
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

        <div className="flex h-full w-full p-5 ">{inputRender}</div>
        {renderMode === "edit" && (
          <>
            <div className="flex w-full h-1 justify-center items-center">
              <div
                className="w-full"
                style={{
                  height: "1px",
                  background: "radial-gradient(farthest-side,#a3a3a3, #0c1964)",
                }}
              ></div>
            </div>
            <div className="flex h-full w-full p-5 justify-end">
              <button
                className="bg-gray-200 px-4 h-10 rounded-lg mr-3"
                onClick={() => handleEditCancel()}
              >
                <span className="text-gray-900 font-semibold">취소</span>
              </button>
              <button
                className="bg-gray-200 px-4 h-10 rounded-lg"
                onClick={() => handleSaveContestNotice()}
              >
                <span className="text-gray-900 font-semibold">작성완료</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContestNotice;

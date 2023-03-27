import dayjs from "dayjs";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import useFirebaseStorage from "../hooks/useFirebaseStorage";
import { useFirestoreUpdateData } from "../hooks/useFirestores";
import ConfirmationModal from "../messageboxs/ConfirmationModal";

const ContestNotice = () => {
  const [renderMode, setRenderMode] = useState("edit");
  const [contestInfo, setContestInfo] = useState({
    contestBasicFee: 0,
    contestExtraFee: 0,
  });
  const [files, setFiles] = useState([]);
  const [posterTheme, setPosterTheme] = useState([]);
  const [posterTitle, setPosterTitle] = useState(undefined);
  const [message, setMessage] = useState({});
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const updateContestNotice = useFirestoreUpdateData("contest_notice");
  const [contestNoticeId, setContestNoticeId] = useState(undefined);

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
        setContestInfo((prev) => ({
          ...prev,
          [e.target.name]: parseInt(e.target.value.replace(/[^0-9]/g, "")),
        }));
        break;
      case "contestExtraFee":
        setContestInfo((prev) => ({
          ...prev,
          [e.target.name]: parseInt(e.target.value.replace(/[^0-9]/g, "")),
        }));
        break;
      default:
        setContestInfo((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
  };

  const handleSaveContestNotice = async () => {
    try {
      const updatedData = await updateContestNotice.updateData(
        contestNoticeId,
        { ...contestInfo }
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
    }
  };
  useMemo(() => {
    if (urls.length > 0) {
      setFiles([]);
      setPosterTitle(urls[0].compressedUrl);
      setPosterTheme([...urls[0].colorTheme]);
      setContestInfo((prev) => ({
        ...prev,
        contestPosterTitle: urls[0].compressedUrl,
        contestPosterTheme: [...urls[0].colorTheme],
      }));
    }
  }, [urls]);

  useEffect(() => {
    const currentContest = JSON.parse(localStorage.getItem("currentContest"));
    if (!currentContest) {
      setMessage({
        title: "오류",
        body: "대회정보를 읽어오지 못했습니다.",
        body2: "잘못된 진입일 수 있습니다.",
        body3: "첫화면으로 돌아갑니다.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
      setIsMessageOpen(true);
      return;
    }
    const id = currentContest.contestNoticeId;
    setContestNoticeId(id);
  }, []);

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
      value: contestInfo.contestFullTitle,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2">
            대회명 (전체이름)
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500">대회명 (전체이름)</span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 2,
      type: "text",
      name: "contestShortTitle",
      id: "contestShortTitle",
      value: contestInfo.contestShortTitle,
      disabled: renderMode === "edit" ? false : true,
      label: <span className="ml-2">대회명 (단축이름)</span>,
      tailClass:
        renderMode === "edit"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 3,
      type: "number",
      name: "contestCount",
      id: "contestCount",
      required: true,
      value: contestInfo.contestCount,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2">
            회차
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500">회차</span>
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
      value: contestInfo.contestOrg,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2">
            주관
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500">주관</span>
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
      value: contestInfo.contestPromoter,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2">
            주최
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500">주최</span>
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
      value: contestInfo.contestLocation,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2">
            대회장소
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500">대회장소</span>
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
      value: contestInfo.contestLocationAddress,
      disabled: renderMode === "edit" ? false : true,
      label: <span className="ml-2">대회장 주소</span>,
      tailClass:
        renderMode === "edit"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full h-10 rounded-lg px-4 outline-none text-gray-200 bg-transparent",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 8,
      type: "text",
      name: "contestDate",
      id: "contestDate",
      required: true,
      value: contestInfo.contestDate,
      disabled: renderMode === "edit" ? false : true,
      label: (
        <span className="ml-2">
          개최일자
          {renderMode === "edit" && (
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          )}
        </span>
      ),
      tailClass:
        renderMode === "edit"
          ? "w-32 h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-32 h-10 rounded-lg px-4 outline-none text-gray-200 bg-transparent",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 9,
      type: "text",
      name: "contestBasicFee",
      id: "contestBasicFee",
      required: true,
      value: numberWithCommas(contestInfo.contestBasicFee),
      disabled: renderMode === "edit" ? false : true,
      label: (
        <span className="ml-2">
          참가비
          {renderMode === "edit" && (
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          )}
        </span>
      ),
      tailClass:
        renderMode === "edit"
          ? "w-32 h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-32 h-10 rounded-lg px-4 outline-none text-gray-200 bg-transparent",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
      externalComponent: (
        <div className="hidden md:flex ml-2 h-10 w-full items-center gap-x-2">
          <button
            className="bg-sky-500 px-2 rounded-lg h-8 w-14"
            onClick={() =>
              setContestInfo((prev) => ({
                ...prev,
                contestBasicFee: parseInt(contestInfo.contestBasicFee) + 100000,
              }))
            }
          >
            <span className="text-gray-200 text-sm font-semibold">+10만</span>
          </button>
          <button
            className="bg-sky-500 px-2 rounded-lg h-8 w-14"
            onClick={() =>
              setContestInfo((prev) => ({
                ...prev,
                contestBasicFee: parseInt(contestInfo.contestBasicFee) + 50000,
              }))
            }
          >
            <span className="text-gray-200 text-sm font-semibold">+5만</span>
          </button>
          <button
            className="bg-sky-500 px-2 rounded-lg h-8 w-14"
            onClick={() =>
              setContestInfo((prev) => ({
                ...prev,
                contestBasicFee: parseInt(contestInfo.contestBasicFee) + 10000,
              }))
            }
          >
            <span className="text-gray-200 text-sm font-semibold">+1만</span>
          </button>
          <button
            className="bg-sky-500 px-2 rounded-lg h-8 w-16"
            onClick={() =>
              setContestInfo((prev) => ({
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
      value: numberWithCommas(contestInfo.contestExtraFee),
      disabled: renderMode === "edit" ? false : true,
      label: (
        <span className="ml-2">
          중복참가비
          {renderMode === "edit" && (
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          )}
        </span>
      ),
      tailClass:
        renderMode === "edit"
          ? "w-32 h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-32 h-10 rounded-lg px-4 outline-none text-gray-200 bg-transparent",
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
                setContestInfo((prev) => ({
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
                selected={contestInfo.contestExtraType === "정액"}
              >
                정액
              </option>
              <option
                className="text-black "
                value="누적"
                selected={contestInfo.contestExtraType === "누적"}
              >
                누적
              </option>
              <option
                className="text-black "
                value="없음"
                selected={contestInfo.contestExtraType === "없음"}
              >
                없음
              </option>
            </select>
          </div>
        ) : (
          <div className="flex w-16 h-10 px-4 text-white justify-start items-center text-sm">
            {contestInfo.contestExtraType}
          </div>
        ),

      externalComponent: (
        <div className="ml-2 h-10 w-full items-center gap-x-2 hidden md:flex">
          <button
            className="bg-sky-500 px-2 rounded-lg h-8 w-14"
            onClick={() =>
              setContestInfo((prev) => ({
                ...prev,
                contestExtraFee: parseInt(contestInfo.contestExtraFee) + 100000,
              }))
            }
          >
            <span className="text-gray-200 text-sm font-semibold">+10만</span>
          </button>
          <button
            className="bg-sky-500 px-2 rounded-lg h-8 w-14"
            onClick={() =>
              setContestInfo((prev) => ({
                ...prev,
                contestExtraFee: parseInt(contestInfo.contestExtraFee) + 50000,
              }))
            }
          >
            <span className="text-gray-200 text-sm font-semibold">+5만</span>
          </button>
          <button
            className="bg-sky-500 px-2 rounded-lg h-8 w-14"
            onClick={() =>
              setContestInfo((prev) => ({
                ...prev,
                contestExtraFee: parseInt(contestInfo.contestExtraFee) + 10000,
              }))
            }
          >
            <span className="text-gray-200 text-sm font-semibold">+1만</span>
          </button>
          <button
            className="bg-sky-500 px-2 rounded-lg h-8 w-16"
            onClick={() =>
              setContestInfo((prev) => ({
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
    <div className="flex w-full flex-col md:gap-y-5 md:px-5 ">
      <ConfirmationModal
        isOpen={isMessageOpen}
        onConfirm={handleSavedConfirm}
        onCancel={handleModalClose}
        message={message}
      />
      <div className="flex flex-col md:flex-row">
        <div className="flex w-full md:w-1/3 text-gray-300 font-semibold font-san h-10 items-center text-sm ml-2">
          대회포스터
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
            {posterTitle !== undefined && (
              <div className="flex py-2">
                <img src={posterTitle} className="w-20 rounded-lg" />
              </div>
            )}
            {renderMode === "edit" && (
              <div className="w-32 h-8 rounded-lg px-2 bg-sky-500 text-white font-semibold text-sm flex justify-center items-center cursor-pointer">
                포스터올리기
              </div>
            )}
          </label>
        </div>
      </div>
      {contest_inputs.map((input, idx) => (
        <div className="flex flex-col md:flex-row ">
          <div className="flex w-full md:w-1/3 text-gray-300 font-semibold font-san h-10 items-center text-sm ">
            {input.label}
          </div>
          <div className="flex w-full md:w-2/3 gap-x-2">
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
                  setContestInfo({
                    ...contestInfo,
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
        <div className="flex justify-between items-center h-16 px-5">
          <span className="text-white p-5 font-semibold md:text-lg">
            대회공고작성
          </span>
          {renderMode !== "edit" && (
            <button
              className="bg-gray-200 px-4 h-10 rounded-lg"
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

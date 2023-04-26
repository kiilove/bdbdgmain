import dayjs from "dayjs";
import React, { useEffect, useMemo } from "react";
import { useState, useRef } from "react";
import {
  useFirestoreAddData,
  useFirestoreUpdateData,
} from "../../hooks/useFirestores";
import useFirebaseStorage from "../../hooks/useFirebaseStorage";

import ConfirmationModal from "../../messageboxs/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { JudgeContext } from "../../contexts/JudgeContext";

const JudgeManage = ({ mode, judgeId }) => {
  const [renderMode, setRenderMode] = useState(mode || "edit");
  const [judgeInfo, setJudgeInfo] = useState({ judgePassword: "123456" });
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState({});
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const addJudge = useFirestoreAddData("judge_pool");
  const updateJudge = useFirestoreUpdateData("judge_pool");
  const uploadFiles = useFirebaseStorage(files, "image/judge/profiles");
  const { judgeList, setJudgeList } = useContext(JudgeContext);

  const [selectedTab, setSelectedTab] = useState({
    id: "전체목록",
    text: "전체목록",
  });

  const navigate = useNavigate();
  const tabs = [
    {
      id: "전체목록",
      text: "전체목록",
    },

    {
      id: "심판추가",
      text: "심판추가",
    },
  ];

  const handleInputChange = (e) => {
    setJudgeInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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

  const handleAddJudge = async () => {
    if (!judgeInfo.judgeName) {
      setIsMessageOpen(true);

      setMessage({
        title: "오류",
        body: "심판이름은 필수항목입니다.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
      return;
    }
    try {
      const addedData = await addJudge.addData({
        ...judgeInfo,
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
        const newJudgeList = [...judgeList];
        newJudgeList.push({
          ...judgeInfo,
        });
        setJudgeList(newJudgeList);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleUpdateJudge = async () => {
    if (!judgeInfo.judgeName) {
      setIsMessageOpen(true);

      setMessage({
        title: "오류",
        body: "심판 이름은 필수항목입니다.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
      return;
    }
    try {
      const updatedData = await updateJudge.updateData(judgeId, {
        ...judgeInfo,
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

  const handleJudgeInfo = () => {
    const findJudge = judgeList.find((judge) => judge.id === judgeId);
    console.log(findJudge);
    setJudgeInfo({ ...findJudge });
  };

  useEffect(() => {
    if (renderMode === "read" || renderMode === "edit") {
      handleJudgeInfo();
    }
  }, [renderMode]);

  useEffect(() => {
    if (uploadFiles.urls.length > 0) {
      setFiles([]);
      setJudgeInfo({
        ...judgeInfo,
        judgeProfile: { ...uploadFiles.urls[0] },
      });
    }
  }, [uploadFiles.urls]);

  const judge_inputs = [
    {
      index: 1,
      type: "text",
      name: "judgeName",
      lang: "ko",
      id: "judgeName",
      required: true,
      value: judgeInfo.judgeName,
      disabled: renderMode === "edit" || renderMode === "add" ? false : true,
      label:
        renderMode === "edit" || renderMode === "add" ? (
          <span className="ml-2 h-10  flex items-center">
            이름
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full  flex items-center">
            이름
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
      index: 2,
      type: "text",
      name: "judgePhoneNumber",
      id: "judgePhoneNumber",
      required: true,
      value: judgeInfo.judgePhoneNumber,
      disabled: renderMode === "edit" || renderMode === "add" ? false : true,
      label:
        renderMode === "edit" || renderMode === "add" ? (
          <span className="ml-2 h-10  flex items-center">
            휴대전화
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full  flex items-center">
            휴대전화
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
      name: "judgePromoter",
      id: "judgePromoter",
      required: true,
      lang: "ko",
      value: judgeInfo.judgePromoter,
      disabled: renderMode === "edit" || renderMode === "add" ? false : true,
      label:
        renderMode === "edit" || renderMode === "add" ? (
          <span className="ml-2 h-10  flex items-center">
            소속
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full  flex items-center">
            소속
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
      name: "judgeEmail",
      id: "judgeEmail",
      required: true,
      value: judgeInfo.judgeEmail,
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
    {
      index: 5,
      type: "password",
      name: "judgePassword",
      id: "judgePassword",
      defaultValue: "123456",
      required: true,
      value: judgeInfo.judgePassword,
      disabled: renderMode === "edit" || renderMode === "add" ? false : true,
      label:
        renderMode === "edit" || renderMode === "add" ? (
          <span className="ml-2 h-10  flex items-center">
            비밀번호
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full  flex items-center">
            비밀번호
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
          {renderMode === "edit" || renderMode === "add" ? (
            <span className="ml-2 flex items-center">
              심판프로필
              <span className="text-red-600 text-lg ml-2 align-middle">*</span>
            </span>
          ) : (
            <span className="ml-2 text-gray-500 flex items-center">
              심판프로필
            </span>
          )}
        </div>

        <div className="flex w-full md:w-2/3">
          <label htmlFor="judgeProfile">
            <input
              type="file"
              name="judgeProfile"
              id="judgeProfile"
              className="hidden"
              disabled={
                renderMode === "edit" || renderMode === "add" ? false : true
              }
              onChange={handleFileChange}
            />
            {judgeInfo.judgeProfile !== undefined && (
              <div className="flex ml-2 mb-2">
                <img
                  src={judgeInfo.judgeProfile.compressedUrl}
                  className="w-20 rounded-lg"
                />
              </div>
            )}
            {(renderMode === "edit" || renderMode === "add") && (
              <div className="w-32 h-8 mb-4 md:mb-0 rounded-lg px-2 bg-sky-500 text-white font-semibold text-sm flex justify-center items-center cursor-pointer">
                프로필 올리기
              </div>
            )}
          </label>
        </div>
      </div>

      {judge_inputs.map((input, idx) => (
        <div className="flex md:h-10 flex-col md:flex-row ">
          <div className="flex w-full md:w-1/3 text-gray-300 font-semibold font-san items-center text-sm ">
            {input.label}
          </div>
          <div className="flex w-full md:w-2/3 gap-x-2 mb-4">
            {input.beforeExternalComponet && input.beforeExternalComponet}
            {input.name !== "judgePromoter"}
            <input
              type={input.type}
              name={input.name}
              id={input.id}
              value={input.value}
              autoComplete="off"
              defaultValue={input.defaultValue}
              disabled={input.disabled}
              className={input.tailClass}
              style={{ backgroundColor: input.inlineStyleBg }}
              onChange={(e) => handleInputChange(e)}
            />

            {input.externalComponent &&
              renderMode === "edit" &&
              input.externalComponent}
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <div className="flex w-full h-full flex-col gap-y-5 mt-5">
      <ConfirmationModal
        isOpen={isMessageOpen}
        onConfirm={handleSavedConfirm}
        onCancel={handleModalClose}
        message={message}
      />
      <div
        className="flex w-full h-full rounded-lg flex-col"
        style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
      >
        <div className="flex justify-between items-center h-16 px-2 md:px-5">
          <span className="text-white p-5 font-semibold md:text-lg">
            {renderMode === "add" && "심판추가"}
            {renderMode === "edit" && "심판수정"}
            {renderMode === "read" && "심판정보"}
          </span>

          {renderMode === "read" && (
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
        {renderMode === "add" && (
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
                onClick={() => handleAddJudge()}
              >
                <span className="text-gray-900 font-semibold">작성완료</span>
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
                  background: "radial-gradient(farthest-side,#a3a3a3, #0c1964)",
                }}
              ></div>
            </div>
            <div className="flex h-full w-full p-5 justify-end">
              <button
                className="bg-gray-200 px-4 h-10 rounded-lg"
                onClick={() => handleUpdateJudge()}
              >
                <span className="text-gray-900 font-semibold">수정완료</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default JudgeManage;

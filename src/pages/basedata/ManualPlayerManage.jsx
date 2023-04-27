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
import { ManualPlayerContext } from "../../contexts/ManualPlayerContext";

const ManualPlayerManage = ({ mode, playerId }) => {
  const [renderMode, setRenderMode] = useState(mode || "edit");
  const [playerInfo, setPlayerInfo] = useState();
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState({});
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const addPlayer = useFirestoreAddData("manual_player_pool");
  const updatePlayer = useFirestoreUpdateData("manual_player_pool");
  const uploadFiles = useFirebaseStorage(files, "image/judge/profiles");
  const { manualPlayerList, setManualPlayerList } =
    useContext(ManualPlayerContext);
  const playerNameRef = useRef(null);

  const initPlayerInfo = () => {
    setFiles([]);
    setPlayerInfo({
      playerName: "",
      playerGym: "",
      playerPhoneNumber: "",
      playerEmail: "",
    });
    playerNameRef.current.focus();
  };

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
      id: "선수추가",
      text: "선수추가",
    },
  ];

  const handleInputChange = (e) => {
    setPlayerInfo((prev) => ({
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
    playerNameRef.current.focus();
  };

  const handleModalClose = () => {
    setIsMessageOpen(false);
    playerNameRef.current.focus();
  };

  const handleAddPlayer = async () => {
    if (!playerInfo.playerName) {
      setIsMessageOpen(true);

      setMessage({
        title: "오류",
        body: "선수이름은 필수항목입니다.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
      return;
    }
    try {
      const addedData = await addPlayer.addData({
        ...playerInfo,
      });

      if (addedData) {
        setIsMessageOpen(true);
        setRenderMode("add");
        setMessage({
          title: "추가성공",
          body: "저장 되었습니다.",
          isButton: true,
          confirmButtonText: "확인",
          cancelButtonText: "",
        });
        const newPlayerList = [...manualPlayerList];
        newPlayerList.push({
          ...playerInfo,
        });
        setManualPlayerList(newPlayerList);
        initPlayerInfo();
        playerNameRef.current.fucus();
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleUpdatePlayer = async () => {
    if (!playerInfo.playerName) {
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
      const updatedData = await updatePlayer.updateData(playerId, {
        ...playerInfo,
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

  const handlePlayerInfo = () => {
    const findPlayer = manualPlayerList.find(
      (player) => player.id === playerId
    );

    setPlayerInfo({ ...findPlayer });
  };

  useEffect(() => {
    if (renderMode === "read" || renderMode === "edit") {
      handlePlayerInfo();
    }
  }, [renderMode]);

  useEffect(() => {
    playerNameRef.current.focus();
  }, []);

  useEffect(() => {
    if (uploadFiles.urls.length > 0) {
      setFiles([]);
      setPlayerInfo({
        ...playerInfo,
        playerProfile: { ...uploadFiles.urls[0] },
      });
    }
  }, [uploadFiles.urls]);

  const player_inputs = [
    {
      index: 1,
      type: "text",
      name: "playerName",
      lang: "ko",
      id: "playerName",
      ref: { playerNameRef },
      required: true,
      value: playerInfo?.playerName,
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
      name: "playerGym",
      id: "playerGym",
      required: true,
      lang: "ko",
      value: playerInfo?.playerGym,
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
      index: 3,
      type: "text",
      name: "playerPhoneNumber",
      id: "playerPhoneNumber",
      required: true,
      value: playerInfo?.playerPhoneNumber,
      disabled: renderMode === "edit" || renderMode === "add" ? false : true,
      label:
        renderMode === "edit" || renderMode === "add" ? (
          <span className="ml-2 h-10  flex items-center">휴대전화</span>
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
      index: 4,
      type: "text",
      name: "playerEmail",
      id: "playerEmail",
      required: true,
      value: playerInfo?.playerEmail,
      disabled: renderMode === "edit" || renderMode === "add" ? false : true,
      label:
        renderMode === "edit" || renderMode === "add" ? (
          <span className="ml-2 h-10  flex items-center">이메일</span>
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
            <span className="ml-2 flex items-center">선수프로필</span>
          ) : (
            <span className="ml-2 text-gray-500 flex items-center">
              선수프로필
            </span>
          )}
        </div>

        <div className="flex w-full md:w-2/3">
          <label htmlFor="playerProfile">
            <input
              type="file"
              name="playerProfile"
              id="playerProfile"
              className="hidden"
              disabled={
                renderMode === "edit" || renderMode === "add" ? false : true
              }
              onChange={handleFileChange}
            />
            {playerInfo?.playerProfile !== undefined && (
              <div className="flex ml-2 mb-2">
                <img
                  src={playerInfo.playerProfile?.compressedUrl}
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

      {player_inputs.map((input, idx) => (
        <div className="flex md:h-10 flex-col md:flex-row ">
          <div className="flex w-full md:w-1/3 text-gray-300 font-semibold font-san items-center text-sm ">
            {input.label}
          </div>
          <div className="flex w-full md:w-2/3 gap-x-2 mb-4">
            {input.beforeExternalComponet && input.beforeExternalComponet}
            {input.name === "playerName" ? (
              <input
                type={input.type}
                name={input.name}
                id={input.id}
                value={input.value}
                autoComplete="off"
                ref={playerNameRef}
                defaultValue={input.defaultValue}
                disabled={input.disabled}
                className={input.tailClass}
                style={{ backgroundColor: input.inlineStyleBg }}
                onChange={(e) => handleInputChange(e)}
              />
            ) : (
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
            {renderMode === "add" && "선수추가"}
            {renderMode === "edit" && "선수수정"}
            {renderMode === "read" && "선수정보"}
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
                onClick={() => handleAddPlayer()}
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
                onClick={() => handleUpdatePlayer()}
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

export default ManualPlayerManage;

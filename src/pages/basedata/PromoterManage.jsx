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
import { PromoterContext } from "../../contexts/PromoterContext";

const PromoterManage = ({ mode, promoterId }) => {
  const [renderMode, setRenderMode] = useState(mode || "edit");
  const [promoterInfo, setPromoterInfo] = useState({});
  const [logoFiles, setLogoFiles] = useState([]);
  const [stampFiles, setStampFiles] = useState([]);
  const [message, setMessage] = useState({});
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const addPromoter = useFirestoreAddData("promoter_pool");
  const updatePromoter = useFirestoreUpdateData("promoter_pool");
  const uploadLogo = useFirebaseStorage(logoFiles, "image/logos");
  const uploadStamp = useFirebaseStorage(stampFiles, "image/stamps");
  const { promoterList, setPromoterList } = useContext(PromoterContext);

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
      id: "협회추가",
      text: "협회추가",
    },
  ];

  const handleInputChange = (e) => {
    setPromoterInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogoFileChange = (e) => {
    const selectedFiles = e.target.files;
    setLogoFiles(selectedFiles);
  };

  const handleStampFileChange = (e) => {
    const selectedFiles = e.target.files;
    setStampFiles(selectedFiles);
  };

  const handleSavedConfirm = async () => {
    setIsMessageOpen(false);
  };

  const handleModalClose = () => {
    setIsMessageOpen(false);
  };

  const handleAddPromoter = async () => {
    if (!promoterInfo.promoterFullTitle) {
      setIsMessageOpen(true);

      setMessage({
        title: "오류",
        body: "협회(전체이름)은 필수항목입니다.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
      return;
    }
    try {
      const addedData = await addPromoter.addData({
        ...promoterInfo,
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
        const newPromoterList = [...promoterList];
        newPromoterList.push({
          ...promoterInfo,
        });
        setPromoterList(newPromoterList);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleUpdatePromoter = async () => {
    if (!promoterInfo.promoterFullTitle) {
      setIsMessageOpen(true);

      setMessage({
        title: "오류",
        body: "협회(전체이름)은 필수항목입니다.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
      return;
    }
    try {
      const updatedData = await updatePromoter.updateData(promoterId, {
        ...promoterInfo,
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

  const handlePromoterInfo = () => {
    const findPromoter = promoterList.find(
      (promoter) => promoter.id === promoterId
    );
    console.log(findPromoter);
    setPromoterInfo({ ...findPromoter });
  };

  useEffect(() => {
    if (renderMode === "read" || renderMode === "edit") {
      handlePromoterInfo();
    }
  }, [renderMode]);

  useEffect(() => {
    if (uploadLogo.urls.length > 0) {
      setLogoFiles([]);
      setPromoterInfo({
        ...promoterInfo,
        promoterLogo: { ...uploadLogo.urls[0] },
      });
    }
  }, [uploadLogo.urls]);

  useEffect(() => {
    if (uploadStamp.urls.length > 0) {
      setStampFiles([]);
      setPromoterInfo({
        ...promoterInfo,
        promoterStamp: { ...uploadStamp.urls[0] },
      });
    }
  }, [uploadStamp.urls]);

  const promoter_inputs = [
    {
      index: 1,
      type: "text",
      name: "promoterFullTitle",
      id: "promoterFullTitle",
      required: true,
      value: promoterInfo.promoterFullTitle,
      disabled: renderMode === "edit" || renderMode === "add" ? false : true,
      label:
        renderMode === "edit" || renderMode === "add" ? (
          <span className="ml-2 h-10  flex items-center">
            협회이름 (전체이름)
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full  flex items-center">
            협회이름 (전체이름)
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
      name: "promoterShortTitle",
      id: "promoterShortTitle",
      required: true,
      value: promoterInfo.promoterShortTitle,
      disabled: renderMode === "edit" || renderMode === "add" ? false : true,
      label:
        renderMode === "edit" || renderMode === "add" ? (
          <span className="ml-2 h-10  flex items-center">
            협회이름 (짧은이름)
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full  flex items-center">
            협회이름 (짧은이름)
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
      name: "promoterAdminId",
      id: "promoterAdminId",
      required: true,
      value: promoterInfo.promoterAdminId,
      disabled: renderMode === "edit" || renderMode === "add" ? false : true,
      label:
        renderMode === "edit" || renderMode === "add" ? (
          <span className="ml-2 h-10  flex items-center">
            협회관리자ID
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full  flex items-center">
            협회관리자ID
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
      type: "password",
      name: "promoterAdminPassword",
      id: "promoterAdminPassword",
      defaultValue: "123456",
      required: true,
      value: promoterInfo.promoterAdminPassword,
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
              협회로고
              <span className="text-red-600 text-lg ml-2 align-middle">*</span>
            </span>
          ) : (
            <span className="ml-2 text-gray-500 flex items-center">
              협회로고
            </span>
          )}
        </div>

        <div className="flex w-full md:w-2/3">
          <label htmlFor="promoterLogo">
            <input
              type="file"
              name="promoterLogo"
              id="promoterLogo"
              className="hidden"
              disabled={
                renderMode === "edit" || renderMode === "add" ? false : true
              }
              onChange={handleLogoFileChange}
            />
            {promoterInfo.promoterLogo !== undefined && (
              <div className="flex ml-2 mb-2">
                <img
                  src={promoterInfo.promoterLogo.compressedUrl}
                  className="w-20 rounded-lg"
                />
              </div>
            )}
            {(renderMode === "edit" || renderMode === "add") && (
              <div className="w-32 h-8 mb-4 md:mb-0 rounded-lg px-2 bg-sky-500 text-white font-semibold text-sm flex justify-center items-center cursor-pointer">
                로고올리기
              </div>
            )}
          </label>
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="flex w-full md:w-1/3 text-gray-300 font-semibold font-san h-10 items-center text-sm">
          {renderMode === "edit" || renderMode === "add" ? (
            <span className="ml-2 flex items-center">
              협회직인
              <span className="text-red-600 text-lg ml-2 align-middle">*</span>
            </span>
          ) : (
            <span className="ml-2 text-gray-500 flex items-center">
              협회직인
            </span>
          )}
        </div>

        <div className="flex w-full md:w-2/3">
          <label htmlFor="promoterStamp">
            <input
              type="file"
              name="promoterStamp"
              id="promoterStamp"
              className="hidden"
              disabled={
                renderMode === "edit" || renderMode === "add" ? false : true
              }
              onChange={handleStampFileChange}
            />
            {promoterInfo.promoterStamp !== undefined && (
              <div className="flex ml-2 mb-2">
                <img
                  src={promoterInfo.promoterStamp.compressedUrl}
                  className="w-20 rounded-lg"
                />
              </div>
            )}
            {(renderMode === "edit" || renderMode === "add") && (
              <div className="w-32 h-8 mb-4 md:mb-0 rounded-lg px-2 bg-sky-500 text-white font-semibold text-sm flex justify-center items-center cursor-pointer">
                협회직인올리기
              </div>
            )}
          </label>
        </div>
      </div>
      {promoter_inputs.map((input, idx) => (
        <div className="flex md:h-10 flex-col md:flex-row ">
          <div className="flex w-full md:w-1/3 text-gray-300 font-semibold font-san items-center text-sm ">
            {input.label}
          </div>
          <div className="flex w-full md:w-2/3 gap-x-2 mb-4">
            {input.beforeExternalComponet && input.beforeExternalComponet}
            {input.name !== "promoterAdminPassword"}
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
            {renderMode === "add" && "협회추가"}
            {renderMode === "edit" && "협회수정"}
            {renderMode === "read" && "협회내용"}
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
                onClick={() => handleAddPromoter()}
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
                onClick={() => handleUpdatePromoter()}
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

export default PromoterManage;

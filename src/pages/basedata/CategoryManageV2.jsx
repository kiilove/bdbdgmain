import React, { useMemo } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { CategoryGradePairContext } from "../../contexts/CategoryGradePairContext";
import {
  useFirestoreAddData,
  useFirestoreUpdateData,
  useFirestoreDeleteData,
  useFirestoreQuery,
} from "../../hooks/useFirestores";
import ConfirmationModal from "../../messageboxs/ConfirmationModal";
import { CategorysGradesContext } from "../../contexts/CategoryContext";

const CategoryManageV2 = ({ mode, categoryId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [renderMode, setRenderMode] = useState(mode || "edit");

  const [categoryInfo, setCategoryInfo] = useState({});
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [gradeInfo, setGradeInfo] = useState({});
  const [gradeArray, setGradeArray] = useState([]);
  const [message, setMessage] = useState({});
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const { categoryList, gradeList, setCategoryList, setGradeList, loading } =
    useContext(CategorysGradesContext);
  const { deleteData: gradeDeleteData } = useFirestoreDeleteData("grade_pool");
  const { addData: gradeAddData } = useFirestoreAddData("grade_pool");
  const { updateData: gradeUpdateData } = useFirestoreUpdateData("grade_pool");
  const { updateData: categoryUpdateData } =
    useFirestoreUpdateData("category_pool");

  const handleModalClose = () => {
    setIsMessageOpen(false);
  };

  const category_inputs = [
    {
      index: 1,
      type: "number",
      name: "categoryIndex",
      id: "categoryIndex",
      required: true,
      value: categoryInfo?.categoryIndex,

      disabled: renderMode === "add" || renderMode === "edit" ? false : true,
      label:
        renderMode === "add" || renderMode === "edit" ? (
          <span className="ml-2 h-10 flex items-center">
            노출순위
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 lg:h-10 flex items-center">
            노출순위
          </span>
        ),
      tailClass:
        renderMode === "add" || renderMode === "edit"
          ? " h-10 rounded-lg px-4 outline-none text-gray-200 w-32"
          : " rounded-lg px-0 font-semibold outline-none text-gray-200 bg-transparent lg:h-10 flex items-center w-32",
      inlineStyleBg:
        renderMode === "add" || renderMode === "edit"
          ? "rgba(5, 11, 54, 0.7)"
          : null,
    },
    {
      index: 2,
      type: "text",
      name: "categoryTitle",
      id: "categoryTitle",
      required: true,
      value: categoryInfo?.categoryTitle,
      disabled: renderMode === "add" || renderMode === "edit" ? false : true,
      label:
        renderMode === "add" || renderMode === "edit" ? (
          <span className="ml-2 h-10 flex items-center">
            종목명
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 lg:h-10 flex items-center">
            종목명
          </span>
        ),
      tailClass:
        renderMode === "add" || renderMode === "edit"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-0 font-semibold outline-none text-gray-200 bg-transparent lg:h-10 flex items-center",
      inlineStyleBg:
        renderMode === "add" || renderMode === "edit"
          ? "rgba(5, 11, 54, 0.7)"
          : null,
    },
    {
      index: 3,
      type: "select",
      name: "categoryGender",
      id: "categoryGender",
      required: true,
      value: categoryInfo?.categoryGender,
      disabled: renderMode === "add" || renderMode === "edit" ? false : true,
      label:
        renderMode === "add" || renderMode === "edit" ? (
          <span className="ml-2 h-10 flex items-center">
            참가가능 성별
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 lg:h-10 flex items-center">
            참가가능 성별
          </span>
        ),
      tailClass:
        (renderMode === "add" || renderMode === "edit") &&
        "w-32 h-10 rounded-lg px-4 outline-none text-gray-200",
      inlineStyleBg:
        (renderMode === "add" || renderMode === "edit") &&
        "rgba(5, 11, 54, 0.7)",

      options: [
        {
          id: "categoryGender1",
          name: "categoryGender1",
          value: "남자",
          text: "남자",
        },
        {
          id: "categoryGender2",
          name: "categoryGender2",
          value: "여자",
          text: "여자",
        },
        {
          id: "categoryGender3",
          name: "categoryGender3",
          value: "전부",
          text: "전부",
        },
      ],
    },
    {
      index: 4,
      type: "select",
      name: "categoryLaunched",
      id: "categoryLaunched",
      value: categoryInfo?.categoryLaunched,
      disabled: renderMode === "add" || renderMode === "edit" ? false : true,
      label:
        renderMode === "add" || renderMode === "edit" ? (
          <span className="ml-2 lg:h-10  items-center flex">
            운영여부
            <span className="text-red-600 text-lg ml-2 align-middle ">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-8 items-center flex ">
            운영여부
          </span>
        ),
      tailClass:
        (renderMode === "add" || renderMode === "edit") &&
        "w-32 h-10 rounded-lg px-4 outline-none text-gray-200",
      inlineStyleBg:
        (renderMode === "add" || renderMode === "edit") &&
        "rgba(5, 11, 54, 0.7)",

      options: [
        {
          id: "categoryLaunched1",
          name: "categoryLaunched1",
          value: "운영",
          text: "운영",
        },
        {
          id: "categoryLaunched2",
          name: "categoryLaunched2",
          value: "미운영",
          text: "미운영",
        },
      ],
    },
  ];
  const grade_inputs = [
    {
      index: 1,
      type: "text",
      name: "gradeTitle",
      id: "gradeTitle",
      required: true,
      value: gradeInfo?.gradeTitle,
      disabled: renderMode === "add" || renderMode === "edit" ? false : true,
      label:
        renderMode === "add" || renderMode === "edit" ? (
          <span className="ml-2 h-10 flex items-center">
            체급명(표시명)
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 lg:h-10 flex items-center">
            체급명(표시명)
          </span>
        ),
      tailClass:
        renderMode === "add" || renderMode === "edit"
          ? " h-10 rounded-lg px-4 outline-none text-gray-200 w-32"
          : " rounded-lg px-0 font-semibold outline-none text-gray-200 bg-transparent lg:h-10 flex items-center w-32",
      inlineStyleBg:
        renderMode === "add" || renderMode === "edit"
          ? "rgba(5, 11, 54, 0.7)"
          : null,
    },
    {
      index: 2,
      type: "select",
      name: "gradeFilterType",
      id: "gradeFilterType",

      value: gradeInfo?.gradeFilterType,
      disabled: renderMode === "add" || renderMode === "edit" ? false : true,
      label:
        renderMode === "add" || renderMode === "edit" ? (
          <span className="ml-2 h-10 flex items-center">
            구분종류
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 lg:h-10 flex items-center">
            구분종류
          </span>
        ),
      tailClass:
        (renderMode === "add" || renderMode === "edit") &&
        "w-32 h-10 rounded-lg px-4 outline-none text-gray-200",
      inlineStyleBg:
        (renderMode === "add" || renderMode === "edit") &&
        "rgba(5, 11, 54, 0.7)",
      options: [
        {
          id: "gradeFilterType1",
          name: "gradeFilterType1",
          value: "키(cm)",
          text: "키(cm)",
        },
        {
          id: "gradeFilterType2",
          name: "gradeFilterType2",
          value: "체중(kg)",
          text: "체중(kg)",
        },
        {
          id: "gradeFilterType3",
          name: "gradeFilterType3",
          value: "나이",
          text: "나이",
        },
        {
          id: "gradeFilterType4",
          name: "gradeFilterType4",
          value: "없음",
          text: "없음",
        },
      ],
    },
    {
      index: 3,
      type: "text",
      name: "gradeMinValue",
      id: "gradeMinValue",
      required: true,
      value: gradeInfo?.gradeMinValue,
      disabled: renderMode === "add" || renderMode === "edit" ? false : true,
      label:
        renderMode === "add" || renderMode === "edit" ? (
          <span className="ml-2 h-10 flex items-center">
            범위(최소)
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 lg:h-10 flex items-center">
            범위(최소)
          </span>
        ),
      tailClass:
        renderMode === "add" || renderMode === "edit"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-0 font-semibold outline-none text-gray-200 bg-transparent lg:h-10 flex items-center",
      inlineStyleBg:
        renderMode === "add" || renderMode === "edit"
          ? "rgba(5, 11, 54, 0.7)"
          : null,
    },
    {
      index: 4,
      type: "text",
      name: "gradeMaxValue",
      id: "gradeMaxValue",
      required: true,
      value: gradeInfo?.gradeMaxValue,
      disabled: renderMode === "add" || renderMode === "edit" ? false : true,
      label:
        renderMode === "add" || renderMode === "edit" ? (
          <span className="ml-2 h-10 flex items-center">
            범위(최대)
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 lg:h-10 flex items-center">
            범위(최대)
          </span>
        ),
      tailClass:
        renderMode === "add" || renderMode === "edit"
          ? "w-full h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-full rounded-lg px-0 font-semibold outline-none text-gray-200 bg-transparent lg:h-10 flex items-center",
      inlineStyleBg:
        renderMode === "add" || renderMode === "edit"
          ? "rgba(5, 11, 54, 0.7)"
          : null,
    },
  ];
  const categoryInputRender = (
    <div className="flex w-full flex-col gap-y-0 md:gap-y-5 md:px-5">
      <div className="flex w-full flex-wrap p-5 flex-col gap-y-3 lg:flex-row lg:gap-y-4">
        {category_inputs.map((input, idx) => (
          <div className="flex w-full lg:w-1/2 lg:h-10">
            <div className="flex w-full lg:w-1/3 text-gray-300 font-semibold font-san items-center text-sm">
              {input.label}
            </div>
            <div className="flex w-full md:w-2/3">
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
                        option.value === categoryInfo[input.name]
                      }
                    >
                      {option.text}
                    </option>
                  ))}
                </select>
              )}
              {input.type === "select" && renderMode === "read" && (
                <div className="flex justify-start items-center lg:h-10 font-sm font-normal lg:font-semibold text-gray-200 ">
                  {categoryInfo[input.name]}
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
      </div>
    </div>
  );
  const gradeInputRender = (
    <div className="flex w-full flex-col gap-y-0 md:gap-y-5 md:px-5">
      <ConfirmationModal
        isOpen={isMessageOpen}
        onConfirm={handleModalClose}
        onCancel={handleModalClose}
        message={message}
      />
      <div className="flex w-full flex-wrap p-5 flex-col gap-y-3 lg:flex-row lg:gap-y-4">
        {grade_inputs.map((input, idx) => (
          <div className="flex w-full lg:w-1/2 lg:h-10 ">
            <div className="flex w-full lg:w-1/3 text-gray-300 font-semibold font-san items-center text-sm  lg:h-10">
              {input.label}
            </div>
            <div className="flex w-full md:w-2/3 gap-x-2 lg:mb-4">
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
                      selected={option.value === gradeInfo[input.name]}
                    >
                      {option.text}
                    </option>
                  ))}
                </select>
              )}
              {input.type === "select" && renderMode === "read" && (
                <div className="flex justify-start items-center lg:h-10 font-sm font-normal lg:font-semibold text-gray-200 ">
                  {gradeInfo[input.name]}
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
        {renderMode === "edit" && gradeInfo.id !== undefined && (
          <div className="flex w-full  justify-end ">
            <button
              className="bg-blue-800 px-4 h-10 rounded-lg"
              onClick={() => handleEditGrade(gradeInfo.id)}
            >
              <span className="text-gray-200 font-semibold">
                체급내용만 수정
              </span>
            </button>
          </div>
        )}
        {(renderMode === "add" ||
          (renderMode === "edit" && gradeInfo.id === undefined)) && (
          <div className="flex w-full  justify-end ">
            <button
              className="bg-blue-800 px-4 h-10 rounded-lg"
              onClick={() => handleAddGrade(categoryId)}
            >
              <span className="text-gray-200 font-semibold">체급추가</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const handleSelectedGrade = (gradeId) => {
    const grade = gradeArray.filter((gradeItem) => gradeItem.id === gradeId);
    setGradeInfo({ ...grade[0] });
  };

  const handleDeleteGrade = async (gradeId) => {
    const grades = gradeArray.filter((gradeItem) => gradeItem.id !== gradeId);
    console.log(gradeId);

    try {
      const delResult = await gradeDeleteData(gradeId);
      console.log(delResult);
      if (delResult) {
        setGradeArray([...grades]);
        setIsMessageOpen(true);
        setMessage({
          title: "삭제",
          body: "체급이 삭제되었습니다.",
          isButton: true,
          confirmButtonText: "확인",
          cancelButtonText: "",
        });
      } else {
        setMessage({
          title: "삭제오류",
          body: "오류가 발생했습니다.",
          body2: "다시 시도하세요.",
          isButton: true,
          confirmButtonText: "확인",
          cancelButtonText: "",
        });
        setIsMessageOpen(true);
      }
    } catch (error) {
      setMessage({
        title: "삭제오류",
        body: "오류가 발생했습니다.",
        body2: "다시 시도하세요.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
      setIsMessageOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const isGrade = e.target.name.startsWith("grade");
    if (!isGrade) {
      if (e.target.name === "categoryIndex") {
        setCategoryInfo({
          ...categoryInfo,
          [e.target.name]: parseInt(e.target.value),
        });
      } else {
        setCategoryInfo({
          ...categoryInfo,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      switch (e.target.name) {
        case "gradeMinValue":
          setGradeInfo({
            ...gradeInfo,
            [e.target.name]: parseFloat(e.target.value),
          });
          break;
        case "gradeMaxValue":
          setGradeInfo({
            ...gradeInfo,
            [e.target.name]: parseFloat(e.target.value),
          });
          break;
        default:
          setGradeInfo({ ...gradeInfo, [e.target.name]: e.target.value });
          break;
      }
    }
  };

  const handleAddGrade = async (categoryId) => {
    if (gradeInfo.gradeTitle === "" || gradeInfo.gradeTitle === undefined) {
      setIsMessageOpen(true);
      setMessage({
        title: "오류",
        body: "체급명은 반드시 입력해야합니다.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
      return;
    }

    const gradeIndex = gradeArray?.length ? gradeArray.length + 1 : 1;
    setGradeArray([
      ...gradeArray,
      { ...gradeInfo, gradeIndex, refCategoryId: categoryId },
    ]);
    try {
      await gradeAddData({
        ...gradeInfo,
        gradeIndex,
        refCategoryId: categoryId,
      });
      setIsMessageOpen(true);
      setMessage({
        title: "저장",
        body: "저장 되었습니다.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
    } catch (error) {
      console.log(error);
      setIsMessageOpen(true);
      setMessage({
        title: "저장 오류",
        body: "오류가 발생했습니다.",
        body2: "다시 시도하세요.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
    }
  };

  const handleEditCategory = async (categoryId) => {
    if (
      categoryInfo.categoryTitle === "" ||
      categoryInfo.categoryTitle === undefined
    ) {
      setIsMessageOpen(true);
      setMessage({
        title: "오류",
        body: "종목명은 반드시 입력해야합니다.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
      return;
    }

    const newCategory = [...categoryList];
    const findCategoryIndex = newCategory.findIndex(
      (category) => category.id === categoryId
    );
    newCategory.splice(findCategoryIndex, 1, { ...categoryInfo });
    setCategoryList([...newCategory]);
    try {
      await categoryUpdateData(categoryId, { ...categoryInfo });
      setIsMessageOpen(true);
      setMessage({
        title: "업데이트",
        body: "업데이트 완료되었습니다.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
    } catch (error) {
      console.log(error);
      setIsMessageOpen(true);
      setMessage({
        title: "업데이트오류",
        body: "오류가 발생했습니다.",
        body2: "다시 시도하세요.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
    }
  };

  const handleEditGrade = async (gradeId, categoryId) => {
    if (gradeInfo.gradeTitle === "" || gradeInfo.gradeTitle === undefined) {
      setIsMessageOpen(true);
      setMessage({
        title: "오류",
        body: "체급명은 반드시 입력해야합니다.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
      return;
    }

    const findGradeListIndex = gradeList.findIndex(
      (grade) => grade.gradeId === gradeId
    );
    const findGradeIndex = gradeArray.findIndex(
      (grade) => grade.id === gradeId
    );

    const newGradeArray = [...gradeArray];
    const newGradeList = [...gradeList];

    newGradeArray.splice(findGradeIndex, 1, {
      ...gradeInfo,
      refCategoryId: categoryId,
    });
    newGradeList.splice(findGradeListIndex, 1, {
      ...gradeInfo,
      refCategoryId: categoryId,
    });

    console.log(newGradeList);

    setGradeArray([...newGradeArray]);
    setGradeList([...newGradeList]);

    setGradeInfo({
      gradeTitle: "",
      gradeFilterType: "키(cm)",
      gradeMinValue: "",
      gradeMaxValue: "",
    });

    try {
      await gradeUpdateData(gradeId, { ...gradeInfo });
      setIsMessageOpen(true);
      setMessage({
        title: "업데이트",
        body: "업데이트 완료되었습니다.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
    } catch (error) {
      console.log(error);
      setIsMessageOpen(true);
      setMessage({
        title: "업데이트오류",
        body: "오류가 발생했습니다.",
        body2: "다시 시도하세요.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
    }
  };

  useEffect(() => {
    if (categoryList?.length > 0) {
      const category = categoryList.filter(
        (categoryItem) => categoryItem.id === categoryId
      );

      setCategoryInfo({ ...category[0] });
    }

    if (gradeList?.length > 0) {
      const grades = gradeList.filter(
        (gradeItem) => gradeItem.refCategoryId === categoryId
      );
      setGradeArray([...grades]);
      setGradeInfo({
        gradeTitle: "",
        gradeFilterType: "키(cm)",
        gradeMinValue: "",
        gradeMaxValue: "",
      });
    }
  }, [categoryList, gradeList]);

  return (
    <div className="flex w-full h-full flex-col gap-y-5 mt-5">
      <ConfirmationModal
        isOpen={isMessageOpen}
        onConfirm={handleModalClose}
        onCancel={handleModalClose}
        message={message}
      />
      <div
        className="flex w-full h-full rounded-lg flex-col"
        style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
      >
        <div className="flex justify-between items-center h-16 px-2 md:px-5">
          <span className="text-white p-5 font-semibold md:text-lg">
            {renderMode === "add" && "종목추가"}
            {renderMode === "edit" && "종목수정"}
            {renderMode === "read" && "종목내용"}
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
        <div className="flex h-full w-full p-0">{categoryInputRender}</div>

        {renderMode === "edit" && (
          <div className="flex w-full justify-end my-2 md:px-10">
            <button
              className="bg-gray-200 px-4 h-10 rounded-lg w-34"
              onClick={() => handleEditCategory(categoryId)}
            >
              <span className="text-gray-900 font-semibold">종목만 저장</span>
            </button>
          </div>
        )}
        <div className="flex w-full h-1 justify-center items-center">
          <div
            className="w-full"
            style={{
              height: "1px",
              background: "radial-gradient(farthest-side,#a3a3a3, #4e4e4e)",
            }}
          ></div>
        </div>
        <div className="flex h-full w-full p-0">{gradeInputRender}</div>

        {renderMode === "add" && (
          <div className="flex px-10 py-2 w-full h-full">
            <div
              className="flex h-full w-full rounded-lg"
              style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
            >
              <div className="flex w-full h-full px-5 items-center flex-wrap gap-2">
                {gradeArray.length > 0 &&
                  gradeArray.map((grade, gIdx) => (
                    <div className="w-auto h-8 bg-sky-700 p-2 text-gray-200 rounded-lg flex justify-center items-center">
                      <span>{grade.gradeTitle}</span>
                      <button className=" w-3 h-3 flex justify-center items-center text-sm ml-3">
                        <span className="flex items-center justify-center w-full h-full text-gray-900 font-semibold">
                          x
                        </span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
        {renderMode === "read" && (
          <div className="flex px-10 py-2 w-full h-full">
            <div
              className="flex h-full w-full rounded-lg"
              style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
            >
              <div className="flex w-full h-full px-5 items-center flex-wrap gap-2">
                {gradeArray.length > 0 &&
                  gradeArray.map((grade, gIdx) => (
                    <button className="w-auto h-8 bg-sky-600 p-2 text-gray-200 rounded-lg flex justify-center items-center">
                      <span>{grade.gradeTitle}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}
        {renderMode === "edit" && (
          <div className="flex px-10 py-2 w-full h-full">
            <div
              className="flex h-full w-full rounded-lg"
              style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
            >
              <div className="flex w-full h-full px-5 items-center flex-wrap gap-2">
                {gradeArray.length > 0 &&
                  gradeArray.map((grade, gIdx) => (
                    <div
                      className="w-auto px-5 h-8 bg-sky-700 py-2 text-gray-200 rounded-lg flex justify-center items-center hover:cursor-pointer"
                      onClick={() => handleSelectedGrade(grade.id)}
                    >
                      <span>{grade.gradeTitle}</span>
                      <button
                        className=" w-3 h-3 flex justify-center items-center text-sm ml-3"
                        onClick={() => handleDeleteGrade(grade.id)}
                      >
                        <span className="flex items-center justify-center w-full h-full text-gray-900 font-semibold">
                          x
                        </span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
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
              <button className="bg-gray-200 px-4 h-10 rounded-lg">
                <span className="text-gray-900 font-semibold">저장</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryManageV2;

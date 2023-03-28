import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { useFirestoreAddData } from "../../hooks/useFirestores";
import ConfirmationModal from "../../messageboxs/ConfirmationModal";

const CategoryAdd = ({ mode, propCategoryId, syncState }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [renderMode, setRenderMode] = useState(mode || "edit");
  const [categoryInfo, setCategoryInfo] = useState({
    categoryGender: "m",
    categoryLaunched: "운영",
  });
  const [gradeInfo, setGradeGradeInfo] = useState({
    gradeFilterType: "height",
  });
  const [gradeArray, setGradeArray] = useState([]);
  const [message, setMessage] = useState({});
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const { addData } = useFirestoreAddData("category_pool");
  const { addData: addGradeData } = useFirestoreAddData("grade_pool");

  const initState = () => {
    setCategoryInfo({
      categoryTitle: "",
      categoryGender: "m",
      categoryLaunched: "운영",
    });
    setGradeGradeInfo({
      gradeTitle: "",
      gradeFilterType: "height",
      gradeMinValue: "",
      gradeMaxValue: "",
    });
    setGradeArray([]);
  };

  async function addCategory(categoryInfo, gradeArray) {
    // categoryInfo를 Firestore에 추가하고, 추가된 도큐먼트의 ID를 가져옴

    const addedCategory = await addData(categoryInfo);
    const categoryId = addedCategory.id;

    // gradeArray에 refCategoryId를 추가
    const updatedGradeArray = gradeArray.map((gradeInfo) => {
      return {
        ...gradeInfo,
        refCategoryId: categoryId,
      };
    });

    // gradeArray에 있는 모든 gradeInfo를 Firestore에 추가하고, 추가된 도큐먼트의 ID를 가져옴

    const addedGrades = await Promise.all(
      updatedGradeArray.map((gradeInfo) => addGradeData(gradeInfo))
    );

    // 추가된 grade 도큐먼트들의 ID를 반환
    return addedGrades.map((grade) => grade.id);
  }
  const handleSaveCategoryWithGrades = async () => {
    try {
      const addedGradeIds = await addCategory(categoryInfo, gradeArray);
      console.log("Added grade IDs:", addedGradeIds);
      setIsMessageOpen(true);

      setMessage({
        title: "저장완료",
        body: "종목/체급이 추가되었습니다.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
      initState();
    } catch (error) {
      setIsMessageOpen(true);

      setMessage({
        title: "오류",
        body: "저장중 오류가 발생했습니다.",
        body2: "잠시후에 다시 시도해주세요.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
      console.error(error);
    }
  };
  const category_inputs = [
    {
      index: 1,
      type: "number",
      name: "categoryIndex",
      id: "categoryIndex",
      required: true,
      value: categoryInfo.categoryIndex,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10 lg:flex lg:items-center">
            노출순위
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full lg:flex lg:items-center">
            노출순위
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? " h-10 rounded-lg px-4 outline-none text-gray-200 w-32"
          : " rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-center w-32",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 2,
      type: "text",
      name: "categoryTitle",
      id: "categoryTitle",
      required: true,
      value: categoryInfo.categoryTitle,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10 lg:flex lg:items-center">
            종목명
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full lg:flex lg:items-center">
            종목명
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
      type: "select",
      name: "categoryGender",
      id: "categoryGender",
      required: true,
      value: categoryInfo.categoryGender,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10 lg:flex lg:items-center">
            참가가능 성별
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full lg:flex lg:items-center">
            참가가능 성별
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-32 h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-32 rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-center",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
      options: [
        {
          id: "categoryGender1",
          name: "categoryGender1",
          value: "m",
          text: "남자",
        },
        {
          id: "categoryGender2",
          name: "categoryGender2",
          value: "f",
          text: "여자",
        },
        {
          id: "categoryGender3",
          name: "categoryGender3",
          value: "all",
          text: "전부",
        },
      ],
    },
    {
      index: 4,
      type: "select",
      name: "categoryLaunched",
      id: "categoryLaunched",
      value: categoryInfo.categoryLaunched,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10 lg:flex lg:items-center">
            운영여부
            <span className="text-red-600 text-lg ml-2 align-middle ">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full lg:flex lg:items-center">
            운영여부
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-32 h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-32 rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-center",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
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
      value: categoryInfo.gradeTitle,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10 lg:flex lg:items-center">
            체급명(표시명)
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full lg:flex lg:items-center">
            체급명(표시명)
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-44 h-10 rounded-lg px-4 outline-none text-gray-200 lg:mr-5"
          : "w-44 rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-center lg:mr-5",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 2,
      type: "select",
      name: "gradeFilterType",
      id: "gradeFilterType",

      value: categoryInfo.gradeFilterType,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10 lg:flex lg:items-center">
            구분종류
            <span className="text-red-600 text-lg ml-2 align-middle ">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full lg:flex lg:items-center">
            구분종류
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-32 h-10 rounded-lg px-4 outline-none text-gray-200"
          : "w-32 rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-center",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
      options: [
        {
          id: "gradeFilterType1",
          name: "gradeFilterType1",
          value: "height",
          text: "키(cm)",
        },
        {
          id: "gradeFilterType2",
          name: "gradeFilterType2",
          value: "weight",
          text: "체중(kg)",
        },
        {
          id: "gradeFilterType3",
          name: "gradeFilterType3",
          value: "age",
          text: "나이",
        },
        {
          id: "gradeFilterType4",
          name: "gradeFilterType4",
          value: "none",
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
      value: categoryInfo.gradeIndex,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10 lg:flex lg:items-center">
            범위(최소)
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full lg:flex lg:items-center">
            범위(최소)
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-44 h-10 rounded-lg px-4 outline-none text-gray-200 lg:mr-5"
          : "w-44 rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-center lg:mr-5",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
    {
      index: 4,
      type: "text",
      name: "gradeMaxValue",
      id: "gradeMaxValue",
      required: true,
      value: categoryInfo.gradeIndex,
      disabled: renderMode === "edit" ? false : true,
      label:
        renderMode === "edit" ? (
          <span className="ml-2 h-10 lg:flex lg:items-center">
            범위(최대)
            <span className="text-red-600 text-lg ml-2 align-middle">*</span>
          </span>
        ) : (
          <span className="ml-2 text-gray-500 h-full lg:flex lg:items-center">
            범위(최대)
          </span>
        ),
      tailClass:
        renderMode === "edit"
          ? "w-44 h-10 rounded-lg px-4 outline-none text-gray-200 lg:mr-5"
          : "w-44 rounded-lg px-2 font-semibold outline-none text-gray-200 bg-transparent items-center lg:mr-5",
      inlineStyleBg: renderMode === "edit" ? "rgba(5, 11, 54, 0.7)" : null,
    },
  ];
  const handleSavedConfirm = async () => {
    setIsMessageOpen(false);
    //navigate("/lobby", { replace: true });
  };

  const handleModalClose = () => {
    setIsMessageOpen(false);
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
          setGradeGradeInfo({
            ...gradeInfo,
            [e.target.name]: parseFloat(e.target.value),
          });
          break;
        case "gradeMaxValue":
          setGradeGradeInfo({
            ...gradeInfo,
            [e.target.name]: parseFloat(e.target.value),
          });
          break;
        default:
          setGradeGradeInfo({ ...gradeInfo, [e.target.name]: e.target.value });
          break;
      }
    }
  };

  const handleAddGrade = () => {
    setGradeArray([...gradeArray, gradeInfo]);
    console.log(gradeArray);
  };
  const categoryInputRender = (
    <div className="flex w-full flex-col gap-y-0 md:gap-y-5 md:px-5">
      <ConfirmationModal
        isOpen={isMessageOpen}
        onConfirm={handleSavedConfirm}
        onCancel={handleModalClose}
        message={message}
      />
      <div className="flex w-full flex-wrap p-5 flex-col lg:flex-row lg:gap-y-4">
        {category_inputs.map((input, idx) => (
          <div className="flex w-full lg:w-1/2 lg:h-10 ">
            <div className="flex w-full lg:w-1/3 text-gray-300 font-semibold font-san items-center text-sm">
              {input.label}
            </div>
            <div className="flex w-full md:w-2/3 gap-x-2 mb-4">
              {input.type === "select" && (
                <select
                  name={input.name}
                  id={input.id}
                  className={input.tailClass}
                  style={{ backgroundColor: input.inlineStyleBg }}
                  onChange={(e) => handleInputChange(e)}
                >
                  {input.options.map((option) => (
                    <option value={option.value}>{option.text}</option>
                  ))}
                </select>
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
        onConfirm={handleSavedConfirm}
        onCancel={handleModalClose}
        message={message}
      />
      <div className="flex w-full flex-wrap px-5 py-2 flex-col lg:flex-row lg:gap-y-4">
        {grade_inputs.map((input, idx) => (
          <div className="flex w-full lg:w-1/2 lg:h-10 ">
            <div className="flex w-full lg:w-1/3 text-gray-300 font-semibold font-san items-center text-sm">
              {input.label}
            </div>
            <div className="flex w-full md:w-2/3 gap-x-2 mb-4">
              {input.type === "select" && (
                <select
                  name={input.name}
                  id={input.id}
                  className={input.tailClass}
                  style={{ backgroundColor: input.inlineStyleBg }}
                  onChange={(e) => handleInputChange(e)}
                >
                  {input.options.map((option) => (
                    <option value={option.value}>{option.text}</option>
                  ))}
                </select>
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
        {renderMode === "edit" && (
          <div className="flex w-full lg:w-1/3 justify-end ">
            <button
              className="bg-blue-800 px-4 h-10 rounded-lg"
              onClick={() => handleAddGrade()}
            >
              <span className="text-gray-200 font-semibold">체급추가</span>
            </button>
          </div>
        )}
      </div>
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
            종목추가
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
        <div className="flex h-full w-full p-0  ">{categoryInputRender}</div>
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
        <div className="flex px-10 py-2 w-full h-full">
          <div
            className="flex h-full w-full rounded-lg"
            style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
          >
            <div className="flex w-full h-full px-5 items-center flex-wrap gap-2">
              {gradeArray.length > 0 &&
                gradeArray.map((grade, gIdx) => (
                  <div className="w-20 h-8 bg-sky-700 p-2 text-gray-200 rounded-lg flex justify-center items-center">
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
                onClick={() => handleSaveCategoryWithGrades()}
              >
                <span className="text-gray-900 font-semibold">저장</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryAdd;

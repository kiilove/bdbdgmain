import { where } from "firebase/firestore";
import React from "react";
import { useContext } from "react";
import { HiRefresh, HiCheckCircle } from "react-icons/hi";
import { RiCheckboxFill, RiCheckboxBlankLine } from "react-icons/ri";
import { useState } from "react";
import { CategoryGradePairContext } from "../../contexts/CategoryGradePairContext";
import Loading from "../Loading";
import { useEffect } from "react";
import { CurrentContestContext } from "../../contexts/CurrentContestContext";
import {
  useFirestoreGetDocument,
  useFirestoreUpdateData,
} from "../../hooks/useFirestores";
import ConfirmationModal from "../../messageboxs/ConfirmationModal";
import { CategorysGradesContext } from "../../contexts/CategoryContext";

const CategoryListV2 = ({ setSelectedTab, mode, setEntryGrades }) => {
  const [renderMode, setRenderMode] = useState(mode || "admin");
  const { currentContest } = useContext(CurrentContestContext);

  const { categoryList, gradeList, forceReloadFromDatabase, loading } =
    useContext(CategorysGradesContext);
  const [isLoading, setIsLoading] = useState(true);

  const [allChecked, setAllChecked] = useState(false);
  const [selectedItems, setSelectedItems] = useState({
    categorys: [],
    grades: [],
  });
  const [message, setMessage] = useState({});
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  const [filteredCategory, setFilteredCategory] = useState([]);

  useEffect(() => {
    if (categoryList?.length) {
      if (renderMode === "admin" && categoryList.length > 0) {
        setFilteredCategory([...categoryList]);
      } else {
        const filteredCategorys = categoryList.filter(
          (category) => category.categoryLaunched === "운영"
        );
        console.log(filteredCategorys);
        setFilteredCategory([...filteredCategorys]);
      }
    }
  }, [categoryList]);

  const handleSavedConfirm = async () => {
    setIsMessageOpen(false);
  };

  const handleModalClose = () => {
    setIsMessageOpen(false);
  };

  const handleSelectedItemsCategory = (categoryId) => {
    const newItems = { ...selectedItems };
    const isExistCategory = newItems.categorys.some(
      (newItem) => newItem.id === categoryId
    );
    if (!isExistCategory) {
      const newCategory = categoryList.filter(
        (category) => category.id === categoryId
      );

      const newGrade = gradeList.filter(
        (grade) => grade.refCategoryId === categoryId
      );
      newItems.categorys.push(newCategory[0]);
      newItems.grades.push(...newGrade);

      setSelectedItems({ ...newItems });
    } else if (isExistCategory) {
      const newCategory = selectedItems.categorys.filter(
        (category) => category.id !== categoryId
      );

      const newGrade = selectedItems.grades.filter(
        (grade) => grade.refCategoryId !== categoryId
      );

      setSelectedItems({ categorys: [...newCategory], grades: [...newGrade] });
    }
  };

  const handleSelectedItemsGrade = (gradeId, refCategoryId) => {
    console.log(gradeId);
    const isExistGrade = selectedItems.grades.some(
      (grade) => grade.id === gradeId
    );
    const isExistCategory = selectedItems.categorys.some(
      (category) => category.id === refCategoryId
    );
    console.log(isExistGrade);

    if (!isExistGrade) {
      const newGradeItem = gradeList.filter((grade) => grade.id === gradeId);
      const newGrade = [...selectedItems.grades];
      newGrade.push(newGradeItem[0]);
      if (isExistCategory) {
        setSelectedItems({ ...selectedItems, grades: newGrade });
      } else {
        const newCategoryItem = categoryList.filter(
          (category) => category.id === refCategoryId
        );
        const newCategory = [...selectedItems.categorys];
        newCategory.push(newCategoryItem[0]);
        setSelectedItems({
          categorys: [...newCategory],
          grades: newGrade,
        });
      }
    } else if (isExistGrade) {
      let newCategory = [...selectedItems.categorys];
      const newGrade = selectedItems.grades.filter(
        (grade) => grade.id !== gradeId
      );
      console.log(newGrade);
      const isNotLastGrade = newGrade.some(
        (grade) => grade.refCategoryId === refCategoryId
      );
      if (!isNotLastGrade) {
        newCategory = newCategory.filter(
          (categroy) => categroy.id !== refCategoryId
        );
      }
      setSelectedItems({ categorys: [...newCategory], grades: [...newGrade] });
    }
  };

  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);

  return (
    <div className="flex w-full h-full flex-col gap-y-5">
      <div
        className="flex w-full h-full rounded-lg flex-wrap gap-2 box-border justify-between items-start p-5"
        style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
      >
        <ConfirmationModal
          isOpen={isMessageOpen}
          onConfirm={handleSavedConfirm}
          onCancel={handleModalClose}
          message={message}
        />
        <div className="flex justify-between items-center px-2 md:px-5 w-full">
          {renderMode !== "entry" && (
            <div className="flex w-1/2 items-center">
              <span className="text-white py-5 font-semibold md:text-lg">
                전체목록
              </span>
              <button
                className="p-1 bg-sky-500 rounded-lg hover:bg-blue-800 ml-2 h-7 w-7"
                onClick={() => forceReloadFromDatabase()}
              >
                <span className="text-gray-200 text-lg">
                  <HiRefresh />
                </span>
              </button>
              {renderMode === "choice" && !allChecked && (
                <button className="p-1 bg-sky-500 rounded-lg hover:bg-blue-800 ml-2 w-7 h-7">
                  <span className="text-gray-200 text-lg">
                    <RiCheckboxFill />
                  </span>
                </button>
              )}
              {(renderMode === "choice" || renderMode === "entry") &&
                allChecked && (
                  <button className="p-1 bg-sky-500 rounded-lg hover:bg-blue-800 ml-2">
                    <span className="text-gray-200 text-lg">
                      <RiCheckboxBlankLine />
                    </span>
                  </button>
                )}
            </div>
          )}

          <div className="flex w-1/2 h-full items-center justify-end">
            {renderMode === "choice" && (
              <button className="bg-gray-200 px-4 h-10 rounded-lg">
                <span className="text-gray-900 font-semibold">저장</span>
              </button>
            )}
          </div>
        </div>
        {renderMode !== "entry" && (
          <div className="flex w-full h-1 justify-center items-center mb-4">
            <div
              className="w-full"
              style={{
                height: "1px",
                background: "radial-gradient(farthest-side,#a3a3a3, #0c1964)",
              }}
            ></div>
          </div>
        )}

        {loading && <Loading />}
        {filteredCategory?.length > 0 &&
          filteredCategory.map((category) => {
            const filteredGrades = gradeList.filter(
              (grade) => grade.refCategoryId === category.id
            );

            return (
              <div
                className={`flex w-full lg:w-56 text-gray-200 rounded-lg flex-col gap-y-3 hover:cursor-pointer 
                ${
                  selectedItems.categorys.some(
                    (categoryItem) => categoryItem.id === category.id
                  )
                    ? " border-gray-200"
                    : " border-gray-600"
                } border-2 hover:cursor-pointer`}
                style={{
                  backgroundColor: "rgba(11,17,66,0.7)",
                  minHeight: "100px",
                }}
                onClick={() => handleSelectedItemsCategory(category.id)}
              >
                <div
                  className={`flex w-full justify-center items-center h-10 rounded-lg text-sm font-normal lg:text-base lg:font-semibold `}
                >
                  {category.categoryTitle}
                </div>
                <div
                  className="flex w-full flex-wrap gap-2 justify-start items-center h-full rounded-lg text-sm p-3"
                  style={{
                    backgroundColor: "rgba(11,17,46,0.7)",
                    minHeight: "30px",
                  }}
                >
                  {filteredGrades.length > 0 &&
                    filteredGrades.map((grade, gIndx) => (
                      <button
                        className={`rounded-lg px-4 py-1 
                      ${
                        selectedItems.grades.some(
                          (gradeItem) => gradeItem.id === grade.id
                        )
                          ? " bg-blue-500"
                          : " bg-gray-700"
                      }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectedItemsGrade(
                            grade.id,
                            grade.refCategoryId
                          );
                        }}
                      >
                        {grade.gradeTitle}
                      </button>
                    ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CategoryListV2;

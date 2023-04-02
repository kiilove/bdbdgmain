import { where } from "firebase/firestore";
import React from "react";
import { useContext } from "react";
import { HiRefresh, HiCheckCircle } from "react-icons/hi";
import { RiCheckboxFill, RiCheckboxBlankLine } from "react-icons/ri";
import { useState } from "react";
import { CategoryGradePairContext } from "../../contexts/CategoryGradePairContext";
import Loading from "../Loading";
import { useEffect } from "react";

const CategoryList = ({ setSelectedTab, mode }) => {
  const [renderMode, setRenderMode] = useState(mode || "admin");
  const [isLoading, setIsLoading] = useState(true);
  const [allChecked, setAllChecked] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const {
    categoryGradePair,
    setCategoryGradePair,
    forceReloadData,
    loading,
    error,
  } = useContext(CategoryGradePairContext);

  const handleItemClick = (item) => {
    if (renderMode === "admin") {
      setSelectedTab({ id: "종목보기", categoryIndex: item.category.id });
    } else if (renderMode === "choice") {
      const selectedCategory = item.category;
      const selectedGrade = item.matchedGrades;
      const selectedItem = {
        category: selectedCategory,
        matchedGrades: selectedGrade,
      };
      const itemExists = selectedItems.some(
        (item) => item.category.id === selectedCategory.id
      );
      let newSelectedItems = selectedItems.slice();
      if (itemExists) {
        newSelectedItems = newSelectedItems.filter(
          (item) => item.category.id !== selectedCategory.id
        );
      } else {
        console.log(selectedItem);
        newSelectedItems.push(selectedItem);
      }
      setSelectedItems(newSelectedItems);
      console.log(selectedItem);
    }
  };

  const handleSelectAll = () => {
    if (renderMode === "choice") {
      const allIndices = categoryGradePair;
      const allItems = allIndices.reduce((acc, cur) => {
        const { category, matchedGrades } = cur;
        if (matchedGrades.length) {
          const selectedGrades = matchedGrades; // 모든 matchedGrades 객체를 선택하도록 수정
          const selectedItems = selectedGrades.map((grade) => ({
            category,
            matchedGrades: grade,
          }));
          return [...acc, ...selectedItems];
        }
        return acc;
      }, []);
      setSelectedItems(allItems);
      setAllChecked(true);
    }
  };

  const handleClearAll = () => {
    if (renderMode === "choice") {
      setSelectedItems([]);
      setAllChecked(false);
    }
  };

  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);

  return (
    <div className="flex w-full h-full flex-col gap-y-5 mt-5">
      <div
        className="flex w-full h-full rounded-lg flex-wrap gap-2 box-border justify-between items-start p-5"
        style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
      >
        <div className="flex justify-between items-center h-10 px-2 md:px-5">
          <span className="text-white p-5 font-semibold md:text-lg">
            전체목록
          </span>
          <button
            className="p-1 bg-sky-500 rounded-lg hover:bg-blue-800"
            onClick={() => forceReloadData()}
          >
            <span className="text-gray-200 text-lg">
              <HiRefresh />
            </span>
          </button>
          {renderMode === "choice" && !allChecked ? (
            <button
              className="p-1 bg-sky-500 rounded-lg hover:bg-blue-800 ml-2"
              onClick={handleSelectAll}
            >
              <span className="text-gray-200 text-lg">
                <RiCheckboxFill />
              </span>
            </button>
          ) : (
            <button
              className="p-1 bg-sky-500 rounded-lg hover:bg-blue-800 ml-2"
              onClick={handleClearAll}
            >
              <span className="text-gray-200 text-lg">
                <RiCheckboxBlankLine />
              </span>
            </button>
          )}
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
        {loading && <Loading />}
        {categoryGradePair?.length > 0 &&
          categoryGradePair.map((data) => (
            <div
              className={`flex w-full lg:w-56 text-gray-200 rounded-lg flex-col gap-y-3 ${
                renderMode === "choice" &&
                selectedItems.some(
                  (selectedItem) =>
                    selectedItem.category.id === data.category.id &&
                    selectedItem.matchedGrades.refCategoryId ===
                      data.category.id
                )
                  ? "border-gray-200"
                  : "border-gray-600"
              } border-2 hover:cursor-pointer `}
              style={{
                backgroundColor: "rgba(11,17,66,0.7)",
                minHeight: "100px",
              }}
              onClick={() => handleItemClick(data)}
            >
              <div className="flex w-full justify-center items-center h-10 rounded-lg text-sm font-normal lg:text-base lg:font-semibold">
                {data.category.categoryTitle}
              </div>
              <div
                className="flex w-full flex-wrap gap-2 justify-start items-center h-full rounded-lg text-sm p-3"
                style={{
                  backgroundColor: "rgba(11,17,46,0.7)",
                  minHeight: "30px",
                }}
              >
                {data.matchedGrades.length > 0 &&
                  data.matchedGrades
                    .sort((a, b) => a.gradeIndex - b.gradeIndex)
                    .map((grade, gIdx) => (
                      <div
                        className={`bg-sky-600 rounded-lg px-3 ${
                          renderMode === "choice" &&
                          selectedItems.some(
                            (selectedItem) =>
                              selectedItem.category.id === data.category.id &&
                              selectedItem.matchedGrades.id === grade.id
                          )
                            ? ""
                            : " bg-gray-800 "
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (renderMode === "choice") {
                            const selectedItem = {
                              category: data.category,
                              matchedGrades: grade,
                            };
                            if (
                              selectedItems.some(
                                (item) => item.matchedGrades.id === grade.id
                              )
                            ) {
                              setSelectedItems(
                                selectedItems.filter(
                                  (item) => item.matchedGrades.id !== grade.id
                                )
                              );
                            } else {
                              setSelectedItems([
                                ...selectedItems,
                                selectedItem,
                              ]);
                            }
                          }
                        }}
                      >
                        {grade.gradeTitle}
                      </div>
                    ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CategoryList;

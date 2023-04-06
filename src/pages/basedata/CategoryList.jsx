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

const CategoryList = ({ setSelectedTab, mode, setEntryGrades }) => {
  const [renderMode, setRenderMode] = useState(mode || "admin");
  const { currentContest } = useContext(CurrentContestContext);
  const {
    categoryGradePair,
    setCategoryGradePair,
    forceReloadData,
    loading,
    error,
  } = useContext(CategoryGradePairContext);
  const [isLoading, setIsLoading] = useState(true);

  const [allChecked, setAllChecked] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [message, setMessage] = useState({});
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  const { updateData: contestGradePairUpdate } = useFirestoreUpdateData(
    "contest_grades_list"
  );
  const { getDocument: contestGradePairDocument } = useFirestoreGetDocument(
    "contest_grades_list"
  );

  const handleSavedConfirm = async () => {
    setIsMessageOpen(false);
  };

  const handleModalClose = () => {
    setIsMessageOpen(false);
  };
  const handleUpdateContestGradePair = async () => {
    try {
      await contestGradePairUpdate(currentContest.contestGradesListId, {
        contestGrades: [...selectedItems],
        contestEntryPlayers: [],
      });
      setIsMessageOpen(true);
      setMessage({
        title: "저장",
        body: "공고문에 노출될 종목/체급이 ",
        body2: "등록되었습니다.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
    } catch (error) {
      setIsMessageOpen(true);
      setMessage({
        title: "오류",
        body: "등록중 오류가 발생했습니다.",
        body1: "잠시 후 다시 시도해주세요.",
        isButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "",
      });
    }
  };

  const handleItemClick = (item) => {
    if (renderMode === "admin") {
      setSelectedTab({ id: "종목보기", categoryId: item.category.id });
      console.log(item.category.id);
    } else if (renderMode === "choice" || renderMode === "entry") {
      const selectedCategory = item.category;
      const selectedItemsToAdd = item.matchedGrades.flatMap((grade) => ({
        category: selectedCategory,
        matchedGrades: grade,
      }));
      setSelectedItems((prevSelectedItems) => {
        const existingItems = prevSelectedItems.filter(
          (selectedItem) => selectedItem.category.id === selectedCategory.id
        );
        const newSelectedItemsToAdd = selectedItemsToAdd.filter(
          (selectedItem) =>
            !existingItems.some(
              (item) =>
                item.matchedGrades.refCategoryId ===
                selectedItem.matchedGrades.refCategoryId
            )
        );
        const itemsToRemove = existingItems.filter((existingItem) =>
          selectedItemsToAdd.some(
            (item) =>
              item.matchedGrades.refCategoryId ===
              existingItem.matchedGrades.refCategoryId
          )
        );
        return [
          ...prevSelectedItems.filter(
            (selectedItem) =>
              !itemsToRemove.some(
                (item) =>
                  item.matchedGrades.refCategoryId ===
                  selectedItem.matchedGrades.refCategoryId
              )
          ),
          ...newSelectedItemsToAdd,
        ];
      });
    }
  };

  const handleSelectAll = () => {
    if (renderMode === "choice" || renderMode === "entry") {
      const allItems = categoryGradePair.flatMap((data) => {
        const { category, matchedGrades } = data;
        return matchedGrades.map((grade) => ({
          category,
          matchedGrades: grade,
        }));
      });
      setSelectedItems(allItems);
      setAllChecked(true);
    }
  };

  const handleClearAll = () => {
    if (renderMode === "choice" || renderMode === "entry") {
      setSelectedItems([]);
      setAllChecked(false);
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
    console.log(categoryGradePair);
  };

  useEffect(() => {
    if (renderMode === "entry") {
      setEntryGrades([...selectedItems]);
    }
  }, [selectedItems]);

  useEffect(() => {
    setSelectedItems([]);
    if (renderMode !== "choice") {
      return;
    }
    fetchGradePair();
  }, []);

  return (
    <div className="flex w-full h-full flex-col gap-y-5">
      <ConfirmationModal
        isOpen={isMessageOpen}
        onConfirm={handleSavedConfirm}
        onCancel={handleModalClose}
        message={message}
      />
      <div
        className="flex w-full h-full rounded-lg flex-wrap gap-2 box-border justify-between items-start p-5"
        style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
      >
        <div className="flex justify-between items-center px-2 md:px-5 w-full">
          {renderMode !== "entry" && (
            <div className="flex w-1/2 items-center">
              <span className="text-white py-5 font-semibold md:text-lg">
                전체목록
              </span>
              <button
                className="p-1 bg-sky-500 rounded-lg hover:bg-blue-800 ml-2 h-7 w-7"
                onClick={() => forceReloadData()}
              >
                <span className="text-gray-200 text-lg">
                  <HiRefresh />
                </span>
              </button>
              {renderMode === "choice" && !allChecked && (
                <button
                  className="p-1 bg-sky-500 rounded-lg hover:bg-blue-800 ml-2 w-7 h-7"
                  onClick={handleSelectAll}
                >
                  <span className="text-gray-200 text-lg">
                    <RiCheckboxFill />
                  </span>
                </button>
              )}
              {(renderMode === "choice" || renderMode === "entry") &&
                allChecked && (
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
          )}

          <div className="flex w-1/2 h-full items-center justify-end">
            {renderMode === "choice" && (
              <button
                className="bg-gray-200 px-4 h-10 rounded-lg"
                onClick={() => handleUpdateContestGradePair()}
              >
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
        {categoryGradePair?.length > 0 &&
          categoryGradePair.map((data) => (
            <div
              className={`flex w-full lg:w-56 text-gray-200 rounded-lg flex-col gap-y-3 ${
                (renderMode === "choice" || renderMode === "entry") &&
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
                {data.category?.categoryTitle}
              </div>
              <div
                className="flex w-full flex-wrap gap-2 justify-start items-center h-full rounded-lg text-sm p-3"
                style={{
                  backgroundColor: "rgba(11,17,46,0.7)",
                  minHeight: "30px",
                }}
              >
                {data.matchedGrades?.length > 0 &&
                  data.matchedGrades
                    .sort((a, b) => a.gradeIndex - b.gradeIndex)
                    .map((grade, gIdx) => (
                      <div
                        className={`rounded-lg px-3 ${
                          (renderMode === "choice" || renderMode === "entry") &&
                          selectedItems.some(
                            (selectedItem) =>
                              selectedItem.category.id === data.category.id &&
                              selectedItem.matchedGrades.id === grade.id
                          )
                            ? " bg-sky-600 "
                            : " bg-gray-800 "
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            renderMode === "choice" ||
                            renderMode === "entry"
                          ) {
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

import { where } from "firebase/firestore";
import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { CategoryGradePairContext } from "../../contexts/CategoryGradePairContext";
import { useFirestoreQuery } from "../../hooks/useFirestores";

const CategoryList = ({ setSelectedTab }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { categoryGradePair, setCategoryGradePair } = useContext(
    CategoryGradePairContext
  );

  useEffect(() => {
    console.log(categoryGradePair);
  }, [categoryGradePair]);

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
        {categoryGradePair?.length > 0 &&
          categoryGradePair.map((data, idx) => (
            <div
              className="flex w-full lg:w-52 text-gray-200 rounded-lg p-3 flex-col gap-y-3"
              style={{
                backgroundColor: "rgba(11,17,66,0.7)",
                minHeight: "100px",
              }}
              onClick={() =>
                setSelectedTab({ id: "종목보기", categoryIndex: idx })
              }
            >
              <div className="flex w-full justify-center items-center h-10  rounded-lg text-sm font-normal lg:text-base lg:font-semibold">
                {data.category.categoryTitle}
              </div>
              <div
                className="flex w-full flex-wrap gap-2 justify-start items-center h-full  rounded-lg text-sm p-3"
                style={{
                  backgroundColor: "rgba(11,17,46,0.7)",
                  minHeight: "30px",
                }}
              >
                {data.matchedGrades.length > 0 &&
                  data.matchedGrades.map((grade, gIdx) => (
                    <div className="bg-sky-600 rounded-lg px-3">
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

import { where } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useFirestoreQuery } from "../../hooks/useFirestores";

const CategoryList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dataPair, setDataPair] = useState([]);
  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
  } = useFirestoreQuery("category_pool");

  const {
    data: gradeData,
    loading: gradeLoading,
    error: gradeError,
  } = useFirestoreQuery("grade_pool");

  useEffect(() => {
    if (categoryData.length > 0 && gradeData.length > 0) {
      const newDataPair = categoryData.map((category) => {
        const matchedGrades = gradeData.filter(
          (grade) => grade.refCategoryId === category.id
        );
        return { category, matchedGrades };
      });
      setDataPair(newDataPair);
    }
  }, [categoryData, gradeData]);

  useEffect(() => {
    console.log(dataPair);
  }, [dataPair]);

  return (
    <div className="flex w-full h-full flex-col gap-y-5 mt-5">
      <div
        className="flex w-full h-full rounded-lg flex-col"
        style={{ backgroundColor: "rgba(11,17,66,0.7)" }}
      >
        {dataPair?.length > 0 &&
          dataPair.map((data, idx) => <div>{data.category.categoryTitle}</div>)}
      </div>
    </div>
  );
};

export default CategoryList;

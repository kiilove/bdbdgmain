import { where } from "firebase/firestore";
import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { CategoryGradePairContext } from "../../contexts/CategoryGradePairContext";
import { useFirestoreQuery } from "../../hooks/useFirestores";

const CategoryList = () => {
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
        {categoryGradePair?.length > 0 &&
          categoryGradePair.map((data, idx) => (
            <div
              className="flex w-full lg:w-52 text-gray-200 "
              style={{
                backgroundColor: "rgba(11,17,66,1)",
                minHeight: "50px",
              }}
            >
              {data.category.categoryTitle}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CategoryList;

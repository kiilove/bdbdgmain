import React, { createContext, useState, useEffect } from "react";
import { useFirestoreQuery } from "../hooks/useFirestores";

export const CategoryGradePairContext = createContext();

export const CategoryGradePairProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryGradePair, setCategoryGradePair] = useState([]);
  const [getCategories, setGetCategories] = useState([]);
  const [getGrades, setGetGrades] = useState([]);
  const [dataPair, setDataPair] = useState([]);

  const categoryQuery = useFirestoreQuery();
  const gradeQuery = useFirestoreQuery();

  const fetchCategoriesAndGrades = async () => {
    setLoading(true);

    try {
      const [categoryData, gradeData] = await Promise.all([
        categoryQuery.getDocuments("category_pool"),
        gradeQuery.getDocuments("grade_pool"),
      ]);

      setGetCategories(categoryData || []);
      setGetGrades(gradeData || []);

      if (categoryData.length > 0 && gradeData.length > 0) {
        const sortedCategoryData = [...categoryData].sort(
          (a, b) => a.categoryIndex - b.categoryIndex
        );
        const newDataPair = sortedCategoryData.map((category) => {
          const matchedGrades = gradeData.filter(
            (grade) => grade.refCategoryId === category.id
          );
          return { category, matchedGrades };
        });

        setDataPair(newDataPair);
        return newDataPair;
      }
    } catch (error) {
      console.error(error);
      setError(error);
      setGetCategories([]);
      setGetGrades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadDataFromDatabase();
  }, []);

  const reloadDataFromDatabase = async () => {
    const newDataPair = await fetchCategoriesAndGrades();
    setCategoryGradePair(newDataPair);
    saveDataToLocalStorage(newDataPair);
  };

  const loadDataFromLocalStorage = () => {
    try {
      const storedData = JSON.parse(localStorage.getItem("categoryGradePair"));
      const storedTimestamp = localStorage.getItem(
        "categoryGradePairTimestamp"
      );

      if (storedData && storedTimestamp) {
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - storedTimestamp;

        if (timeDifference < 24 * 60 * 60 * 1000) {
          setCategoryGradePair(storedData);
          return true;
        }
      }
    } catch (error) {
      console.error(error);
      setError(error);
    }
    return false;
  };

  useEffect(() => {
    if (!loadDataFromLocalStorage()) {
      reloadDataFromDatabase();
    }
  }, []);

  const saveDataToLocalStorage = (data) => {
    console.log(data);
    localStorage.setItem("categoryGradePair", JSON.stringify(data));
    localStorage.setItem("categoryGradePairTimestamp", new Date().getTime());
  };

  const forceReloadData = () => {
    reloadDataFromDatabase();
  };

  useEffect(() => {
    saveDataToLocalStorage(categoryGradePair);
  }, [categoryGradePair]);

  return (
    <CategoryGradePairContext.Provider
      value={{
        categoryGradePair,
        setCategoryGradePair,
        forceReloadData,
        loading,
        error,
      }}
    >
      {children}
    </CategoryGradePairContext.Provider>
  );
};

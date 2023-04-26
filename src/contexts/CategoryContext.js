import React, { createContext, useState } from "react";
import { useFirestoreQuery } from "../hooks/useFirestores";
import { useEffect } from "react";

export const CategorysGradesContext = createContext();

export const CategorysGradesContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState(null);
  const [gradeList, setGradeList] = useState(null);
  const categoryQuery = useFirestoreQuery();
  const gradeQuery = useFirestoreQuery();

  const fetchDataFromDatabase = async () => {
    setLoading(true);
    try {
      const [categorys, grades] = await Promise.all([
        categoryQuery.getDocuments("category_pool"),
        gradeQuery.getDocuments("grade_pool"),
      ]);
      console.log(categorys);
      return { categoryList: [...categorys], gradeList: [...grades] };
    } catch (error) {
      return { categoryList: [], gradeList: [] };
    } finally {
      setLoading(false);
    }
  };

  const fetchDataFromLocalStorage = () => {
    setLoading(true);
    try {
      const categorys = JSON.parse(localStorage.getItem("categorys"));
      const grades = JSON.parse(localStorage.getItem("grades"));
      setCategoryList([...categorys]);
      setGradeList([...grades]);
    } catch (error) {
      setCategoryList([]);
      setGradeList([]);
    } finally {
      setLoading(false);
    }
  };

  const saveDataToLocalStorage = (data) => {
    localStorage.setItem("categorys", JSON.stringify(data.categoryList));
    localStorage.setItem("grades", JSON.stringify(data.gradeList));
    fetchDataFromLocalStorage();
  };

  const forceReloadFromDatabase = async () => {
    const newDataSet = await fetchDataFromDatabase();
    console.log(newDataSet);
    saveDataToLocalStorage(newDataSet);
  };

  useEffect(() => {
    fetchDataFromLocalStorage();
    if (categoryList === [] || gradeList === []) {
      forceReloadFromDatabase();
    } else {
      fetchDataFromLocalStorage();
    }
  }, []);

  return (
    <CategorysGradesContext.Provider
      value={{
        categoryList,
        setCategoryList,
        gradeList,
        setGradeList,
        forceReloadFromDatabase,
        loading,
      }}
    >
      {children}
    </CategorysGradesContext.Provider>
  );
};

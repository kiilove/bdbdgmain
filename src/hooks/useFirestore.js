import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";

const useFirestore = (
  collectionName,
  conditions = [],
  orderByField = "",
  orderByDirection = "asc",
  limitNumber = 0
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const q = query(
    collection(db, collectionName),
    ...conditions,
    orderBy(orderByField, orderByDirection),
    limit(limitNumber)
  );

  const getDocument = async (collectionId) => {
    try {
      setLoading(true);
      const docSnapshot = await getDoc(doc(db, collectionName, collectionId));
      if (docSnapshot.exists()) {
        setData([{ id: docSnapshot.id, ...docSnapshot.data() }]);
      } else {
        setError({ message: "Document does not exist" });
        setData([]);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const readData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(documents);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const addData = async (newData, callback) => {
    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, collectionName), newData);
      const addedData = { ...newData, id: docRef.id };
      setData((prevState) => [...prevState, addedData]);
      callback && callback(addedData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async (id, callback) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, collectionName, id));
      setData((prevState) => prevState.filter((item) => item.id !== id));
      callback && callback();
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (id, newData, callback) => {
    try {
      setLoading(true);
      const docRef = await updateDoc(doc(db, collectionName, id), newData);
      const updatedData = { ...newData, id: docRef.id };
      setData((prevState) =>
        prevState.map((item) => (item.id === id ? updatedData : item))
      );
      callback && callback(updatedData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(q);
        const newData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (isMounted) {
          setData((prevState) => {
            const shouldUpdate =
              prevState.length !== newData.length ||
              prevState.some(
                (prevItem, index) => !deepEqual(prevItem, newData[index])
              );
            return shouldUpdate ? newData : prevState;
          });
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setError(error);
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [q]);

  return {
    data,
    loading,
    error,
    getDocument,
    readData,
    addData,
    deleteData,
    updateData,
  };
};

export default useFirestore;

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
import deepEqual from "deep-equal";

export function useFirestoreQuery(
  collectionName,
  conditions = [],
  orderByField = "",
  orderByDirection = "asc",
  limitNumber = 0
) {
  let q = query(
    collection(db, collectionName),
    ...conditions,
    orderBy(orderByField, orderByDirection),
    limit(limitNumber)
  );

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(q);
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (isMounted) {
          setData((prevState) => {
            const shouldUpdate =
              prevState.length !== documents.length ||
              prevState.some(
                (prevItem, index) => !deepEqual(prevItem, documents[index])
              );
            return shouldUpdate ? documents : prevState;
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
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [q]);

  return {
    data,
    loading,
    error,
  };
}

export function useFirestoreGetDocument(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getDocument(collectionId) {
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
  }

  return {
    data,
    loading,
    error,
    getDocument,
  };
}

export function useFirestoreAddData(collectionName) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addData = async (newData) => {
    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, collectionName), newData);
      const addedData = { ...newData, id: docRef.id };
      setData(addedData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return [data, loading, error, addData];
}

export function useFirestoreUpdateData(collectionName) {
  const [data, setData] = useState([]);

  const updateData = async (id, newData) => {
    try {
      const docRef = await updateDoc(doc(db, collectionName, id), newData);
      const updatedData = { ...newData, id: docRef.id };
      setData((prevState) =>
        prevState.map((item) => (item.id === id ? updatedData : item))
      );
      return updatedData;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return { data, updateData };
}

export function useFirestoreDeleteData(collectionName) {
  const [data, setData] = useState([]);

  const deleteData = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      setData((prevState) => prevState.filter((item) => item.id !== id));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return { data, deleteData };
}

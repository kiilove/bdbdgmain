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
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import deepEqual from "deep-equal";

export function useFirestoreQuery(
  collectionName,
  conditions = [], // 배열로 기본값을 설정
  orderByField = "", // 빈 문자열로 기본값을 설정
  orderByDirection = "asc", // 기본값을 'asc'로 설정
  limitNumber = 0 // 0으로 기본값을 설정
) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getDocuments() {
    let q = collection(db, collectionName);
    if (conditions.length > 0) {
      conditions.forEach((condition) => {
        q = query(q, condition);
      });
    }
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderByDirection));
    }
    if (limitNumber) {
      q = query(q, limit(limitNumber));
    }

    try {
      setLoading(true);
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(documents);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(error);
      setLoading(false);
    }
  }

  return {
    data,
    loading,
    error,
    getDocuments,
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
        const getData = { id: docSnapshot.id, ...docSnapshot.data() };
        setData({ id: docSnapshot.id, ...docSnapshot.data() });
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
      return addedData;
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, addData };
}

export function useFirestoreUpdateData(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateData = async (id, newData, callback) => {
    console.log(id);
    try {
      setLoading(true);
      await updateDoc(doc(db, collectionName, id), newData);
      const updatedData = { ...newData };
      setData(updatedData);
      setLoading(false);
      callback && callback();
      return updatedData;
    } catch (error) {
      console.error(error);
      setError(error);
      setLoading(false);
      return null;
    }
  };

  return { data, loading, error, updateData };
}

export function useFirestoreDeleteData(collectionName) {
  const [data, setData] = useState([]);

  const deleteData = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      setData(id);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return { data, deleteData };
}

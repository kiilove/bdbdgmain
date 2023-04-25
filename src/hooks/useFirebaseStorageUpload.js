import { useState, useEffect } from "react";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";

const useFirebaseStorageUpload = (files, storagePath) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURLs, setDownloadURLs] = useState([]);

  useEffect(() => {
    const storage = getStorage();
    const storageRef = ref(storage, storagePath);

    const promises = Array.from(files).map((file) => {
      const fileRef = ref(storageRef, file.name);
      const uploadTask = uploadBytesResumable(fileRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          reject,
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    });

    Promise.all(promises)
      .then((downloadURLs) => {
        setDownloadURLs(downloadURLs);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [files, storagePath]);

  return { uploadProgress, downloadURLs };
};

export default useFirebaseStorageUpload;

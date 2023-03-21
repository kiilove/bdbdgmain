// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnh5EXHjV-ZnO8u3CJ5hhcmhsfNBiMJSc",
  authDomain: "bdbdgmain.firebaseapp.com",
  projectId: "bdbdgmain",
  storageBucket: "bdbdgmain.appspot.com",
  messagingSenderId: "193967452980",
  appId: "1:193967452980:web:c98e06d5312714483a6b61",
  measurementId: "G-JXECRGC3L2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
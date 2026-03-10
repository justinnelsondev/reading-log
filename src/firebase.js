// import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";


// const firebaseConfig = {
//   apiKey: "YOUR_KEY",
//   authDomain: "YOUR_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_BUCKET",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOq6DeGqPoXuCFFOuTvwWDNmGIC57tcFM",
  authDomain: "reading-log-cc424.firebaseapp.com",
  projectId: "reading-log-cc424",
  storageBucket: "reading-log-cc424.firebasestorage.app",
  messagingSenderId: "718744168531",
  appId: "1:718744168531:web:8e4740e8a0cf4fbd863ea6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

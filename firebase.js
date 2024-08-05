// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBH9vKcDzJ-04X3Nd8doMSVC_TP3IRWrgU",
  authDomain: "inventory-managment-8b1f2.firebaseapp.com",
  projectId: "inventory-managment-8b1f2",
  storageBucket: "inventory-managment-8b1f2.appspot.com",
  messagingSenderId: "888483898687",
  appId: "1:888483898687:web:506df18f2cb775ff8a1f8a",
  measurementId: "G-MJFFBZEHWP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
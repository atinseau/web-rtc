import { type FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDET0d3k1vM0JBbvnUWOl6fVGEadTV_83g",
  authDomain: "web-rtc-891c9.firebaseapp.com",
  databaseURL: "https://web-rtc-891c9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "web-rtc-891c9",
  storageBucket: "web-rtc-891c9.appspot.com",
  messagingSenderId: "598842354452",
  appId: "1:598842354452:web:f9e98ac7784a655fa4f001",
  measurementId: "G-7M8TSGEXBT"
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
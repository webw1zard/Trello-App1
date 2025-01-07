// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzp84xW0lfvWERvLpCKa0DUJ62-D4H2qs",
  authDomain: "trello-c0f1d.firebaseapp.com",
  projectId: "trello-c0f1d",
  storageBucket: "trello-c0f1d.appspot.com",
  messagingSenderId: "921543472828",
  appId: "1:921543472828:web:030936bbc4d4f56ffb82b9",
  databaseURL: "https://trello-c0f1d-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const firestore = getFirestore(app);

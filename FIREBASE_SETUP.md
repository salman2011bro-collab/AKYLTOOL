import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBKCYLapOLgVFTbU25kPrmR-MhznS3swuk",
  authDomain: "akyltool.firebaseapp.com",
  databaseURL: "https://akyltool-default-rtdb.firebaseio.com",
  projectId: "akyltool",
  storageBucket: "akyltool.firebasestorage.app",
  messagingSenderId: "717164888546",
  appId: "1:717164888546:web:0943c85847ea167270339bb",
  measurementId: "G-JY6SMQGB5K"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
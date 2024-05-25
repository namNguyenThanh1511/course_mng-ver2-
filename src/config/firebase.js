// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsT8tjYCImTS3Sj1qbu_3Fd-yYlcaKSHU",
  authDomain: "course-mngver2.firebaseapp.com",
  projectId: "course-mngver2",
  storageBucket: "course-mngver2.appspot.com",
  messagingSenderId: "12139069817",
  appId: "1:12139069817:web:8f0c9ec2729d819ecbefa8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage;

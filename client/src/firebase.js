// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-5cd8b.firebaseapp.com",
  projectId: "mern-blog-5cd8b",
  storageBucket: "mern-blog-5cd8b.appspot.com",
  messagingSenderId: "684696834888",
  appId: "1:684696834888:web:e94e3b7084e7303c9ad97d"
};

// Initialize Firebase
// eslint-disable-next-line no-unused-vars
export const app = initializeApp(firebaseConfig);
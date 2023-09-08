import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQSbyy4-a84CyEScYc73z1sBVxySankQY",
  authDomain: "chatgptapplication-e8432.firebaseapp.com",
  projectId: "chatgptapplication-e8432",
  storageBucket: "chatgptapplication-e8432.appspot.com",
  messagingSenderId: "1066205898547",
  appId: "1:1066205898547:web:3c631fa92f723581880046",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// export default { db, auth };

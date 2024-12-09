import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCwv6ZujICnLbNW1RA_xH-xnTDigzyDa7w",
  authDomain: "whatsapp-clone-1b3cb.firebaseapp.com",
  projectId: "whatsapp-clone-1b3cb",
  storageBucket: "whatsapp-clone-1b3cb.appspot.com",
  messagingSenderId: "640212041462",
  appId: "1:640212041462:web:e968f662da70276ddf36d7",
  measurementId: "G-50MW0HKMHG"
};

const app=initializeApp(firebaseConfig);
export const firebaseAuth=getAuth(app);
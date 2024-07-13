// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC4PjPK01D3BudvQk6FaH3a8q0ZsLgZsvI",
    authDomain: "scoremate-b6939.firebaseapp.com",
    projectId: "scoremate-b6939",
    storageBucket: "scoremate-b6939.appspot.com",
    messagingSenderId: "989769553415",
    appId: "1:989769553415:web:c1b1daa0f7c6214b907ca2",
    measurementId: "G-8Z4R5Y89GE",
}

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig)

//firebase firestore DB setup
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBZaRHMpIBhaEP27Tw878-KQx4jgGsU_3M",
    authDomain: "todo-application-82f25.firebaseapp.com",
    projectId: "todo-application-82f25",
    storageBucket: "todo-application-82f25.firebasestorage.app",
    messagingSenderId: "70181853432",
    appId: "1:70181853432:web:867b9947a09763737dc30d",
    measurementId: "G-HX0D7QRJ2P"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
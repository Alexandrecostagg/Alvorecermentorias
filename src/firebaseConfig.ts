// src/firebaseconfig.tsx

import { initializeApp, FirebaseApp } from "firebase/app";
// import { getAnalytics, Analytics } from "firebase/analytics"; // Comentado: Se não for usar Analytics
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBElFixiBJQrHoGOsb9HKJh36hTQ4yHP50", // Sua API Key
  authDomain: "alvorecermentorias.firebaseapp.com",
  projectId: "alvorecermentorias",
  storageBucket: "alvorecermentorias.appspot.com", // <-- CORRIGIDO AQUI com o nome do bucket padrão
  messagingSenderId: "23903019061",
  appId: "1:23903019061:web:793c293a1e0dee0bdee517c",
  // measurementId: "G-MNF6DBBZHT" // Comentado: Se não for usar Analytics
};

// Inicializa o aplicativo Firebase principal
export const app: FirebaseApp = initializeApp(firebaseConfig);

// Inicializa e exporta Analytics (comentado se não for usar)
// export const analytics: Analytics = getAnalytics(app);

// Inicializa e exporta Auth (necessário para AdminPage)
export const auth: Auth = getAuth(app);

// Inicializa e exporta Firestore (necessário para CoursesList e AdminPage)
export const db: Firestore = getFirestore(app);

// Inicializa e exporta Storage (necessário para upload de imagens no AdminPage)
export const storage: FirebaseStorage = getStorage(app);

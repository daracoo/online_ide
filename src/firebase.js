import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAhJmSwvE13aXBsD4cDYcLm7MphzQ6K0EE",
  authDomain: "online-code-editor-f0555.firebaseapp.com",
  databaseURL: "https://online-code-editor-f0555-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "online-code-editor-f0555",
  storageBucket: "online-code-editor-f0555.firebasestorage.app",
  messagingSenderId: "881872916573",
  appId: "1:881872916573:web:c36626357f7df8aff9fdb4"
};

const app = initializeApp(firebaseConfig);

export default app;

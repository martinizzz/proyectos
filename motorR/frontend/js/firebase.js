  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";


  const firebaseConfig = {
    apiKey: "AIzaSyBIX01BGpZRuEKTgGRnxIynRhWyPMZ8GDk",
    authDomain: "shopping-cart-2a11c.firebaseapp.com",
    projectId: "shopping-cart-2a11c",
    storageBucket: "shopping-cart-2a11c.firebasestorage.app",
    messagingSenderId: "394678996608",
    appId: "1:394678996608:web:319eee7424c4772808e065"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  export const db=getFirestore(app);
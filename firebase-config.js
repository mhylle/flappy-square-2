// Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
    import { getDatabase } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyDJ9gm5gtY1mzf39UhmPbp-TXdTjvnpZBY",
      authDomain: "rotatingkids.firebaseapp.com",
      databaseURL: "https://rotatingkids-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "rotatingkids",
      storageBucket: "rotatingkids.firebasestorage.app",
      messagingSenderId: "744521849525",
      appId: "1:744521849525:web:22457b19d906cde3c97cfc"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    export { database };

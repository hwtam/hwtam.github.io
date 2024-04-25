// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue , set} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAggbgsp9bXGo8x0g0ZWjzGMzUjgZQKeCQ",
  authDomain: "tomtom-try.firebaseapp.com",
  projectId: "tomtom-try",
  storageBucket: "tomtom-try.appspot.com",
  messagingSenderId: "832404157510",
  appId: "1:832404157510:web:e0a493593382d035ce4647",
  measurementId: "G-FD8MH7YZVP",
  databaseURL: "https://tomtom-try-default-rtdb.firebaseio.com"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const counterRef = ref(database, 'counter');
const button = document.querySelector('#button');
const counter = document.querySelector('#counter');

// Listen for value changes in the counter
onValue(counterRef, (snapshot) => {
  const data = snapshot.val();
  console.log(data);
  counter.innerText = data;
});

// Increment the counter when the button is clicked
button.addEventListener('click', () => {
  const value = counter.innerText;
  set(counterRef, {
    value: value + 1,
  });
});
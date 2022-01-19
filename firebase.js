const firebase = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyBiG4-chT6iYQnyzuitxd9CuSA966ntj04",
    authDomain: "test-proj-55cae.firebaseapp.com",
    projectId: "test-proj-55cae",
    storageBucket: "test-proj-55cae.appspot.com",
    messagingSenderId: "144348193656",
    appId: "1:144348193656:web:314c5421a29c7b021dde8d"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
  
const db = firebase.firestore();
module.exports = { db };

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAGRkWc-JypFcG4Sr5nNmRiP4v4IsGgMBU",
  authDomain: "slack-clone-4f4cf.firebaseapp.com",
  databaseURL: "https://slack-clone-4f4cf.firebaseio.com",
  projectId: "slack-clone-4f4cf",
  storageBucket: "slack-clone-4f4cf.appspot.com",
  messagingSenderId: "665077797390",
  appId: "1:665077797390:web:29de59b97addd540cba25f",
  measurementId: "G-KJZTSZ5XWS",
};
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export default firebase;

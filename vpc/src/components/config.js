// import firebase from 'firebase/compat/app';
// // import 'firebase/compat/auth';
// // import 'firebase/compat/firestore';

// const firebaseConfig = {
//   apiKey: "AIzaSyBFuXI5hm1KJh4QLgvf-dWqAj8S10cKuxg",
//   authDomain: "image-upload-8f950.firebaseapp.com",
//   databaseURL: "https://image-upload-8f950-default-rtdb.firebaseio.com",
//   projectId: "image-upload-8f950",
//   storageBucket: "image-upload-8f950.appspot.com",
//   messagingSenderId: "632281408442",
//   appId: "1:632281408442:web:2efb9b43337fcc9352f383"
// };








// firebase.initializeApp(firebaseConfig);

// export const firebaseRef = firebase.database().ref();
// export const storage = firebase.storage();
// export default firebase;

// // Use this to initialize the firebase App
// // const firebaseApp = firebase.initializeApp(firebaseConfig);

// // // Use these for db & auth
// // const db = firebaseApp.firestore();
// // const auth = firebase.auth();

// // export { auth, db };
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBFuXI5hm1KJh4QLgvf-dWqAj8S10cKuxg",
  authDomain: "image-upload-8f950.firebaseapp.com",
  databaseURL: "https://image-upload-8f950-default-rtdb.firebaseio.com",
  projectId: "image-upload-8f950",
  storageBucket: "image-upload-8f950.appspot.com",
  messagingSenderId: "632281408442",
  appId: "1:632281408442:web:2efb9b43337fcc9352f383"
};








firebase.initializeApp(firebaseConfig);

export const firebaseRef = firebase.database().ref();
export const storage = firebase.storage();
export default firebase;

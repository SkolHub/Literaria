// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDgN1nyrsXvq_l_F0vF35lgkML8Px_9GgY',
  authDomain: 'literaria-info.firebaseapp.com',
  projectId: 'literaria-info',
  storageBucket: 'literaria-info.appspot.com',
  messagingSenderId: '541888972404',
  appId: '1:541888972404:web:4a4cce30aad74972ba3321',
  measurementId: 'G-41RQK3JR9R'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
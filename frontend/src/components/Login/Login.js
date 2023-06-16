import React from 'react';
import './Login.css';
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "CHANGE_WITH_PEROSNAL",
    authDomain: "cd-user-baddies.firebaseapp.com",
    projectId: "cd-user-baddies",
    storageBucket: "cd-user-baddies.appspot.com",
    messagingSenderId: "CHANGE_WITH_PEROSNAL",
    appId: "1:CHANGE_WITH_PEROSNAL:web:5c6ee1f310aec572c34df5",
    measurementId: "G-4026EEFZZ3"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Login = () => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }

  const signInWithApple = () => {
    const provider = new OAuthProvider('apple.com');
    signInWithPopup(auth, provider);
  }

  return (
    <div className="login-buttons">
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <button onClick={signInWithApple}>Sign in with Apple</button>
    </div>
  );
}

export default Login;

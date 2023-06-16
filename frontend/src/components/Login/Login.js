import React, { useEffect, useState } from 'react';
import './Login.css';
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider, onAuthStateChanged,signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import Dashboard from '../Dashboard/Dashboard';

const firebaseConfig = {
    apiKey: "AIzaSyB-vRFrtFhIbXw2NHMj8VfBvi2iMU4kxwE",
    authDomain: "cd-user-baddies.firebaseapp.com",
    projectId: "cd-user-baddies",
    storageBucket: "cd-user-baddies.appspot.com",
    messagingSenderId: "984565407792",
    appId: "1:984565407792:web:5c6ee1f310aec572c34df5",
    measurementId: "G-4026EEFZZ3"
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  const Login = () => {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null);
    const [newUser, setNewUser] = useState(false);
  
    useEffect(() => {
      signOut(auth).catch((err) => {
        console.error('Error signing out:', err.message);
      });
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          const docRef = doc(db, 'Users', user.uid);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            setUserType(docSnap.data().userType)
            setUser(user);
          } else {
            setUser(user);
            setNewUser(true);
          }

        } else {
          setUser(null);
          setUserType(null);
        }
      });
  
      return () => {
        unsubscribe();
      };
    }, [auth, db]);
  
    const signInWithGoogle = () => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider);
    }
  
    const signInWithApple = () => {
      const provider = new OAuthProvider('apple.com');
      signInWithPopup(auth, provider);
    }
  
    const handleUserType = async (type) => {
      const userData = {
        uid: auth.currentUser.uid,
        userType: type,
        Name: auth.currentUser.displayName,
      };
      
      await setDoc(doc(db, 'Users', auth.currentUser.uid), userData);
    
      setUserType(type);
      setNewUser(false);
    }
  
    if (user) {
      return <Dashboard user={user} userType={userType} />;
    }
  
    return (
      <div className="login-buttons">
        {newUser ? (
          <div className="user-type">
            <p>Please select your user type:</p>
            <button onClick={() => handleUserType('business')}>I'm a business</button>
            <button onClick={() => handleUserType('customer')}>I'm a customer</button>
          </div>
        ) : (
          <>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
            <button onClick={signInWithApple}>Sign in with Apple</button>
          </>
        )}
      </div>
    );
  }
  
  export default Login;
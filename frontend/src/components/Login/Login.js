import React, { useEffect, useState } from 'react';
import './Login.css';
import { UserContext } from '../User/UserContext';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import Dashboard from '../Routing/Routing';

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
const db = getFirestore(app);

const Login = () => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [newUser, setNewUser] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(""); // Added phoneNumber state
  const [postalCode, setPostalCode] = useState(""); // Added postalCode state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'Users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserType(userData.userType);
          setUser(userData);
          setNewUser(false);
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
    var userData = {};
    if (type === "customer") {
      userData = {
        uid: auth.currentUser.uid,
        userType: type,
        Name: auth.currentUser.displayName,
        contactNumber: phoneNumber,
        postalCode: postalCode,
        Rating: 5,
        Posts: [],
      };
    } else {
      userData = {
        uid: auth.currentUser.uid,
        userType: type,
        Name: auth.currentUser.displayName,
        contactNumber: phoneNumber,
        postalCode: postalCode,
        Rating: 5,
        Gigs: [],
      };
    }
    await setDoc(doc(db, 'Users', auth.currentUser.uid), userData);

    setUserType(type);
    setUser(userData);
    setNewUser(false);
  }

  if (user && !newUser) {
    return (
      <UserContext.Provider value={user}>
        <Dashboard user={user} userType={userType} />
      </UserContext.Provider>
    );
  } else if (user && newUser) {
    console.log(user);
    
    return (
      <div className="user-type">
        <p>Please provide your phone number and postal code:</p>
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
        <p>Please select your user type:</p>
        <button onClick={() => handleUserType('business')}>I'm a business</button>
        <button onClick={() => handleUserType('customer')}>I'm a customer</button>
      </div>
    );
  }

  return (
    <div className="login-buttons">
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <button onClick={signInWithApple}>Sign in with Apple</button>
    </div>
  );
}

export default Login;

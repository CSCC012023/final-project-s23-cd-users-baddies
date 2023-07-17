const { auth, admin, firestore } = require('../firebase');

// Function for Google sign-in
const signInWithGoogle = async (req, res) => {
    try {
        const { idToken } = req.body;
    
        // Verify the Google ID token
        const credential = await auth.verifyIdToken(idToken);
        const { uid, email, name } = credential;
    
        // Check if the user exists in the Firestore database
        const userRef = firestore.collection('Users').doc(uid);
        const userDoc = await userRef.get();
    
        if (userDoc.exists) {
          // User already registered, send user data to the frontend
          const userData = userDoc.data();
          res.status(200).json(userData);
        } else {
          // User not registered, create a new user document
          const newUser = {
            uid,
            email,
            name,
            userType: '',
            contactNumber: '',
            postalCode: '',
            Rating: 5,
            Posts: [],
          };
    
          await userRef.set(newUser);
    
          res.status(200).json(newUser);
        }
      } catch (error) {
        console.error('Error signing in with Google:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
  };

// Function for user registration
const registerProcess = async (req, res) => {
  try {
    const { uid, userType, contactNumber, postalCode } = req.body;

    // Save the user information to the Firestore database
    const userDocRef = firestore.collection('User').doc(uid);
    const newUser = {
      uid,
      userType,
      contactNumber,
      postalCode,
      Rating: 5,
      Posts: [],
    };
    await userDocRef.set(newUser);

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { signInWithGoogle, registerProcess };




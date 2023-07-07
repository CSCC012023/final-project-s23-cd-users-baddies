import React, { useEffect, useState} from 'react';
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
import Routing from '../Routing/Routing';
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  Image,
  Box,
  Link,
  FormControl,
  FormHelperText,
  InputRightElement,
  Text,
  Checkbox
} from "@chakra-ui/react";
import BusinessRegistriation from "./BusinessRegistration"
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

  const [showBusinessForm, setShowBusinessForm] = useState(false);
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
      setShowBusinessForm(true);
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
        <Routing user={user} userType={userType} />
      </UserContext.Provider>
    );
  } else if (user && newUser) {
    console.log(user);
    
    return (

<Flex
      flexDirection="column"
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        {/* <Avatar bg="teal.500" /> */}
        <Image src='./bizreach-logo.png' alt='BizReach Logo' htmlWidth='200px'/>
        <Heading color="teal.400">Create your account!</Heading>
            <Stack
              p="1rem"
              // backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >

           
             <Text as='h3' size='m' pb='10px' textAlign={"left"} mb='-15'>
                  Email Address
                </Text>
  

             <FormControl>
                <InputGroup>
                <Input type="email" placeholder="Email Address" pr="180px" pt='0%' mt='1%'/>
                </InputGroup>
              </FormControl>
              <FormControl>


              <Text as='h3' size='m' pb='10px' textAlign={"left"} mb='-15'>
                  Phone Number
                </Text>
                <InputGroup>
                
                  <Input
                    placeholder="Phone Number" mt='2%'
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                  </InputRightElement>
                </InputGroup>
                </FormControl>

                <Heading color="teal.400" mt='10%'>Please select your user type</Heading>
                

            <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                align='right'
                mt='5%'
                onClick={() => handleUserType('business')}
  
              >
                I am a Business

                
              </Button>

              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                mt='5%'
                onClick={() => handleUserType('customer')}
                
  
              >
                I am a Customer
              </Button>


              if(showBusinessForm) {
            <Box>
              <Text>Welcome, Business User!</Text>
              <Text>Additional business-specific content...</Text>
            </Box>
          }

            </Stack>
      </Stack>
    </Flex>

      

      


      // <div className="user-type">
      //   <p>Please provide your phone number and postal code:</p>
      //   <input
      //     type="text"
      //     placeholder="Phone Number"
      //     value={phoneNumber}
      //     onChange={(e) => setPhoneNumber(e.target.value)}
      //   />
      //   <input
      //     type="text"
      //     placeholder="Postal Code"
      //     value={postalCode}
      //     onChange={(e) => setPostalCode(e.target.value)}
      //   />
      //   <p>Please select your user type:</p>
      //   <button onClick={() => handleUserType('business')}>I'm a business</button>
      //   <button onClick={() => handleUserType('customer')}>I'm a customer</button>
      // </div>
    );
  }


  return (


    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      // backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        {/* <Avatar bg="teal.500" /> */}
        <Image src='./bizreach-logo.png' alt='BizReach Logo' htmlWidth='300px'/>
        <Heading color="teal.400">Welcome To BizReach!</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form>
            <Stack
              spacing={4}
              p="1rem"
              // backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  <Input type="email" placeholder="Email address" />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                
                  <Input
                    placeholder="Password"
                  />
                  <InputRightElement width="4.5rem">
                  </InputRightElement>
                </InputGroup>
                <FormHelperText textAlign="right">
                  <Link>forgot password?</Link>
                </FormHelperText>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box pb ="20px">
        Or{" "}
      </Box>

      <Button onClick={signInWithGoogle}  borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full" 
                >Sign in with Google</Button>
    </Flex>


  );
};

export default Login;

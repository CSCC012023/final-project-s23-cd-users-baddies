import React, { useEffect, useState } from 'react';
import './Login.css';
import { UserContext } from '../User/UserContext';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import Routing from '../Routing/Routing';
import { FcGoogle } from 'react-icons/fc';
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  Image,
  Box,
  SimpleGrid,
  Progress,
  FormControl,
  InputRightElement,
  CardFooter,
  FormLabel,
  Text,
  Card,
  CardHeader,
  CardBody,Center, Alert, AlertIcon, Grid, GridItem, Select} from '@chakra-ui/react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
const firebaseConfig = {
  apiKey: 'AIzaSyB-vRFrtFhIbXw2NHMj8VfBvi2iMU4kxwE',
  authDomain: 'cd-user-baddies.firebaseapp.com',
  projectId: 'cd-user-baddies',
  storageBucket: 'cd-user-baddies.appspot.com',
  messagingSenderId: '984565407792',
  appId: '1:984565407792:web:5c6ee1f310aec572c34df5',
  measurementId: 'G-4026EEFZZ3',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const Login = () => {
  const [progress, setProgress] = useState(25);
  const [user, setUser] = useState(null);
  const [signup, setSignup] = useState(false);
  const [userType, setUserType] = useState(null);
  const [newUser, setNewUser] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [location, setLocation] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessHours, setBusinessHours] = useState({
    Monday: null,
    Tuesday: null,
    Wednesday: null,
    Thursday: null,
    Friday: null,
    Saturday: null,
    Sunday: null,
  });

  const locations = ['Mississauga', 'Toronto', 'Oakville'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'User', user.uid);
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

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
      prompt: 'select_account'
    });
      await signInWithPopup(auth, provider);
      setError('');
    } catch (error) {
      setError(error.message);
      console.error('Google sign-in failed. Error: ', error.message);
    }
  };

  const signInWithEmail = async (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      setUser(user);
      setEmail('');
      setPassword('');
      setError('');
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorMessage);
      console.log(email);
      console.log(password);
      console.log(errorCode);
      console.log(errorMessage);
    });

  };

  const signUpWithEmail = async (email, password) => {
    
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      setUser(user);
      setEmail('');
      setPassword('');
      setError('');
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorMessage);
      console.log(email);
      console.log(password);
      console.log(errorCode);
      console.log(errorMessage);
    });

  };

  const handleBusinessFormSubmit = async () => {
    if (!businessName || !businessDescription || Object.keys(businessHours).length === 0) {
      setError('Please fill in all the required information');
      return;
    }
    setError('');
    const userData = {
      uid: auth.currentUser.uid,
      userType: 'business',
      Name: auth.currentUser.displayName,
      contactNumber: phoneNumber,
      postalCode: postalCode,
      Rating: 5,
      Business: {
        Name: businessName,
        Description: businessDescription,
        Hours: businessHours,
      },
      Location: location,
    };

    await setDoc(doc(db, 'User', auth.currentUser.uid), userData);
    
    setUser(userData);
    setNewUser(false);
  };
  const handleCustomerFormSubmit = async () => {
    if (!customerName || !location || Object.keys(businessHours).length === 0) {
      setError('Please fill in all the required information');
      return;
    }
    setError('');
    const userData = {
      uid: auth.currentUser.uid,
      userType: 'customer',
      Name: customerName,
      contactNumber: phoneNumber,
      postalCode: postalCode,
      Rating: 5,
      Location: location,
    };

    await setDoc(doc(db, 'User', auth.currentUser.uid), userData);
    
    setUser(userData);
    setNewUser(false);
  };
  
  if (signup && !user){
    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}>
        
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        {error !== '' ? (
  <Alert status='error'>
    <AlertIcon />
    {error}
  </Alert>
) : null}
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Sign up
            </Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              to enjoy all of our cool features ✌️
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type="email"  onChange={(e) => setEmail(e.target.value)}/>
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)}/>
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  onClick={() => signUpWithEmail(email,password)}
                  loadingText="Submitting"
                  size="lg"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
              <Button
                  onClick={() => { setSignup(false); setError(''); } }
              bg={'blue.600'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}> Back</Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    )
  }
  if (user && !newUser) {
    return (
      <UserContext.Provider value={user}>
        <Routing user={user} userType={userType} />
      </UserContext.Provider>
    );
  } else if (user && newUser) {
    if (userType === 'business') {
      
      return (
        <>
          <Progress size="md"  hasStripe value={progress} mb={10} />
          <Flex minH={'100vh'} align={'center'} justify={'center'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            {error !== '' ? (
  <Alert status='error'>
    <AlertIcon />
    {error}
  </Alert>
) : null}
              <Heading>Create a Business Account</Heading>
              <FormControl id="name" isRequired>
                <FormLabel>Business Name</FormLabel>
                <Input type="text" onChange={(e) => setBusinessName(e.target.value)} />
              </FormControl>
              <FormControl id="description" isRequired>
                <FormLabel>Business Description</FormLabel>
                <Input type="text" onChange={(e) => setBusinessDescription(e.target.value)} />
              </FormControl>
              <FormControl id="hours" isRequired>
                <FormLabel>Business Hours</FormLabel>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  {Object.keys(businessHours).map((day) => (
                    <GridItem key={day}>
                      <Flex flexDirection="column">
                        <Text>{day}</Text>
                        <Flex flexDirection="row" justifyContent="space-between">
                          <Select placeholder="Open" onChange={(e) => setBusinessHours((prevHours) => ({
                            ...prevHours,
                            [day]: { ...prevHours[day], startHour: e.target.value },
                          }))}>
                            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                              <option key={hour} value={hour}>
                                {(hour < 10 ? '0' : '') + hour}:00
                              </option>
                            ))}
                          </Select>
                          <Select placeholder="Close" onChange={(e) => setBusinessHours((prevHours) => ({
                            ...prevHours,
                            [day]: { ...prevHours[day], endHour: e.target.value },
                          }))}>
                            {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
                              <option key={hour} value={hour}>
                                {(hour < 10 ? '0' : '') + hour}:00
                              </option>
                            ))}
                          </Select>
                        </Flex>
                      </Flex>
                    </GridItem>
                  ))}
                </Grid>
              </FormControl>
              <Button
                type='submit'
                onClick={() => handleBusinessFormSubmit()}
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
              >
                Create Account
              </Button>
              <Button
                onClick={() => {
                  setUserType('');
                  setProgress(25);
                }}
                bg={'blue.600'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
              >
                Back
              </Button>
            </Stack>
          </Flex>
        </>
      );
    }
    if (userType === 'customer'){
      return ( <><Progress size="md" colorScheme="teal" hasStripe value={progress} mb={10} />     <Flex minH={'100vh'} align={'center'} justify={'center'}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        {error !== '' ? (
  <Alert status='error'>
    <AlertIcon />
    {error}
  </Alert>
) : null}
        <Heading>Create a Customer Account</Heading>
        <FormControl id="name" isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input type="text" onChange={(e) => setCustomerName(e.target.value)} />
        </FormControl>
        <FormControl id="phone" isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input type="text" onChange={(e) => setPhoneNumber(e.target.value)} />
        </FormControl>
        <FormControl id="postalCode" isRequired>
          <FormLabel>Postal Code</FormLabel>
          <Input type="text" onChange={(e) => setPostalCode(e.target.value)} />
        </FormControl>
          <FormControl id="location" isRequired>
          <FormLabel>Location</FormLabel>
        <Select placeholder="Select location" onChange={(e) => setLocation(e.target.value)}>
    {locations.map((location) => (
      <option key={location} value={location}>
        {location}
      </option>
    ))}
  </Select>

          </FormControl>
          <Button
              type='submit'
            onClick={() => handleCustomerFormSubmit()}
            bg={'blue.400'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}
          >
            Create Account
          </Button>
          <Button
            onClick={() => {
              setUserType('');
              setProgress(25);
            }}
            bg={'blue.600'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}
          >
            Back
          </Button>
        </Stack>
    </Flex></>);
      }
    return (
      <>
       <Progress size="md" colorScheme="teal" hasStripe value={progress} mb={10} />
       <Flex
    minH={'100vh'}
    align={'center'}
    justify={'center'}>
          <Box width="auto">
           
            <SimpleGrid spacing={4} >
              <Card>
                <CardHeader>
                  <Heading size='md'> Business Account Creation</Heading>
                </CardHeader>
                <CardBody>
                  <Text>Create a business account to accept gigs from customers and manage your services effectively.</Text>
                </CardBody>
                <CardFooter>
                  <Button onClick={() => { setUserType('business'); setProgress(75); }}>Create Account</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <Heading size='md'> Customer Account Creation </Heading>
                </CardHeader>
                <CardBody>
                  <Text>Sign up as a customer to explore available services, hire businesses, and post gigs requirements.</Text>
                </CardBody>
                <CardFooter>
                  <Button onClick={()=> {setUserType('customer'); setProgress(75);}} >Sign Up</Button>
                </CardFooter>
              </Card>
            </SimpleGrid>
          </Box>
        </Flex>
      </>
    );
    }

  return (<Flex
    minH={'100vh'}
    align={'center'}
    justify={'center'}>
 
    <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
    {error !== '' ? (
  <Alert status='error'>
    <AlertIcon />
    {error}
  </Alert>
) : null}
      <Stack align={'center'}>
      <Image src="./bizreach-logo.png" alt="BizReach Logo" htmlWidth="300px" />
        <Heading>Welcome To BizReach!</Heading>
      </Stack>
      <Box
        rounded={'lg'}
        boxShadow={'lg'}
        p={8}>
        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input type="email" onChange={(e) => setEmail(e.target.value)}/>
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" onChange={(e) => setPassword(e.target.value)}/>
          </FormControl>
          <Stack spacing={10}>
            <Button
              onClick={() => signInWithEmail(email,password)}
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}>
              Sign in
            </Button>
            <Button
              onClick={() => { setSignup(true); setError(''); }}
              bg={'blue.600'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}>
              New here? Sign up!
            </Button>
          </Stack>
        </Stack>
      </Box>
      <Button  onClick={() => signInWithGoogle()} w={'full'} variant={'outline'} leftIcon={<FcGoogle />}>
<Center>
  <Text>Sign in with Google</Text>
</Center>
</Button>
    </Stack>
  </Flex>
  );
};

export default Login;

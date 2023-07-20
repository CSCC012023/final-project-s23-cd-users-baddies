import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
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
  Select,
  Grid,
  GridItem,} from '@chakra-ui/react';

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
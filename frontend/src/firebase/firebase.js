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
  apiKey: 'CHANGE_WITH_PEROSNAL',
  authDomain: 'cd-user-baddies.firebaseapp.com',
  projectId: 'cd-user-baddies',
  storageBucket: 'cd-user-baddies.appspot.com',
  messagingSenderId: 'CHANGE_WITH_PEROSNAL',
  appId: '1:CHANGE_WITH_PEROSNAL:web:5c6ee1f310aec572c34df5',
  measurementId: 'G-4026EEFZZ3',
};

const app = initializeApp(firebaseConfig);
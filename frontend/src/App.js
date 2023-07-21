import React from 'react';
import './App.css';
import Login from './components/Login/Login';

// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react';



function App() {
  return (
    <div>
<ChakraProvider>
        <Login />
    </ChakraProvider>
  </div>
  );
}

export default App;

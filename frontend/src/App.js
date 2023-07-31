import React from 'react';
import './App.css';
import Login from './components/Login/Login';

// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react';



function App() {
  return (
    <div>
<ChakraProvider>
  <div className="App">
      <header className="App-header">
        <Login />
      </header>
    </div>
    </ChakraProvider>
  </div>
  );
}

export default App;

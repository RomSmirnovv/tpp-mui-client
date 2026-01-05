import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Router from './components/router';
import { SocketProvider } from './contexts/SocketContext';

function App() {


  return (
    <>
      <SocketProvider>
        <Router />
      </SocketProvider>
    </>
  )
}

export default App

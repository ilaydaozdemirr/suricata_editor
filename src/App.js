// src/App.js

import React from 'react';
import './App.css';
import { RuleProvider } from './context/RuleContext';
import IdeLayout from './components/IdeLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() { 
    return (
        <RuleProvider>
            <IdeLayout />
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </RuleProvider>
    ); 
}

export default App;
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoaderProvider } from './context/LoaderContext'; // Import LoaderProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LoaderProvider>
      <ToastContainer />
      <App />
    </LoaderProvider>
  </BrowserRouter>
);

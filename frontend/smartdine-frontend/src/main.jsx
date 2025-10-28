import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { PendingCountProvider } from './context/PendingCountContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PendingCountProvider>
          <App />
        </PendingCountProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

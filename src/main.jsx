import React, { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './index.css';
import App from './App.jsx';

import PaginaMantenimiento from './paginas/pagina_mantenimiento/PaginaMantenimiento.jsx';

const estaEnMantenimiento = import.meta.env.VITE_MAINTENANCE === 'true' || import.meta.env.VITE_MAINTENANCE === 'True'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {estaEnMantenimiento ? (
      <PaginaMantenimiento />
    ) : (
      <BrowserRouter>
        <Provider store={store}>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <App />
          </GoogleOAuthProvider>
        </Provider>
      </BrowserRouter>
    )}
  </StrictMode>,
)
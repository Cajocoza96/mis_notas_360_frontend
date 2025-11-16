import React, { StrictMode } from 'react';
import "react-loading-skeleton/dist/skeleton.css";
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthInitializer from './componentes/cargando_no_hay_nada/AuthInitializer.jsx'; 

import './index.css';
import App from './App.jsx';
import PaginaMantenimiento from './paginas/pagina_mantenimiento/PaginaMantenimiento.jsx';

const estaEnMantenimiento = import.meta.env.VITE_MAINTENANCE === 'true' || import.meta.env.VITE_MAINTENANCE === 'True';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {estaEnMantenimiento ? (
      <PaginaMantenimiento />
    ) : (
      <Provider store={store}>
        <BrowserRouter>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            {/* ✅ AuthInitializer verifica el token UNA SOLA VEZ */}
            <AuthInitializer>
              <App />
            </AuthInitializer>
          </GoogleOAuthProvider>
        </BrowserRouter>
      </Provider>
    )}
  </StrictMode>,
);
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/dm-sans';
import './styles/app.css';
import { App } from './App';
import { ActionsProvider } from './components/actions';
import { ToastProvider } from './components/Toast';
import { StoreProvider } from './data/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <StoreProvider>
        <ActionsProvider>
          <App />
        </ActionsProvider>
      </StoreProvider>
    </ToastProvider>
  </StrictMode>,
);

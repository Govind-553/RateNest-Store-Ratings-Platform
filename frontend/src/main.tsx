import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/variables.css';
import './styles/globals.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/animations.css';
import './styles/responsive.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

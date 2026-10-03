import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundaryWithSelfFix } from './components/ErrorBoundaryWithSelfFix.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundaryWithSelfFix>
      <App />
    </ErrorBoundaryWithSelfFix>
  </StrictMode>,
);


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import OmniErrorBoundary from './components/OmniErrorBoundary';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <OmniErrorBoundary>
      <App />
    </OmniErrorBoundary>
  </React.StrictMode>
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then((registration) => {
      void registration.update();
    }).catch(() => {
      // La app sigue funcionando aunque el modo offline no esté disponible.
    });
  });
}

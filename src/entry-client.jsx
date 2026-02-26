import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');

// If the root has SSR content, hydrate it; otherwise do a full client render
if (rootElement.innerHTML.trim().length > 0) {
  // SSR page -- hydrate the server-rendered HTML
  ReactDOM.hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // CSR page (authenticated routes) -- full client render
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Hide the initial HTML loader once React app is mounted
// This ensures smooth transition from HTML loader to React app
setTimeout(() => {
  const initialLoader = document.getElementById('initial-loader');
  if (initialLoader) {
    initialLoader.classList.add('fade-out');
    // Remove from DOM after fade animation
    setTimeout(() => {
      initialLoader.remove();
    }, 300);
  }
}, 0);

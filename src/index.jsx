import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

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

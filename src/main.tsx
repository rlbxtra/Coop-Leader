import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Handle OAuth callback inside the popup before mounting React
if (window.opener && window.location.hash.includes('access_token=') && window.location.hash.includes('state=coop_backup_flow')) {
  const params = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = params.get('access_token');
  try {
    window.opener.postMessage(
      { type: 'COOP_OAUTH_TOKEN', accessToken },
      window.location.origin
    );
  } catch (e) {
    console.error('Failed to notify parent window:', e);
  }
  window.close();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

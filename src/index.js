import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Main from './Main';
import './i18n';
import i18next from 'i18next';

i18next.on('languageChanged', (lang) => {
  document.documentElement.setAttribute('lang', lang);
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

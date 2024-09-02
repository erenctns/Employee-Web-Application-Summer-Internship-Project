import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css'; // bunu kendim elle manuel import ettim.
import i18n from "i18next";
import { initReactI18next } from 'react-i18next';
import TR_LOCALE from './locales/tr.json'
import EN_LOCALE from './locales/en.json'
import { BrowserRouter } from 'react-router-dom';



//dil desteği için ekledim
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: EN_LOCALE
      },
      tr: {
        translation: TR_LOCALE
      }
    },
    lng: "en",
    fallbackLng: ["en", 'tr'],

    interpolation: {
      escapeValue: false
    }
  });


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

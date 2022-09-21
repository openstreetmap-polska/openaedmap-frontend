import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

const isProduction = process.env.REACT_APP_ENV === 'production';

const languages = {
  en: { nativeName: 'English' },
  pl: { nativeName: 'Polski' },
  de: { nativeName: 'Deutsch' },
  es: { nativeName: 'Español' },
  ca: { nativeName: 'Català' },
  nl: { nativeName: 'Nederlands' },
  sl: { nativeName: 'Slovenščina' },
  fr: { nativeName: 'Français' },
  it: { nativeName: 'Italiano' },
  fi: { nativeName: 'Suomi' },
};
if (!isProduction) {
  languages['debug'] = { nativeName: '--debug--'}
}
const languagesIsoCodes = Object.keys(languages);

i18n
  // i18next-http-backend
  // loads translations from your server
  // https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: !isProduction,
    supportedLngs: languagesIsoCodes,
    fallbackLng: isProduction ? 'en' : 'debug',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json'
    }
  }, (err, t) => {
    if (err) return console.log('something went wrong loading', err);
    t('key');
  });

export default i18n;
export {languages, languagesIsoCodes};

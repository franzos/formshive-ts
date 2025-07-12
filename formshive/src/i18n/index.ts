import { initCommonI18n } from '@gofranz/common-components';

// Import formshive-specific translation files
import arUnique from './locales/ar-unique.json';
import deUnique from './locales/de-unique.json';
import enUnique from './locales/en-unique.json';
import esUnique from './locales/es-unique.json';
import frUnique from './locales/fr-unique.json';
import ptUnique from './locales/pt-unique.json';
import thUnique from './locales/th-unique.json';
import zhUnique from './locales/zh-unique.json';

const formshiveResources = {
  en: {
    translation: enUnique,
  },
  de: {
    translation: deUnique,
  },
  es: {
    translation: esUnique,
  },
  fr: {
    translation: frUnique,
  },
  pt: {
    translation: ptUnique,
  },
  zh: {
    translation: zhUnique,
  },
  th: {
    translation: thUnique,
  },
  ar: {
    translation: arUnique,
  },
};

const i18n = initCommonI18n(formshiveResources);

export default i18n;

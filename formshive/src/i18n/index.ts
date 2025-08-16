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

// Import docs translation files
import arDocs from './locales/ar-docs.json';
import deDocs from './locales/de-docs.json';
import enDocs from './locales/en-docs.json';
import esDocs from './locales/es-docs.json';
import frDocs from './locales/fr-docs.json';
import ptDocs from './locales/pt-docs.json';
import thDocs from './locales/th-docs.json';
import zhDocs from './locales/zh-docs.json';

// Import integrations translation files
import arIntegrations from './locales/ar-integrations.json';
import deIntegrations from './locales/de-integrations.json';
import enIntegrations from './locales/en-integrations.json';
import esIntegrations from './locales/es-integrations.json';
import frIntegrations from './locales/fr-integrations.json';
import ptIntegrations from './locales/pt-integrations.json';
import thIntegrations from './locales/th-integrations.json';
import zhIntegrations from './locales/zh-integrations.json';

const formshiveResources = {
  en: {
    translation: { ...enUnique, ...enDocs, ...enIntegrations },
  },
  de: {
    translation: { ...deUnique, ...deDocs, ...deIntegrations },
  },
  es: {
    translation: { ...esUnique, ...esDocs, ...esIntegrations },
  },
  fr: {
    translation: { ...frUnique, ...frDocs, ...frIntegrations },
  },
  pt: {
    translation: { ...ptUnique, ...ptDocs, ...ptIntegrations },
  },
  zh: {
    translation: { ...zhUnique, ...zhDocs, ...zhIntegrations },
  },
  th: {
    translation: { ...thUnique, ...thDocs, ...thIntegrations },
  },
  ar: {
    translation: { ...arUnique, ...arDocs, ...arIntegrations },
  },
};

const i18n = initCommonI18n(formshiveResources);

export default i18n;

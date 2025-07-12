import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export function SEOHead({ title, description, keywords }: SEOHeadProps) {
  const { t, i18n } = useTranslation();

  // Get current language
  const currentLang = i18n.language.split('-')[0];

  // Default SEO content using translations
  const defaultTitle = `${t('brand.name', 'Formshive')} - ${t('welcome.tagline', 'Online Form Builder')} | Create Custom Forms`;
  const defaultDescription = `${t('welcome.description', 'Create custom forms in minutes. Registration forms, application forms, surveys, contact forms and more. Sign up free!')}`;
  const defaultKeywords =
    'form builder, online forms, custom forms, registration forms, surveys, contact forms, form creator, web forms, drag and drop forms, form generator';

  // Language-specific Open Graph locale mapping
  const localeMap: Record<string, string> = {
    en: 'en_US',
    de: 'de_DE',
    fr: 'fr_FR',
    es: 'es_ES',
    pt: 'pt_BR',
    zh: 'zh_CN',
    th: 'th_TH',
    ar: 'ar_SA',
  };

  const ogLocale = localeMap[currentLang] || 'en_US';
  const fullTitle = title || defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullKeywords = keywords || defaultKeywords;

  // Base URL for social images
  const baseUrl = 'https://formshive.com';

  // For hash-based routing, canonical URL is always the base URL
  // since search engines can't index hash fragments properly
  const canonicalUrl = baseUrl;

  return (
    <Helmet>
      {/* HTML lang attribute */}
      <html lang={currentLang} />

      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />

      {/* Canonical URL - always base URL for hash routing */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={`${baseUrl}/banner.png`} />
      <meta property="og:site_name" content="Formshive" />
      <meta property="og:locale" content={ogLocale} />

      {/* Add alternate locales for SEO */}
      {Object.values(localeMap)
        .filter((locale) => locale !== ogLocale)
        .map((locale) => (
          <meta key={locale} property="og:locale:alternate" content={locale} />
        ))}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={`${baseUrl}/banner.png`} />
      <meta property="twitter:creator" content="@formshive" />

      {/* Additional App Meta Tags */}
      <meta name="application-name" content="Formshive" />
      <meta name="theme-color" content="#228be6" />

      {/* Language alternatives for SEO - using hash-based routing */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/`} />
      <link rel="alternate" hrefLang="de" href={`${baseUrl}/#/de/`} />
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}/#/fr/`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/#/es/`} />
      <link rel="alternate" hrefLang="pt" href={`${baseUrl}/#/pt/`} />
      <link rel="alternate" hrefLang="zh" href={`${baseUrl}/#/zh/`} />
      <link rel="alternate" hrefLang="th" href={`${baseUrl}/#/th/`} />
      <link rel="alternate" hrefLang="ar" href={`${baseUrl}/#/ar/`} />
      <link rel="alternate" hrefLang="x-default" href={baseUrl} />
    </Helmet>
  );
}

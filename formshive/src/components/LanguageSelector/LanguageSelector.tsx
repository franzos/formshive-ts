import { storeLanguage, useLanguageAwareRouting } from '@gofranz/common-components';
import { NativeSelect } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface LanguageOption {
  value: string;
  label: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { value: 'en', label: 'EN', flag: '🇬🇧' },
  { value: 'de', label: 'DE', flag: '🇩🇪' },
  { value: 'fr', label: 'FR', flag: '🇫🇷' },
  { value: 'es', label: 'ES', flag: '🇪🇸' },
  { value: 'pt', label: 'PT', flag: '🇵🇹' },
  { value: 'zh', label: '中文', flag: '🇨🇳' },
  { value: 'th', label: 'ไทย', flag: '🇹🇭' },
  { value: 'ar', label: 'العربية', flag: '🇸🇦' },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const { createLanguageURL } = useLanguageAwareRouting();

  // Get current language, fallback to 'en' if not in our list
  const getCurrentLang = () => {
    const lang = i18n.language;
    if (lang.startsWith('de')) return 'de';
    if (lang.startsWith('fr')) return 'fr';
    if (lang.startsWith('es')) return 'es';
    if (lang.startsWith('zh')) return 'zh';
    if (lang.startsWith('ar')) return 'ar';
    if (lang.startsWith('pt')) return 'pt';
    if (lang.startsWith('th')) return 'th';
    return 'en';
  };
  const currentLang = getCurrentLang();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    storeLanguage(newLang);

    // Remove existing language prefix from current path
    let currentPath = location.pathname;
    const langMatch = currentPath.match(/^\/([a-z]{2})(?:\/|$)/);
    if (langMatch) {
      currentPath = currentPath.replace(/^\/[a-z]{2}/, '');
    }

    // Ensure path starts with /
    if (!currentPath.startsWith('/')) {
      currentPath = '/' + currentPath;
    }

    // Navigate to current path with new language
    const newUrl = createLanguageURL(currentPath, newLang);
    window.location.replace(`#${newUrl}`);
  };

  return (
    <NativeSelect value={currentLang} onChange={handleChange} variant="unstyled">
      {languages.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.flag} {lang.label}
        </option>
      ))}
    </NativeSelect>
  );
}

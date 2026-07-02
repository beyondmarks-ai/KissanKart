import { ReactNode, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LanguageProvider, SUPPORTED_LANGUAGES, Language, DEFAULT_LANGUAGE } from '@/contexts/LanguageContext';

interface LanguageLayoutProps {
  children: ReactNode;
}

function LanguageHtmlUpdater() {
  const { lang } = useParams<{ lang: string }>();
  
  useEffect(() => {
    const currentLang = SUPPORTED_LANGUAGES.includes(lang as Language) 
      ? (lang as Language) 
      : DEFAULT_LANGUAGE;
    
    // Update html lang attribute for proper font rendering
    document.documentElement.lang = currentLang;
  }, [lang]);
  
  return null;
}

export function LanguageLayout({ children }: LanguageLayoutProps) {
  return (
    <LanguageProvider>
      <LanguageHtmlUpdater />
      {children}
    </LanguageProvider>
  );
}

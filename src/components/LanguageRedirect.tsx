import { Navigate } from 'react-router-dom';
import { DEFAULT_LANGUAGE } from '@/contexts/LanguageContext';

export function LanguageRedirect() {
  // Redirect root to default language
  return <Navigate to={`/${DEFAULT_LANGUAGE}`} replace />;
}

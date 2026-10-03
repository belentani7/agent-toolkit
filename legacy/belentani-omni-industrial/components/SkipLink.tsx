import React from 'react';
import { useI18n } from '../contexts/I18nContext';

const SkipLink: React.FC = () => {
  const { locale } = useI18n();
  const label = locale === 'en' ? 'Skip to main content' : locale === 'pt' ? 'Saltar para o conteúdo principal' : 'Saltar al contenido principal';

  return <a href="#main-content" className="skip-link">{label}</a>;
};

export default SkipLink;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import type { TranslationKey } from '../services/i18n';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, locale, locales, localeLabels, localeNames, setLocale } = useI18n();
  const location = useLocation();

  const navItems: Array<{ key: TranslationKey; path: string; icon: typeof Sparkles | null }> = [
    { key: 'nav.home', path: '/', icon: null },
    { key: 'nav.quantum', path: '/quantum', icon: Sparkles },
    { key: 'nav.omni', path: '/omni', icon: Sparkles },
    { key: 'nav.pricing', path: '/pricing', icon: null },
    { key: 'nav.about', path: '/about', icon: null },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-amber-500/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="text-2xl font-black text-amber-400 group-hover:text-amber-300 transition-colors"
            >
              ⚡
            </motion.div>
            <span className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
              BELENTANI
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    isActive(item.path)
                      ? 'text-amber-400'
                      : 'text-zinc-400 hover:text-amber-300'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {t(item.key)}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 glass border border-amber-500/30 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="locale-select" className="sr-only">{t('language.change')}</label>
              <select
                id="locale-select"
                value={locale}
                onChange={(event) => setLocale(event.target.value as typeof locale)}
                aria-label={t('language.label')}
                className="bg-zinc-950/70 border border-amber-500/20 rounded-lg px-2 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {locales.map((option) => <option key={option} value={option}>{localeLabels[option]} · {localeNames[option]}</option>)}
              </select>
            </div>
            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => logout()}
                className="hidden sm:flex items-center gap-2 px-4 py-2 glass border border-amber-500/30 hover:border-amber-500/60 rounded-lg text-amber-400 hover:text-amber-300 transition-all duration-300 text-sm font-bold"
              >
                <LogOut className="w-4 h-4" />
                {t('action.logout')}
              </motion.button>
            ) : (
              <Link
                to="/pricing"
                className="hidden sm:block px-4 py-2 glass border border-amber-500/30 hover:border-amber-500/60 rounded-lg text-amber-400 hover:text-amber-300 transition-all duration-300 text-sm font-bold"
              >
                {t('action.subscribe')}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? t('action.closeMenu') : t('action.openMenu')}
              aria-expanded={isOpen}
              className="md:hidden p-2 text-amber-400 hover:text-amber-300 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-amber-500/10 py-4 space-y-2"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                      isActive(item.path)
                        ? 'text-amber-400 glass border border-amber-500/30'
                        : 'text-zinc-400 hover:text-amber-300'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {t(item.key)}
                  </Link>
                );
              })}
              {user && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 glass border border-amber-500/30 hover:border-amber-500/60 rounded-lg text-amber-400 hover:text-amber-300 transition-all duration-300 text-sm font-bold flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t('action.logout')}
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon,
  Monitor,
  Palette,
  Globe,
  Bell,
  Shield,
  User,
  Wifi,
  Volume2,
  Battery,
  Sun,
  Moon,
  Smartphone,
  Accessibility,
  Info,
  ChevronRight,
  Search
} from 'lucide-react'
import { WithWindowIdProps } from '../Window'

interface SettingItem {
  id: string
  icon: React.ReactNode
  title: string
  titlePt: string
  description: string
  descriptionPt: string
  color: string
}

const settingsItems: SettingItem[] = [
  {
    id: 'system',
    icon: <Monitor size={24} />,
    title: 'Sistema',
    titlePt: 'Sistema',
    description: 'Pantalla, sonido, notificaciones, energía',
    descriptionPt: 'Tela, som, notificações, energia',
    color: 'bg-blue-500'
  },
  {
    id: 'personalization',
    icon: <Palette size={24} />,
    title: 'Personalización',
    titlePt: 'Personalização',
    description: 'Fondo de pantalla, colores, temas',
    descriptionPt: 'Papel de parede, cores, temas',
    color: 'bg-purple-500'
  },
  {
    id: 'network',
    icon: <Wifi size={24} />,
    title: 'Red e Internet',
    titlePt: 'Rede e Internet',
    description: 'Wi-Fi, Ethernet, VPN',
    descriptionPt: 'Wi-Fi, Ethernet, VPN',
    color: 'bg-green-500'
  },
  {
    id: 'language',
    icon: <Globe size={24} />,
    title: 'Idioma y región',
    titlePt: 'Idioma e região',
    description: 'Idioma, teclado, fecha y hora',
    descriptionPt: 'Idioma, teclado, data e hora',
    color: 'bg-orange-500'
  },
  {
    id: 'accessibility',
    icon: <Accessibility size={24} />,
    title: 'Accesibilidad',
    titlePt: 'Acessibilidade',
    description: 'Visión, audición, interacción',
    descriptionPt: 'Visão, audição, interação',
    color: 'bg-teal-500'
  },
  {
    id: 'privacy',
    icon: <Shield size={24} />,
    title: 'Privacidad y seguridad',
    titlePt: 'Privacidade e segurança',
    description: 'Permisos, historial, seguridad',
    descriptionPt: 'Permissões, histórico, segurança',
    color: 'bg-red-500'
  },
  {
    id: 'accounts',
    icon: <User size={24} />,
    title: 'Cuentas',
    titlePt: 'Contas',
    description: 'Tu cuenta, opciones de inicio',
    descriptionPt: 'Sua conta, opções de início',
    color: 'bg-indigo-500'
  },
  {
    id: 'apps',
    icon: <Smartphone size={24} />,
    title: 'Aplicaciones',
    titlePt: 'Aplicativos',
    description: 'Aplicaciones instaladas, predeterminadas',
    descriptionPt: 'Aplicativos instalados, padrão',
    color: 'bg-pink-500'
  }
]

export function Settings({ windowId }: WithWindowIdProps) {
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null)
  const [language, setLanguage] = useState<'es' | 'pt'>('es')
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  
  const t = language === 'es' ? {
    title: 'Configuración',
    subtitle: 'Personaliza tu experiencia',
    search: 'Buscar configuración',
    about: 'Acerca de',
    version: 'Versión 1.0.0',
    platform: 'Manos Abiertas Ecosystem',
    system: 'Sistema',
    display: 'Pantalla',
    sound: 'Sonido',
    notifications: 'Notificaciones',
    power: 'Energía',
    storage: 'Almacenamiento',
    brightness: 'Brillo',
    volume: 'Volumen',
    nightLight: 'Luz nocturna',
    focusAssist: 'Asistencia de enfoque',
    batterySaver: 'Ahorro de batería',
    storageUsed: 'Almacenamiento usado',
    on: 'Activado',
    off: 'Desactivado'
  } : {
    title: 'Configurações',
    subtitle: 'Personalize sua experiência',
    search: 'Pesquisar configuração',
    about: 'Sobre',
    version: 'Versão 1.0.0',
    platform: 'Manos Abiertas Ecosystem',
    system: 'Sistema',
    display: 'Tela',
    sound: 'Som',
    notifications: 'Notificações',
    power: 'Energia',
    storage: 'Armazenamento',
    brightness: 'Brilho',
    volume: 'Volume',
    nightLight: 'Luz noturna',
    focusAssist: 'Assistência de foco',
    batterySaver: 'Economia de bateria',
    storageUsed: 'Armazenamento usado',
    on: 'Ativado',
    off: 'Desativado'
  }

  return (
    <div className="h-full flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <SettingsIcon size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-800">{t.title}</h1>
              <p className="text-xs text-gray-500">{t.subtitle}</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t.search}
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-gray-100 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-400"
            />
          </div>
        </div>
        
        {/* Settings List */}
        <div className="flex-1 overflow-y-auto p-2">
          {settingsItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 2 }}
              onClick={() => setSelectedSetting(item.id)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg transition-colors mb-0.5 text-left
                ${selectedSetting === item.id 
                  ? 'bg-blue-50 border border-blue-100' 
                  : 'hover:bg-gray-50'}
              `}
            >
              <div className={`w-9 h-9 ${item.color} rounded-lg flex items-center justify-center text-white`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800">
                  {language === 'es' ? item.title : item.titlePt}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {language === 'es' ? item.description : item.descriptionPt}
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </motion.button>
          ))}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => setLanguage(language === 'es' ? 'pt' : 'es')}
            className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors text-center"
          >
            🌐 {language === 'es' ? 'Cambiar a Português' : 'Mudar para Espanhol'}
          </button>
          
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <Info size={14} />
            <span>{t.platform} • {t.version}</span>
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {!selectedSetting ? (
          /* Default View */
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.title}</h2>
            
            {/* Quick Settings Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Display Quick Setting */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Monitor size={18} className="text-blue-500" />
                  {t.display}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-600 mb-2 block">{t.brightness}</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      defaultValue="75"
                      className="w-full accent-blue-500" 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{t.nightLight}</span>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        darkMode ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    >
                      <motion.div
                        animate={{ x: darkMode ? 20 : 2 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                      />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Sound Quick Setting */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Volume2 size={18} className="text-green-500" />
                  {t.sound}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-600 mb-2 block">{t.volume}</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      defaultValue="80"
                      className="w-full accent-green-500" 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{t.notifications}</span>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        notifications ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <motion.div
                        animate={{ x: notifications ? 20 : 2 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                      />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Power & Storage */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Battery size={18} className="text-yellow-500" />
                  {t.power}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{t.batterySaver}</span>
                    <span className="text-xs text-green-600 font-medium">{t.off}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Batería</span>
                    <span className="text-sm font-medium text-green-600">85%</span>
                  </div>
                  
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" />
                  </div>
                </div>
              </div>
              
              {/* System Info */}
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Info size={18} className="text-purple-500" />
                  {t.system}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{t.storageUsed}</span>
                    <span className="text-sm font-medium text-gray-800">128 GB / 256 GB</span>
                  </div>
                  
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-[50%] h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full" />
                  </div>
                  
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                      <span className="text-xs text-gray-600">Sistema (45 GB)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-sm" />
                      <span className="text-xs text-gray-600">Aplicaciones (38 GB)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-pink-500 rounded-sm" />
                      <span className="text-xs text-gray-600">Documentos (25 GB)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-300 rounded-sm" />
                      <span className="text-xs text-gray-600">Libre (128 GB)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* About Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                  <SettingsIcon size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{t.about} Manos Abiertas</h3>
                  <p className="text-white/80 text-sm mb-3">
                    {language === 'es' 
                      ? 'Plataforma educativa para comunidades inmigrantes en España' 
                      : 'Plataforma educacional para comunidades de imigrantes na Espanha'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <span>{t.version}</span>
                    <span>•</span>
                    <span>© 2024 Manos Abiertas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Selected Setting Detail */
          <SettingDetail 
            settingId={selectedSetting} 
            language={language}
            onBack={() => setSelectedSetting(null)}
            t={t}
          />
        )}
      </div>
    </div>
  )
}

function SettingDetail({ 
  settingId, 
  language, 
  onBack,
  t 
}: { 
  settingId: string
  language: 'es' | 'pt'
  onBack: () => void
  t: Record<string, string>
}) {
  const setting = settingsItems.find(s => s.id === settingId)!
  
  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
      >
        ← {language === 'es' ? 'Volver' : 'Voltar'}
      </button>
      
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 ${setting.color} rounded-xl flex items-center justify-center text-white`}>
          {setting.icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {language === 'es' ? setting.title : setting.titlePt}
          </h2>
          <p className="text-sm text-gray-500">
            {language === 'es' ? setting.description : setting.descriptionPt}
          </p>
        </div>
      </div>
      
      {/* Placeholder content for each setting */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="text-center py-12 text-gray-400">
          <setting.icon size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">
            {language === 'es' ? 'Configuración en desarrollo' : 'Configuração em desenvolvimento'}
          </p>
          <p className="text-sm mt-2">
            {language === 'es' 
              ? 'Esta sección estará disponible próximamente' 
              : 'Esta estará disponível em breve'}
          </p>
        </div>
      </div>
    </div>
  )
}

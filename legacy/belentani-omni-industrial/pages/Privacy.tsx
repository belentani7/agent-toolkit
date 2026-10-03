import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Users, Zap } from 'lucide-react';

const Privacy: React.FC = () => {
  const sections = [
    {
      icon: Shield,
      title: 'Protección de Datos (RGPD)',
      content: `BELENTANI cumple con el Reglamento General de Protección de Datos (RGPD) de la Unión Europea. Recopilamos solo los datos necesarios para proporcionar nuestros servicios: nombre, correo electrónico y datos de uso.

Tus derechos bajo RGPD:
• Derecho de acceso a tus datos
• Derecho a la rectificación
• Derecho al olvido (supresión)
• Derecho a la portabilidad de datos
• Derecho a oponerme al procesamiento

Puedes ejercer estos derechos contactando a privacy@belentani.com.`,
    },
    {
      icon: Lock,
      title: 'Seguridad y Cifrado',
      content: `Todos los datos se transmiten mediante HTTPS/TLS. Las contraseñas se almacenan con hash seguro. No almacenamos información de tarjetas de crédito; los pagos se procesan a través de proveedores certificados PCI-DSS.

Implementamos:
• Cifrado end-to-end para datos sensibles
• Autenticación de dos factores (2FA)
• Auditorías de seguridad regulares
• Monitoreo de vulnerabilidades 24/7`,
    },
    {
      icon: Eye,
      title: 'Cookies y Rastreo',
      content: `Utilizamos cookies solo esenciales por defecto. Las cookies de marketing y analítica requieren consentimiento explícito (opt-in).

Tipos de cookies:
• Esenciales: Autenticación y seguridad
• Analítica: Google Analytics (solo si aceptas)
• Marketing: Publicidad personalizada (solo si aceptas)

Puedes gestionar tus preferencias en cualquier momento desde la configuración.`,
    },
    {
      icon: Users,
      title: 'Compartir Datos',
      content: `No vendemos tus datos a terceros. Solo compartimos información cuando es legalmente requerido o con tu consentimiento explícito.

Terceros autorizados:
• Google Firebase (almacenamiento)
• Google Gemini API (generación de playlists)
• Stripe (pagos)
• Cloudflare (CDN)

Todos los proveedores cumplen con RGPD y tienen Acuerdos de Procesamiento de Datos (DPA).`,
    },
    {
      icon: Zap,
      title: 'Retención de Datos',
      content: `Retenemos tus datos mientras mantengas tu cuenta activa. Puedes solicitar la eliminación en cualquier momento.

Política de retención:
• Datos de usuario: Mientras la cuenta esté activa
• Playlists generadas: Hasta 2 años
• Logs de acceso: 90 días
• Datos de pago: 7 años (requerido por ley)

Después de la eliminación, los datos se purgan permanentemente en 30 días.`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-zinc-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white">
            Política de Privacidad
          </h1>
          <p className="text-sm text-zinc-400 font-mono">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
          <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
            En BELENTANI, tu privacidad es sagrada. Esta política explica cómo recopilamos, usamos y protegemos tus datos.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass border border-amber-500/10 rounded-2xl p-6 hover:border-amber-500/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  <Icon className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-white mb-3">{section.title}</h2>
                    <p className="text-sm text-zinc-400 whitespace-pre-line leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass border border-amber-500/20 rounded-2xl p-8 text-center space-y-4 bg-gradient-to-br from-amber-500/5 to-transparent"
        >
          <h3 className="text-xl font-bold text-white">¿Preguntas sobre tu Privacidad?</h3>
          <p className="text-sm text-zinc-400">
            Si tienes dudas o deseas ejercer tus derechos RGPD, contacta a nuestro Delegado de Protección de Datos:
          </p>
          <div className="space-y-2">
            <p className="font-mono text-amber-400">privacy@belentani.com</p>
            <p className="text-xs text-zinc-500">
              Responderemos dentro de 30 días hábiles conforme a la ley.
            </p>
          </div>
        </motion.div>

        {/* Legal Notice */}
        <div className="text-xs text-zinc-600 text-center space-y-2 pt-8 border-t border-zinc-900">
          <p>
            BELENTANI está registrado en la UE y cumple con RGPD, LSSI-CE, DSA, NIS2 y PSD2.
          </p>
          <p>
            Para términos y condiciones, consulta nuestros{' '}
            <a href="/terms" className="text-amber-400 hover:text-amber-300">
              Términos de Servicio
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

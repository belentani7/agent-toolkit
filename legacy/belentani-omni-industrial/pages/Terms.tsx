import React from 'react';
import { motion } from 'framer-motion';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0c0c0e] text-zinc-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white">
            Términos de Servicio
          </h1>
          <p className="text-sm text-zinc-400 font-mono">
            Última actualización: {new Date().toLocaleDateString('es-ES')}
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 text-sm text-zinc-400 leading-relaxed"
        >
          <section className="glass border border-amber-500/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">1. Aceptación de Términos</h2>
            <p>
              Al acceder y usar BELENTANI, aceptas estar vinculado por estos Términos de Servicio. Si no estás de acuerdo con alguna parte, no debes usar el servicio.
            </p>
          </section>

          <section className="glass border border-amber-500/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">2. Licencia de Uso</h2>
            <p>
              Te otorgamos una licencia limitada, no exclusiva y revocable para usar BELENTANI para fines personales y no comerciales. No puedes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-500">
              <li>Reproducir, distribuir o transmitir contenido sin autorización</li>
              <li>Usar bots, scrapers o herramientas de automatización</li>
              <li>Intentar acceder a datos no autorizados</li>
              <li>Usar el servicio para actividades ilegales</li>
              <li>Interferir con la operación del servicio</li>
            </ul>
          </section>

          <section className="glass border border-amber-500/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">3. Contenido Generado</h2>
            <p>
              Las playlists generadas por BELENTANI son creadas usando inteligencia artificial. Retenemos el derecho de usar datos agregados y anónimos para mejorar nuestros servicios. Los derechos de autor de la música pertenecen a los artistas originales.
            </p>
          </section>

          <section className="glass border border-amber-500/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">4. Cuentas de Usuario</h2>
            <p>
              Eres responsable de mantener la confidencialidad de tu contraseña. No compartirás tu cuenta con otros usuarios. BELENTANI se reserva el derecho de suspender cuentas que violen estos términos.
            </p>
          </section>

          <section className="glass border border-amber-500/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">5. Pagos y Suscripciones</h2>
            <p>
              Los pagos se procesan de forma segura a través de Stripe. Los planes de suscripción se renuevan automáticamente. Puedes cancelar en cualquier momento desde tu perfil. No hay reembolsos por períodos parciales.
            </p>
            <p className="text-xs text-zinc-500">
              Precios sujetos a cambios con 30 días de notificación previa.
            </p>
          </section>

          <section className="glass border border-amber-500/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">6. Limitación de Responsabilidad</h2>
            <p>
              BELENTANI se proporciona "tal cual". No garantizamos que el servicio sea ininterrumpido o libre de errores. No somos responsables por:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-500">
              <li>Pérdida de datos o contenido</li>
              <li>Daños indirectos o consecuentes</li>
              <li>Interrupciones del servicio</li>
              <li>Cambios en la disponibilidad de características</li>
            </ul>
          </section>

          <section className="glass border border-amber-500/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">7. Cambios en el Servicio</h2>
            <p>
              Nos reservamos el derecho de modificar, suspender o descontinuar BELENTANI en cualquier momento. Notificaremos cambios significativos con anticipación.
            </p>
          </section>

          <section className="glass border border-amber-500/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">8. Ley Aplicable</h2>
            <p>
              Estos términos se rigen por las leyes de la Unión Europea. Cualquier disputa se resolverá en los tribunales competentes de la UE.
            </p>
          </section>

          <section className="glass border border-amber-500/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">9. Contacto</h2>
            <p>
              Para preguntas sobre estos términos, contacta a: <span className="text-amber-400 font-mono">legal@belentani.com</span>
            </p>
          </section>
        </motion.div>

        {/* Acceptance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass border border-amber-500/20 rounded-2xl p-8 text-center bg-gradient-to-br from-amber-500/5 to-transparent"
        >
          <p className="text-xs text-zinc-500">
            Al usar BELENTANI, confirmas que has leído, entendido y aceptas estos Términos de Servicio.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;

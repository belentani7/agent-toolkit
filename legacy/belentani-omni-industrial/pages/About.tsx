import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 py-8 max-w-2xl"
    >
      <h1 className="text-3xl font-black text-white">Acerca de BELENTANI</h1>
      <div className="glass border border-amber-500/20 rounded-2xl p-6 space-y-4 text-zinc-400">
        <p>BELENTANI es una plataforma revolucionaria de generación de playlists con IA.</p>
        <p>Versión: 2.0 Evolved</p>
      </div>
    </motion.div>
  );
};

export default About;

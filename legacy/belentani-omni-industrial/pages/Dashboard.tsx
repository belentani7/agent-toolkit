import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 py-8"
    >
      <h1 className="text-3xl font-black text-white">Mi Dashboard</h1>
      <div className="glass border border-amber-500/20 rounded-2xl p-6">
        <p className="text-zinc-400">Bienvenido, {user?.email}</p>
      </div>
    </motion.div>
  );
};

export default Dashboard;

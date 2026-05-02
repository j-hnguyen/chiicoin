import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string;
  sublabel: string;
  color: string;
  delay?: number;
}

export default function StatCard({ label, value, sublabel, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white/70 backdrop-blur-sm rounded-[var(--radius-kawaii)] p-4 border border-pink-100 shadow-sm"
    >
      <div className="text-xs text-cocoa/50 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-bold font-display" style={{ color }}>{value}</div>
      <div className="text-xs text-cocoa/40 mt-1">{sublabel}</div>
    </motion.div>
  );
}

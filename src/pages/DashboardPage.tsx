import { useBudgetStore } from '@/store/useBudgetStore';
import { MONTH_NAMES } from '@/types';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

export default function DashboardPage() {
  const { selectedYear, setSelectedYear, setSelectedMonth, setSelectedView, transactions } = useBudgetStore();

  const handleMonthClick = (month: number) => {
    setSelectedMonth(month);
    setSelectedView('ledger');
  };

  const monthsWithData = new Set(
    transactions
      .filter((t) => t.year === selectedYear)
      .map((t) => t.month)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-pink-light"
    >
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-5xl font-bold text-cocoa mb-2">My Budget</h1>
          <p className="text-sm text-cocoa/40 uppercase tracking-widest">Monthly Financial Tracker</p>
          <div className="w-8 h-0.5 bg-soft-pink mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedYear(selectedYear - 1)}
            className="w-8 h-8 rounded-full bg-white/60 border border-pink-100 flex items-center justify-center hover:bg-white transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-sm text-cocoa/50 font-semibold">{selectedYear}</span>
          <button
            onClick={() => setSelectedYear(selectedYear + 1)}
            className="w-8 h-8 rounded-full bg-white/60 border border-pink-100 flex items-center justify-center hover:bg-white transition-colors"
            style={{ transform: 'scaleX(-1)' }}
          >
            <ChevronLeft size={14} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {MONTH_NAMES.map((name, i) => {
            const hasData = monthsWithData.has(i);
            const isCurrentMonth = i === new Date().getMonth() && selectedYear === new Date().getFullYear();

            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMonthClick(i)}
                className={`rounded-[var(--radius-kawaii)] p-4 text-left border transition-all ${
                  isCurrentMonth
                    ? 'bg-blue-light/40 border-pink-200 shadow-sm'
                    : hasData
                    ? 'bg-white/80 border-pink-100 shadow-sm'
                    : 'bg-white/50 border-pink-50'
                }`}
              >
                <div className={`font-display font-semibold ${isCurrentMonth ? 'text-soft-pink' : 'text-cocoa'}`}>
                  {name}
                </div>
                <div className="text-xs text-cocoa/30 mt-1">{selectedYear}</div>
                <div className="text-xs text-cocoa/20 mt-2">
                  {hasData ? 'has entries' : '-- empty --'}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

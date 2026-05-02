import { useState } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import { MONTH_NAMES, DAY_NAMES, CATEGORY_COLORS } from '@/types';
import type { Transaction } from '@/types';
import StatCard from '@/components/StatCard';
import BuntingBanner from '@/components/BuntingBanner';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { getDaysInMonth, getDay, startOfMonth } from 'date-fns';

interface StickerPopupProps {
  txn: Transaction;
  onClose: () => void;
}

function StickerPopup({ txn, onClose }: StickerPopupProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: 'spring', damping: 18 }}
          className="bg-white rounded-[var(--radius-sticker)] p-5 w-72 shadow-xl border-2 border-pink-100 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-cocoa/30 hover:text-cocoa transition-colors"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: CATEGORY_COLORS[txn.type] }}
            />
            <span className="text-xs text-cocoa/40 uppercase tracking-wider capitalize">
              {txn.type}
            </span>
          </div>
          <div className="font-display font-bold text-lg text-cocoa mb-1">
            {txn.description}
          </div>
          <div className="text-xs text-cocoa/30 mb-3">
            {new Date(txn.date + 'T00:00:00').toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-yellow-light/50 rounded-xl p-2 text-center">
              <div className="text-[10px] text-cocoa/40 uppercase tracking-wider">Budgeted</div>
              <div className="text-sm font-semibold text-cocoa/70">${txn.budgeted.toFixed(2)}</div>
            </div>
            <div className="bg-pink-light/50 rounded-xl p-2 text-center">
              <div className="text-[10px] text-cocoa/40 uppercase tracking-wider">Actual</div>
              <div className="text-sm font-semibold" style={{ color: CATEGORY_COLORS[txn.type] }}>
                ${txn.actual.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="mt-3 text-center">
            <span
              className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full ${
                txn.status === 'paid'
                  ? 'bg-green-light text-green-mid'
                  : 'bg-yellow-light text-yellow-700'
              }`}
            >
              {txn.status === 'paid' ? '✓ Paid' : '◷ Pending'}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function CalendarPage() {
  const {
    selectedYear,
    selectedMonth,
    selectedDate,
    setSelectedView,
    setSelectedDate,
    transactions,
    getTotalIncome,
    getTotalBudgeted,
    getTotalActualSpend,
    getRemaining,
    getTotalSavings,
  } = useBudgetStore();

  const [popupTxn, setPopupTxn] = useState<Transaction | null>(null);

  const monthTxns = transactions.filter(
    (t) => t.month === selectedMonth && t.year === selectedYear
  );

  const monthStart = new Date(selectedYear, selectedMonth, 1);
  const daysInMonth = getDaysInMonth(monthStart);
  const firstDayOfWeek = getDay(startOfMonth(monthStart));

  const dayTxns = selectedDate
    ? transactions.filter((t) => t.date === selectedDate)
    : [];

  const getTxnsForDay = (day: number) => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return transactions.filter((t) => t.date === dateStr);
  };

  const monthAssets: Record<number, { main: string; banner?: string }> = {
    4: { main: '/chiikawa-may-2.png', banner: '/chiikawa-banner.png' },
  };

  const currentAssets = monthAssets[selectedMonth];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-pink-light"
    >
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSelectedView('dashboard')}
            className="text-sm text-cocoa/40 hover:text-cocoa transition-colors flex items-center gap-1"
          >
            <ChevronLeft size={14} />
            All months
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedView('ledger')}
              className="px-4 py-2 rounded-xl text-sm text-cocoa/40 hover:text-cocoa transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => setSelectedView('calendar')}
              className="px-4 py-2 rounded-xl text-sm bg-soft-pink text-white font-medium"
            >
              Calendar
            </button>
          </div>
        </div>

        <div className="flex items-baseline gap-3 mb-4">
          <h1 className="font-display text-4xl font-bold text-cocoa">
            {MONTH_NAMES[selectedMonth]}
          </h1>
          <span className="text-sm text-cocoa/40">{selectedYear}</span>
        </div>

        <div className="grid grid-cols-6 gap-3 mb-6">
          <StatCard label="Total Income" value={`$${getTotalIncome().toFixed(2)}`} sublabel="this month" color="#7CB98B" delay={0} />
          <StatCard label="Budgeted" value={`$${getTotalBudgeted().toFixed(2)}`} sublabel="planned spend" color="#F9C8B8" delay={0.05} />
          <StatCard label="Actual Spend" value={`$${getTotalActualSpend().toFixed(2)}`} sublabel="logged expenses" color="#ECBDC3" delay={0.1} />
          <StatCard label="Remaining" value={`$${getRemaining().toFixed(2)}`} sublabel="income - actual" color="#A8D8EA" delay={0.15} />
          <StatCard label="Start Savings" value={`$${getTotalSavings().toFixed(2)}`} sublabel="beginning balance" color="#A8D8EA" delay={0.2} />
          <StatCard label="Savings Goal" value={`$${monthTxns.filter((t) => t.type === 'savings').reduce((s, t) => s + t.budgeted, 0).toFixed(2)}`} sublabel="budgeted savings" color="#F9C8B8" delay={0.25} />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-12">
        <div className="grid grid-cols-[1fr_300px] gap-6">
          <div>
            {currentAssets?.banner && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2"
              >
                <img
                  src={currentAssets.banner}
                  alt={`${MONTH_NAMES[selectedMonth]} banner`}
                  className="w-full rounded-[var(--radius-kawaii)]"
                />
              </motion.div>
            )}

            <BuntingBanner variant="mixed" />

            {currentAssets?.main && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="flex justify-center my-4 float-anim"
              >
                <img
                  src={currentAssets.main}
                  alt={`${MONTH_NAMES[selectedMonth]} character`}
                  className="h-32 object-contain"
                />
              </motion.div>
            )}

            <div className="flex items-center justify-between px-4 mt-4 mb-2">
              <span className="text-xs uppercase tracking-widest text-cocoa/40 font-semibold">
                Spending Calendar
              </span>
            </div>

            <div className="stripe-bg rounded-[var(--radius-kawaii)] overflow-hidden border border-pink-100">
              <div className="grid grid-cols-7 gap-0">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="text-center text-xs text-cocoa/30 py-3 font-semibold uppercase tracking-wider">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[90px] border-t border-pink-50/50" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const txns = getTxnsForDay(day);
                  const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isSelected = selectedDate === dateStr;

                  return (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.01 }}
                      onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                      className={`min-h-[90px] border-t border-l border-pink-50/50 p-2 cursor-pointer transition-all ${
                        isSelected ? 'bg-white/60' : 'hover:bg-white/30'
                      }`}
                    >
                      <div className={`text-sm font-semibold mb-1 ${isSelected ? 'text-soft-pink' : 'text-cocoa/40'}`}>
                        {day}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <AnimatePresence>
                          {txns.map((t) => (
                            <motion.div
                              key={t.id}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: 'spring', damping: 15 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setPopupTxn(t);
                              }}
                              className="w-4 h-4 rounded-full border border-white shadow-sm cursor-pointer hover:scale-125 transition-transform"
                              style={{ backgroundColor: CATEGORY_COLORS[t.type] }}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 px-4">
              <span className="text-xs text-cocoa/30">Stickers:</span>
              {(Object.entries(CATEGORY_COLORS) as [keyof typeof CATEGORY_COLORS, string][]).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs text-cocoa/40 capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white/60 backdrop-blur-sm rounded-[var(--radius-kawaii)] border border-pink-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs uppercase tracking-widest text-cocoa/40 font-semibold">
                  Transaction Log
                </h3>
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-soft-pink text-white text-xs hover:bg-pink-mid transition-colors"
                >
                  <Plus size={12} />
                  Add
                </button>
              </div>

              {selectedDate ? (
                <div>
                  <div className="text-sm font-semibold text-cocoa mb-3">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>

                  {dayTxns.length === 0 ? (
                    <div className="text-center py-8 text-xs text-cocoa/30">
                      No transactions yet
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                      {dayTxns.map((t) => (
                        <motion.div
                          key={t.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white/70 rounded-xl p-3 border border-pink-50 cursor-pointer hover:bg-white/90 transition-colors"
                          onClick={() => setPopupTxn(t)}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: CATEGORY_COLORS[t.type] }}
                            />
                            <span className="text-sm font-medium">{t.description}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-cocoa/40 capitalize">{t.type}</span>
                            <span className="text-sm font-semibold" style={{ color: CATEGORY_COLORS[t.type] }}>
                              ${t.actual.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-xs text-cocoa/30 mt-1">
                            Budget: ${t.budgeted.toFixed(2)}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-cocoa/30">
                  Click a day to see transactions
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {popupTxn && (
        <StickerPopup txn={popupTxn} onClose={() => setPopupTxn(null)} />
      )}
    </motion.div>
  );
}

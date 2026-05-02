import { motion, AnimatePresence } from 'framer-motion';
import type { Transaction, TransactionType } from '@/types';
import { CATEGORY_COLORS } from '@/types';
import { CheckCircle2, Clock, Trash2 } from 'lucide-react';
import AddRowModal from '@/components/AddRowModal';

interface SectionTableProps {
  title: string;
  txnType: TransactionType;
  transactions: Transaction[];
  onAdd: (data: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
  dotColor?: string;
}

export default function SectionTable({
  title,
  txnType,
  transactions,
  onAdd,
  onDelete,
  dotColor,
}: SectionTableProps) {
  const color = dotColor || CATEGORY_COLORS[txnType];
  const totalBudgeted = transactions.reduce((s, t) => s + t.budgeted, 0);
  const totalActual = transactions.reduce((s, t) => s + t.actual, 0);

  const handleAdd = (data: Omit<Transaction, 'id'>) => {
    onAdd({ ...data, type: txnType, month: data.month, year: data.year });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h3 className="text-xs uppercase tracking-widest text-cocoa/50 font-semibold">
          {title}
        </h3>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-[var(--radius-kawaii)] border border-pink-100 overflow-hidden">
        <div className="grid grid-cols-6 gap-2 px-4 py-2 bg-pink-light/30 text-xs text-cocoa/40 uppercase tracking-wider border-b border-pink-100">
          <div>Description / Source</div>
          <div>Date</div>
          <div>Budgeted</div>
          <div>Actual Spent</div>
          <div>Status</div>
          <div></div>
        </div>

        <AnimatePresence mode="popLayout">
          {transactions.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: i * 0.05, type: 'spring', damping: 20 }}
              className="grid grid-cols-6 gap-2 px-4 py-3 border-b border-pink-50 items-center hover:bg-pink-light/20 transition-colors"
            >
              <div className="text-sm font-medium truncate">{t.description}</div>
              <div className="text-sm text-cocoa/60">{formatDate(t.date)}</div>
              <div className="text-sm text-cocoa/70">${t.budgeted.toFixed(2)}</div>
              <div className="text-sm font-semibold" style={{ color: color }}>
                ${t.actual.toFixed(2)}
              </div>
              <div>
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                    t.status === 'paid'
                      ? 'bg-green-light text-green-mid'
                      : 'bg-yellow-light text-yellow-700'
                  }`}
                >
                  {t.status === 'paid' ? (
                    <CheckCircle2 size={10} />
                  ) : (
                    <Clock size={10} />
                  )}
                  {t.status === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
              <div className="text-right">
                <button
                  onClick={() => onDelete(t.id)}
                  className="text-cocoa/20 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="grid grid-cols-6 gap-2 px-4 py-3 bg-pink-light/20 font-semibold text-sm border-t border-pink-100">
          <div>Total</div>
          <div></div>
          <div>${totalBudgeted.toFixed(2)}</div>
          <div style={{ color: color }}>${totalActual.toFixed(2)}</div>
          <div></div>
          <div></div>
        </div>
      </div>

      <AddRowModal txnType={txnType} month={transactions[0]?.month || 0} year={transactions[0]?.year || 2026} onAdd={handleAdd} />
    </motion.div>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '--';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
}

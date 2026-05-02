import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, CheckCircle2, Clock } from 'lucide-react';
import type { Transaction, TransactionType } from '@/types';

interface AddRowModalProps {
  txnType: TransactionType;
  month: number;
  year: number;
  onAdd: (data: Omit<Transaction, 'id'>) => void;
}

export default function AddRowModal({ txnType, month, year, onAdd }: AddRowModalProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    description: '',
    date: '',
    budgeted: 0,
    actual: 0,
    status: 'pending' as 'paid' | 'pending',
  });

  const handleSubmit = () => {
    if (!form.description.trim()) return;
    onAdd({
      ...form,
      type: txnType,
      month,
      year,
    });
    setForm({
      description: '',
      date: '',
      budgeted: 0,
      actual: 0,
      status: 'pending',
    });
    setOpen(false);
  };

  const typeLabels: Record<TransactionType, string> = {
    income: 'Income',
    bill: 'Bill',
    expense: 'Expense',
    savings: 'Savings Goal',
    investment: 'Investment',
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-cocoa/40 hover:text-cocoa/70 transition-colors flex items-center gap-1 mt-2"
      >
        <Plus size={14} />
        Add {typeLabels[txnType]}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-[var(--radius-sticker)] p-6 w-full max-w-md shadow-xl border-2 border-pink-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg text-cocoa">Add {typeLabels[txnType]}</h3>
                <button onClick={() => setOpen(false)} className="text-cocoa/40 hover:text-cocoa">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-cocoa/50 uppercase tracking-wider">Description</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-pink-100 bg-pink-light/30 focus:outline-none focus:ring-2 focus:ring-soft-pink/50 text-sm"
                    placeholder="e.g., Monthly Salary"
                  />
                </div>

                <div>
                  <label className="text-xs text-cocoa/50 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-pink-100 bg-pink-light/30 focus:outline-none focus:ring-2 focus:ring-soft-pink/50 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-cocoa/50 uppercase tracking-wider">Budgeted</label>
                    <input
                      type="number"
                      value={form.budgeted || ''}
                      onChange={(e) => setForm({ ...form, budgeted: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-pink-100 bg-pink-light/30 focus:outline-none focus:ring-2 focus:ring-soft-pink/50 text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cocoa/50 uppercase tracking-wider">Actual</label>
                    <input
                      type="number"
                      value={form.actual || ''}
                      onChange={(e) => setForm({ ...form, actual: Number(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-pink-100 bg-pink-light/30 focus:outline-none focus:ring-2 focus:ring-soft-pink/50 text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-cocoa/50 uppercase tracking-wider">Status</label>
                  <div className="flex gap-3 mt-1">
                    <button
                      onClick={() => setForm({ ...form, status: 'pending' })}
                      className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm border transition-all ${
                        form.status === 'pending'
                          ? 'bg-yellow-light border-yellow-mid text-cocoa'
                          : 'bg-white/50 border-pink-100 text-cocoa/40'
                      }`}
                    >
                      <Clock size={14} />
                      Pending
                    </button>
                    <button
                      onClick={() => setForm({ ...form, status: 'paid' })}
                      className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm border transition-all ${
                        form.status === 'paid'
                          ? 'bg-green-light border-green-mid text-cocoa'
                          : 'bg-white/50 border-pink-100 text-cocoa/40'
                      }`}
                    >
                      <CheckCircle2 size={14} />
                      Paid
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm text-cocoa/50 hover:text-cocoa transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-xl text-sm bg-soft-pink text-white hover:bg-pink-mid transition-colors shadow-sm"
                >
                  Add Entry
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

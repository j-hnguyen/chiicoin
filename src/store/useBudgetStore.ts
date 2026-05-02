import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction } from '@/types';

interface BudgetStore {
  selectedYear: number;
  selectedMonth: number;
  selectedView: 'dashboard' | 'ledger' | 'calendar';
  transactions: Transaction[];
  selectedDate: string | null;

  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
  setSelectedView: (view: 'dashboard' | 'ledger' | 'calendar') => void;
  setSelectedDate: (date: string | null) => void;

  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  getMonthTransactions: () => Transaction[];
  getDayTransactions: (dateStr: string) => Transaction[];
  getTotalIncome: () => number;
  getTotalBudgeted: () => number;
  getTotalActualSpend: () => number;
  getRemaining: () => number;
  getTotalSavings: () => number;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      selectedYear: 2026,
      selectedMonth: 4,
      selectedView: 'dashboard',
      transactions: [],
      selectedDate: null,

      setSelectedYear: (year) => set({ selectedYear: year }),
      setSelectedMonth: (month) => set({ selectedMonth: month }),
      setSelectedView: (view) => set({ selectedView: view }),
      setSelectedDate: (date) => set({ selectedDate: date }),

      addTransaction: (t) =>
        set((s) => ({
          transactions: [
            ...s.transactions,
            { ...t, id: crypto.randomUUID() },
          ],
        })),

      updateTransaction: (id, updates) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      getMonthTransactions: () => {
        const { transactions, selectedMonth, selectedYear } = get();
        return transactions.filter(
          (t) => t.month === selectedMonth && t.year === selectedYear
        );
      },

      getDayTransactions: (dateStr) => {
        const { transactions } = get();
        return transactions.filter((t) => t.date === dateStr);
      },

      getTotalIncome: () => {
        const txs = get().getMonthTransactions();
        return txs
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.actual, 0);
      },

      getTotalBudgeted: () => {
        const txs = get().getMonthTransactions();
        return txs
          .filter((t) => t.type !== 'income' && t.type !== 'savings')
          .reduce((sum, t) => sum + t.budgeted, 0);
      },

      getTotalActualSpend: () => {
        const txs = get().getMonthTransactions();
        return txs
          .filter((t) => t.type !== 'income' && t.type !== 'savings')
          .reduce((sum, t) => sum + t.actual, 0);
      },

      getRemaining: () => {
        return get().getTotalIncome() - get().getTotalActualSpend();
      },

      getTotalSavings: () => {
        const txs = get().getMonthTransactions();
        return txs
          .filter((t) => t.type === 'savings')
          .reduce((sum, t) => sum + t.actual, 0);
      },
    }),
    {
      name: 'chiicoin-budget-storage',
    }
  )
);

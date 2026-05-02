import { useBudgetStore } from '@/store/useBudgetStore';
import { MONTH_NAMES, CATEGORY_COLORS } from '@/types';
import type { TransactionType } from '@/types';
import StatCard from '@/components/StatCard';
import SectionTable from '@/components/SectionTable';
import ChartSidebar from '@/components/ChartSidebar';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

export default function LedgerPage() {
  const {
    selectedYear,
    selectedMonth,
    setSelectedView,
    transactions,
    addTransaction,
    deleteTransaction,
    getTotalIncome,
    getTotalBudgeted,
    getTotalActualSpend,
    getRemaining,
    getTotalSavings,
  } = useBudgetStore();

  const monthTxns = transactions.filter(
    (t) => t.month === selectedMonth && t.year === selectedYear
  );

  const sectionTypes: { title: string; txnType: TransactionType; color: string }[] = [
    { title: 'Income', txnType: 'income', color: CATEGORY_COLORS.income },
    { title: 'Bills', txnType: 'bill', color: CATEGORY_COLORS.bill },
    { title: 'Expenses', txnType: 'expense', color: CATEGORY_COLORS.expense },
    { title: 'Savings Goals', txnType: 'savings', color: CATEGORY_COLORS.savings },
    { title: 'Investments', txnType: 'investment', color: CATEGORY_COLORS.investment },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <div className="diagonal-stripe-bg border-b border-pink-200">
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
                className="px-4 py-2 rounded-xl text-sm bg-white border-2 border-soft-pink text-soft-pink font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={() => setSelectedView('calendar')}
                className="px-4 py-2 rounded-xl text-sm text-cocoa/40 hover:text-cocoa transition-colors"
              >
                Calendar
              </button>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-4xl font-bold text-soft-pink">
              {MONTH_NAMES[selectedMonth]}
            </h1>
            <span className="text-sm text-cocoa/40">{selectedYear}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="grid grid-cols-6 gap-3 mb-6">
          <StatCard label="Total Income" value={`$${getTotalIncome().toFixed(2)}`} sublabel="this month" color="#7CB98B" delay={0} />
          <StatCard label="Budgeted" value={`$${getTotalBudgeted().toFixed(2)}`} sublabel="planned spend" color="#F9C8B8" delay={0.05} />
          <StatCard label="Actual Spend" value={`$${getTotalActualSpend().toFixed(2)}`} sublabel="logged expenses" color="#ECBDC3" delay={0.1} />
          <StatCard label="Remaining" value={`$${getRemaining().toFixed(2)}`} sublabel="income - actual" color="#A8D8EA" delay={0.15} />
          <StatCard label="Start Savings" value={`$${getTotalSavings().toFixed(2)}`} sublabel="beginning balance" color="#A8D8EA" delay={0.2} />
          <StatCard label="Savings Goal" value={`$${monthTxns.filter((t) => t.type === 'savings').reduce((s, t) => s + t.budgeted, 0).toFixed(2)}`} sublabel="budgeted savings" color="#F9C8B8" delay={0.25} />
        </div>

        <div className="grid grid-cols-[1fr_340px] gap-6">
          <div>
            {sectionTypes.map((sec) => (
              <SectionTable
                key={sec.txnType}
                title={sec.title}
                txnType={sec.txnType}
                dotColor={sec.color}
                transactions={monthTxns.filter((t) => t.type === sec.txnType)}
                onAdd={addTransaction}
                onDelete={deleteTransaction}
              />
            ))}
          </div>
          <div>
            <ChartSidebar transactions={monthTxns} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

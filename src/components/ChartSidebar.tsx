import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Transaction } from '@/types';
import { CATEGORY_COLORS } from '@/types';

interface ChartSidebarProps {
  transactions: Transaction[];
}

export default function ChartSidebar({ transactions }: ChartSidebarProps) {
  const billTotal = transactions
    .filter((t) => t.type === 'bill')
    .reduce((s, t) => s + t.budgeted, 0);
  const expenseTotal = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.budgeted, 0);
  const savingsTotal = transactions
    .filter((t) => t.type === 'savings')
    .reduce((s, t) => s + t.budgeted, 0);
  const investmentTotal = transactions
    .filter((t) => t.type === 'investment')
    .reduce((s, t) => s + t.budgeted, 0);

  const allocationData = [
    { name: 'Bills', value: billTotal, color: CATEGORY_COLORS.bill },
    { name: 'Expenses', value: expenseTotal, color: CATEGORY_COLORS.expense },
    { name: 'Savings', value: savingsTotal, color: CATEGORY_COLORS.savings },
    { name: 'Investments', value: investmentTotal, color: CATEGORY_COLORS.investment },
  ].filter((d) => d.value > 0);

  const budgetVsActualData = [
    {
      name: 'Bills',
      budgeted: transactions.filter((t) => t.type === 'bill').reduce((s, t) => s + t.budgeted, 0),
      actual: transactions.filter((t) => t.type === 'bill').reduce((s, t) => s + t.actual, 0),
    },
    {
      name: 'Expenses',
      budgeted: transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.budgeted, 0),
      actual: transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.actual, 0),
    },
    {
      name: 'Savings',
      budgeted: transactions.filter((t) => t.type === 'savings').reduce((s, t) => s + t.budgeted, 0),
      actual: transactions.filter((t) => t.type === 'savings').reduce((s, t) => s + t.actual, 0),
    },
    {
      name: 'Investments',
      budgeted: transactions.filter((t) => t.type === 'investment').reduce((s, t) => s + t.budgeted, 0),
      actual: transactions.filter((t) => t.type === 'investment').reduce((s, t) => s + t.actual, 0),
    },
  ].filter((d) => d.budgeted > 0 || d.actual > 0);

  const savingsData = [
    {
      name: 'Savings',
      goal: transactions.filter((t) => t.type === 'savings').reduce((s, t) => s + t.budgeted, 0),
      saved: transactions.filter((t) => t.type === 'savings').reduce((s, t) => s + t.actual, 0),
    },
  ];

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-[var(--radius-kawaii)] border border-pink-100 p-4 space-y-6">
      <div>
        <h4 className="text-xs uppercase tracking-widest text-cocoa/40 mb-3">Budget Allocation</h4>
        <div className="flex gap-3 flex-wrap mb-3">
          {allocationData.map((d) => (
            <div key={d.name} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-cocoa/50">{d.name}</span>
            </div>
          ))}
        </div>
        {allocationData.length > 0 ? (
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={allocationData} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e0e0" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#42272566' }} width={60} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[120px] flex items-center justify-center text-xs text-cocoa/30">No data yet</div>
        )}
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-widest text-cocoa/40 mb-3">Budget vs Actual Spend</h4>
        {budgetVsActualData.length > 0 ? (
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={budgetVsActualData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e0e0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#42272566' }} />
              <YAxis tick={{ fontSize: 9, fill: '#42272566' }} width={35} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #f0e0e0',
                  fontSize: '12px',
                  backgroundColor: '#fff',
                }}
              />
              <Bar dataKey="budgeted" fill="#F9E8C0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" fill="#ECBDC3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[140px] flex items-center justify-center text-xs text-cocoa/30">No data yet</div>
        )}
        <div className="flex gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-light" />
            <span className="text-xs text-cocoa/40">Budget</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-soft-pink" />
            <span className="text-xs text-cocoa/40">Actual</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-widest text-cocoa/40 mb-3">Savings Progress</h4>
        {savingsData[0].goal > 0 || savingsData[0].saved > 0 ? (
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={savingsData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e0e0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#42272566' }} />
              <YAxis tick={{ fontSize: 9, fill: '#42272566' }} width={35} />
              <Bar dataKey="goal" fill="#A8D8EA40" radius={[4, 4, 0, 0]} />
              <Bar dataKey="saved" fill="#A8D8EA" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[120px] flex items-center justify-center text-xs text-cocoa/30">No data yet</div>
        )}
        <div className="flex gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#A8D8EA40' }} />
            <span className="text-xs text-cocoa/40">Goal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-mid" />
            <span className="text-xs text-cocoa/40">Saved</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export type TransactionType = 'income' | 'bill' | 'expense' | 'savings' | 'investment';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  date: string;
  budgeted: number;
  actual: number;
  status: 'paid' | 'pending';
  month: number;
  year: number;
}

export interface MonthData {
  year: number;
  month: number;
  transactions: Transaction[];
}

export interface BudgetConfig {
  selectedYear: number;
  selectedMonth: number;
  selectedView: 'dashboard' | 'ledger' | 'calendar';
}

export const CATEGORY_COLORS: Record<TransactionType, string> = {
  income: '#7CB98B',
  bill: '#ECBDC3',
  expense: '#F9C8B8',
  savings: '#A8D8EA',
  investment: '#F9E8C0',
};

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

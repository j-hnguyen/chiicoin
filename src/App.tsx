import { useBudgetStore } from '@/store/useBudgetStore';
import { AnimatePresence } from 'framer-motion';
import DashboardPage from '@/pages/DashboardPage';
import LedgerPage from '@/pages/LedgerPage';
import CalendarPage from '@/pages/CalendarPage';

export default function App() {
  const { selectedView } = useBudgetStore();

  return (
    <AnimatePresence mode="wait">
      {selectedView === 'dashboard' && <DashboardPage key="dashboard" />}
      {selectedView === 'ledger' && <LedgerPage key="ledger" />}
      {selectedView === 'calendar' && <CalendarPage key="calendar" />}
    </AnimatePresence>
  );
}

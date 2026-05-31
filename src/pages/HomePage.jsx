import { useState, useMemo, useCallback } from 'react';
import Header from '../components/Header';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import NavBar from '../components/NavBar';
import InstallPrompt from '../components/InstallPrompt';
import { useRecords } from '../hooks/useData';
import { generateId } from '../utils/storage';

export default function HomePage() {
  const { records, loading, addRecord, deleteRecord } = useRecords();
  const [month, setMonth] = useState(null);

  const stats = useMemo(() => {
    const filtered = month ? records.filter((r) => r.date.startsWith(month)) : records;
    const income = filtered
      .filter((r) => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);
    const expense = filtered
      .filter((r) => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);
    return { income, expense, balance: income - expense };
  }, [records, month]);

  const handleAdd = useCallback(
    (record) => {
      const newRecord = { ...record, id: generateId() };
      addRecord(newRecord);
    },
    [addRecord],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50 flex items-center justify-center">
        <p className="text-4xl animate-bounce">🐰</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-purple-200/25 blur-3xl" />
      </div>

      {/* PWA 安装提示 */}
      <InstallPrompt />

      <div className="relative mx-auto max-w-lg px-4 py-8 pb-24">
        <Header
          income={stats.income}
          expense={stats.expense}
          balance={stats.balance}
          month={month}
          onMonthChange={setMonth}
        />

        <TransactionForm onAdd={handleAdd} />

        <TransactionList
          records={records}
          month={month}
          onDelete={deleteRecord}
        />
      </div>

      <NavBar />
    </div>
  );
}

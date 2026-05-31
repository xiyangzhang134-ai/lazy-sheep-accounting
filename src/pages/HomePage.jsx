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

      {/* ── 下载插件按钮 ── */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40">
        <a
          href="/lazy-sheep-accounting/app.apk"
          download
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-2 text-xs font-bold text-white shadow-soft-lg animate-[fadeIn_0.5s_ease-out_0.3s_both] active:scale-95 transition-transform hover:shadow-xl"
        >
          <span className="text-base">🐑</span>
          下载插件
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </a>
      </div>

      <NavBar />
    </div>
  );
}

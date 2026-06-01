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
  const [selectedDate, setSelectedDate] = useState(null);

  const stats = useMemo(() => {
    const filtered = selectedDate ? records.filter(r => r.date === selectedDate) : records;
    const income = filtered.filter(r => r.type === 'income').reduce((s,r) => s+r.amount, 0);
    const expense = filtered.filter(r => r.type === 'expense').reduce((s,r) => s+r.amount, 0);
    return { income, expense, balance: income - expense };
  }, [records, selectedDate]);

  const displayRecords = useMemo(() => selectedDate ? records.filter(r => r.date === selectedDate) : records, [records, selectedDate]);
  const handleAdd = useCallback(record => addRecord({...record, id: generateId()}), [addRecord]);
  if (loading) return <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50 flex items-center justify-center'><p className='text-4xl animate-bounce'>🐰</p></div>;

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50'>
      <div className='pointer-events-none fixed inset-0 overflow-hidden'>
        <div className='absolute -top-20 -right-20 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl' />
        <div className='absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-purple-200/25 blur-3xl' />
      </div>
      <InstallPrompt />
      <div className='relative mx-auto max-w-lg px-4 py-8 pb-24'>
        <Header income={stats.income} expense={stats.expense} balance={stats.balance} selectedDate={selectedDate} onDateChange={setSelectedDate} />
        <TransactionForm onAdd={handleAdd} />
        <TransactionList records={displayRecords} month={null} onDelete={deleteRecord} />
      </div>
      <div className='fixed bottom-16 left-1/2 -translate-x-1/2 z-40'>
        <a href='/lazy-sheep-accounting/app.apk' download className='flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 px-5 py-2.5 text-sm font-bold text-white shadow-soft-lg active:scale-95 transition-transform hover:shadow-xl'><span className='text-lg'>🐑</span> 下载 App</a>
      </div>
      <NavBar />
    </div>
  );
}
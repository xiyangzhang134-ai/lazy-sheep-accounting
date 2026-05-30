import { useState } from 'react';
import { getCategories } from '../utils/categories';
import DatePicker from './DatePicker';

const FORM_INITIAL = { amount: '', type: 'expense', category: '', note: '' };

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState(FORM_INITIAL);
  const [error, setError] = useState('');
  const [dateStr, setDateStr] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });

  const categories = getCategories(form.type);

  const handleTypeChange = (type) => {
    setForm((prev) => ({ ...prev, type, category: '' }));
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) {
      setError('请输入有效的金额哦～');
      return;
    }
    if (!form.category) {
      setError('请选一个分类吧～');
      return;
    }

    onAdd({
      amount,
      type: form.type,
      category: form.category,
      note: form.note.trim() || '无备注',
      date: dateStr,
    });

    setForm(FORM_INITIAL);
    setError('');
  };

  const fieldClass =
    'w-full rounded-xl border-2 border-pink-100 bg-white/70 px-4 py-2.5 text-sm backdrop-blur-sm transition-all placeholder:text-gray-300 hover:border-pink-200 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-100';

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-3xl bg-white/80 p-5 shadow-soft-lg backdrop-blur-sm border border-pink-100"
    >
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-pink-500 flex items-center gap-2">
          <span className="text-xl">✏️</span> 记一笔
        </h2>

        <DatePicker dateStr={dateStr} onDateChange={setDateStr} />
      </div>

      {/* 类型切换 */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'expense', label: '💸 支出', active: 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-soft', inactive: 'bg-pink-50 text-pink-400 hover:bg-pink-100' },
          { key: 'income', label: '🪙 收入', active: 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-soft', inactive: 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100' },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => handleTypeChange(t.key)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
              form.type === t.key ? t.active + ' scale-[1.02]' : t.inactive
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-pink-400 mb-1.5 ml-1">💰 金额</label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-pink-400 mb-1.5 ml-1">🏷️ 分类</label>
          <select
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={fieldClass + ' cursor-pointer'}
          >
            <option value="">请选择～</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-medium text-pink-400 mb-1.5 ml-1">📝 备注</label>
          <input
            type="text"
            placeholder="写点什么吧～"
            value={form.note}
            onChange={(e) => handleChange('note', e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 text-center text-sm font-medium text-rose-400 bg-rose-50 rounded-xl py-2">
          🥺 {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 py-3 text-sm font-bold text-white shadow-soft-lg transition-all hover:from-pink-500 hover:to-purple-500 active:scale-[0.97]"
      >
        ✨ 添加记录 ✨
      </button>
    </form>
  );
}

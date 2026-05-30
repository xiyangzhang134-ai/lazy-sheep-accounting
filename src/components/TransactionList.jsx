import { useMemo, useState } from 'react';
import TransactionItem from './TransactionItem';

function groupByDate(records) {
  const groups = [];
  let current = null;

  for (const r of records) {
    if (!current || current.date !== r.date) {
      current = { date: r.date, items: [] };
      groups.push(current);
    }
    current.items.push(r);
  }

  return groups.map((g) => {
    const dayIncome = g.items
      .filter((r) => r.type === 'income')
      .reduce((s, r) => s + r.amount, 0);
    const dayExpense = g.items
      .filter((r) => r.type === 'expense')
      .reduce((s, r) => s + r.amount, 0);
    return { ...g, dayIncome, dayExpense };
  });
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const weekMap = ['日', '一', '二', '三', '四', '五', '六'];
  const week = weekMap[new Date(dateStr).getDay()];
  return `${Number(m)}月${Number(d)}日 周${week}`;
}

export default function TransactionList({ records, month, onDelete }) {
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(() => {
    const list = month ? records.filter((r) => r.date.startsWith(month)) : records;
    return list.slice().sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  }, [records, month]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  const handleDelete = (id) => {
    setDeleteId(id);
    setTimeout(() => {
      onDelete(id);
      setDeleteId(null);
    }, 250);
  };

  if (grouped.length === 0) {
    return (
      <div className="rounded-3xl bg-white/80 p-12 text-center shadow-soft backdrop-blur-sm border border-pink-100">
        <p className="text-5xl mb-4 animate-bounce">🐣</p>
        <p className="text-sm font-medium text-pink-300">还没有记录哦～</p>
        <p className="text-xs text-pink-200 mt-1">记下你的第一笔吧！</p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-bold text-pink-500 mb-4 flex items-center gap-2">
        <span className="text-xl">📋</span> 记录列表
        <span className="ml-2 rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-bold text-pink-500">
          {filtered.length}
        </span>
      </h2>

      <div className="space-y-3">
        {grouped.map((group) => (
          <div
            key={group.date}
            className="rounded-3xl bg-white/80 shadow-soft-sm backdrop-blur-sm overflow-hidden border border-purple-100 transition-all hover:shadow-soft"
          >
            {/* 日期标题 */}
            <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-b border-pink-100">
              <span className="text-sm font-bold text-purple-500">
                📅 {formatDate(group.date)}
              </span>
              <span className="text-xs space-x-2 font-medium">
                {group.dayIncome > 0 && (
                  <span className="text-emerald-500">🌸 ¥{group.dayIncome.toFixed(2)}</span>
                )}
                {group.dayExpense > 0 && (
                  <span className="text-rose-400">🍰 ¥{group.dayExpense.toFixed(2)}</span>
                )}
              </span>
            </div>

            <div className="divide-y divide-pink-50">
              {group.items.map((r) => (
                <TransactionItem
                  key={r.id}
                  record={r}
                  isDeleting={deleteId === r.id}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

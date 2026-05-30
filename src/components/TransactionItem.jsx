import { useState } from 'react';
import { findCategory } from '../utils/categories';

export default function TransactionItem({ record, isDeleting, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const cat = findCategory(record.category);
  const isIncome = record.type === 'income';

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 transition-all duration-300 ${
        isDeleting ? 'opacity-0 scale-90 -translate-y-2' : ''
      }`}
    >
      {/* 分类图标 - 可爱圆形 */}
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg shadow-soft-sm"
        style={{ backgroundColor: (cat?.color || '#f9a8d4') + '20' }}
      >
        {cat?.label?.slice(0, 2) || (isIncome ? '💰' : '💸')}
      </span>

      {/* 详情 */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-gray-700">
          {cat?.label || record.category}
        </p>
        {record.note && record.note !== '无备注' && (
          <p className="truncate text-xs text-gray-400 mt-0.5">{record.note}</p>
        )}
      </div>

      {/* 金额 */}
      <span
        className={`shrink-0 text-sm font-extrabold ${
          isIncome ? 'text-emerald-500' : 'text-rose-400'
        }`}
      >
        {isIncome ? '+' : '-'}¥{record.amount.toFixed(2)}
      </span>

      {/* 删除按钮 */}
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="shrink-0 rounded-xl p-1.5 text-pink-200 hover:bg-rose-50 hover:text-rose-400 transition-all"
          title="删除"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      ) : (
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => onDelete(record.id)}
            className="rounded-xl bg-gradient-to-r from-rose-400 to-pink-400 px-3 py-1.5 text-xs font-bold text-white shadow-soft-sm transition-all hover:from-rose-500 hover:to-pink-500 active:scale-90"
          >
            确认
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-400 hover:bg-gray-200 transition-all"
          >
            取消
          </button>
        </div>
      )}
    </div>
  );
}

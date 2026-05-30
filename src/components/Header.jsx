export default function Header({ income, expense, balance, month, onMonthChange }) {
  return (
    <header className="mb-6">
      {/* 标题 + 快捷按钮 */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
          🐰 小钱钱记账本
        </h1>
        {month && (
          <button
            onClick={() => onMonthChange(null)}
            className="rounded-xl bg-white/70 px-3 py-1.5 text-xs font-bold text-pink-400 shadow-soft-sm backdrop-blur-sm transition-all hover:bg-pink-50 hover:text-pink-500"
          >
            ← 查看全部
          </button>
        )}
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="收入"
          amount={income}
          emoji="🌸"
          gradient="from-emerald-50 to-teal-50"
          textColor="text-emerald-600"
          borderColor="border-emerald-200"
        />
        <StatCard
          label="支出"
          amount={expense}
          emoji="🍰"
          gradient="from-rose-50 to-pink-50"
          textColor="text-rose-500"
          borderColor="border-rose-200"
        />
        <StatCard
          label="结余"
          amount={balance}
          emoji="⭐"
          gradient="from-purple-50 to-indigo-50"
          textColor="text-purple-600"
          borderColor="border-purple-200"
        />
      </div>
    </header>
  );
}

function StatCard({ label, amount, emoji, gradient, textColor, borderColor }) {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br ${gradient} p-4 text-center shadow-soft-sm border ${borderColor} transition-all hover:scale-105 hover:shadow-soft-lg`}
    >
      <p className="text-xl mb-1 drop-shadow-sm">{emoji}</p>
      <p className={`text-base font-extrabold ${textColor}`}>
        ¥{amount.toFixed(2)}
      </p>
      <p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import NavBar from '../components/NavBar';
import DatePicker from '../components/DatePicker';
import { useRecords } from '../hooks/useData';
import { getDailySummary, getWeeklySummary, getMonthlySummary, getExpenseCategoryBreakdown } from '../utils/stats';
import { findCategory } from '../utils/categories';

const CHART_COLORS = { income: '#10b981', expense: '#f472b6' };
const PIE_COLORS = [
  '#f472b6', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#06b6d4', '#ef4444',
  '#ec4899', '#14b8a6', '#f59e0b', '#6366f1',
];
const GRANULARITY = [
  { key: 'daily', label: '📆 日', count: 14, desc: '近14天' },
  { key: 'weekly', label: '📊 周', count: 8, desc: '近8周' },
  { key: 'monthly', label: '📅 月', count: 6, desc: '近6月' },
];

function formatXLabel(key, val) {
  if (key === 'daily') { const [, m, d] = val.split('-'); return `${Number(m)}/${Number(d)}`; }
  if (key === 'weekly') return val;
  if (key === 'monthly') { const [, m] = val.split('-'); return `${Number(m)}月`; }
  return val;
}

function formatTTLabel(key, val) {
  if (key === 'daily') return val;
  if (key === 'weekly') return val;
  if (key === 'monthly') return val.replace('-', '年') + '月';
  return val;
}

function dataKey(key) {
  return key === 'daily' ? 'date' : key === 'weekly' ? 'week' : 'month';
}

export default function TrendPage() {
  const navigate = useNavigate();
  const { records, loading } = useRecords();

  const todayStr = useMemo(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
  }, []);

  const [dateStr, setDateStr] = useState(todayStr);
  const [granularity, setGranularity] = useState('daily');

  const lineData = useMemo(() => {
    if (loading) return [];
    const cfg = GRANULARITY.find((g) => g.key === granularity);
    if (granularity === 'daily') return getDailySummary(records, dateStr, cfg.count);
    if (granularity === 'weekly') return getWeeklySummary(records, dateStr, cfg.count);
    return getMonthlySummary(records, dateStr, cfg.count);
  }, [records, dateStr, granularity, loading]);

  const expenseBreakdown = useMemo(() => {
    if (loading) return [];
    const items = getExpenseCategoryBreakdown(records);
    return items.map((item, i) => ({
      ...item,
      label: findCategory(item.category)?.label || item.category,
      color: findCategory(item.category)?.color || PIE_COLORS[i % PIE_COLORS.length],
    }));
  }, [records, loading]);

  const dk = dataKey(granularity);
  const hasData = lineData.some((d) => d.income > 0 || d.expense > 0);
  const currentCfg = GRANULARITY.find((g) => g.key === granularity);

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

      <div className="relative mx-auto max-w-lg px-4 py-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
            📈 趋势分析
          </h1>
          <div className="flex items-center gap-2">
            <DatePicker dateStr={dateStr} onDateChange={setDateStr} />
            <button
              onClick={() => navigate('/')}
              className="rounded-xl bg-white/70 px-2.5 py-1.5 text-xs font-bold text-pink-400 shadow-soft-sm backdrop-blur-sm hover:bg-pink-50 hover:text-pink-500"
            >
              ← 返回
            </button>
          </div>
        </div>

        <div className="flex gap-1 mb-4">
          {GRANULARITY.map((g) => (
            <button
              key={g.key}
              onClick={() => { setGranularity(g.key); setDateStr(todayStr); }}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                granularity === g.key
                  ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-soft-sm scale-105'
                  : 'bg-white/60 text-pink-300 shadow-soft-sm hover:bg-pink-50 hover:text-pink-400 backdrop-blur-sm'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <section className="mb-6 rounded-3xl bg-white/80 p-5 shadow-soft-lg backdrop-blur-sm border border-pink-100">
          <h2 className="text-base font-bold text-pink-500 mb-1 flex items-center gap-2">
            <span>📊</span> 收支趋势
            <span className="ml-auto text-xs font-normal text-pink-300">{currentCfg?.desc}</span>
          </h2>
          {hasData ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
                  <XAxis dataKey={dk} tickFormatter={(v) => formatXLabel(granularity, v)} tick={{ fontSize: granularity === 'daily' ? 9 : 11, fill: '#c084fc' }} axisLine={{ stroke: '#fbcfe8' }} tickLine={false} angle={granularity === 'daily' ? -35 : 0} textAnchor={granularity === 'daily' ? 'end' : 'middle'} height={granularity === 'daily' ? 40 : 30} />
                  <YAxis tick={{ fontSize: 11, fill: '#c084fc' }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '2px solid #fbcfe8', backgroundColor: '#fff', fontSize: '12px' }} formatter={(value, name) => [`¥${Number(value).toFixed(2)}`, name === 'income' ? '收入' : '支出']} labelFormatter={(label) => formatTTLabel(granularity, label)} />
                  <Line type="monotone" dataKey="income" name="income" stroke={CHART_COLORS.income} strokeWidth={2.5} dot={{ r: granularity === 'daily' ? 2 : 4, fill: CHART_COLORS.income, stroke: '#fff', strokeWidth: 1.5 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="expense" name="expense" stroke={CHART_COLORS.expense} strokeWidth={2.5} dot={{ r: granularity === 'daily' ? 2 : 4, fill: CHART_COLORS.expense, stroke: '#fff', strokeWidth: 1.5 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-pink-300"><p className="text-4xl mb-2">📭</p><p className="text-sm font-medium">该时段暂无数据～</p></div>
          )}
          {hasData && (
            <div className="flex justify-center gap-6 mt-3">
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500"><span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" /> 收入</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-pink-400"><span className="inline-block h-2.5 w-2.5 rounded-full bg-pink-400" /> 支出</span>
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-white/80 p-5 shadow-soft-lg backdrop-blur-sm border border-pink-100">
          <h2 className="text-base font-bold text-pink-500 mb-4 flex items-center gap-2"><span>🍩</span> 支出分类占比</h2>
          {expenseBreakdown.length > 0 ? (
            <>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseBreakdown} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} strokeWidth={2} stroke="#fff">
                      {expenseBreakdown.map((entry) => (<Cell key={entry.category} fill={entry.color} style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.08))' }} />))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '2px solid #fbcfe8', backgroundColor: '#fff', fontSize: '12px' }} formatter={(value) => `¥${Number(value).toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                {expenseBreakdown.map((item) => (
                  <div key={item.category} className="flex items-center gap-2"><span className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} /><span className="truncate text-xs text-gray-500">{item.label}</span><span className="ml-auto shrink-0 text-xs font-semibold text-gray-600">¥{item.value.toFixed(0)}</span></div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-pink-300"><p className="text-4xl mb-2">🍩</p><p className="text-sm font-medium">还没有支出记录哦～</p></div>
          )}
        </section>
      </div>
      <NavBar />
    </div>
  );
}

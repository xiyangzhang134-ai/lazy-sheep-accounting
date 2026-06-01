import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import NavBar from "../components/NavBar";
import DatePicker from "../components/DatePicker";
import { useRecords } from "../hooks/useData";
import { getDailySummary, getWeeklySummary, getMonthlySummary, getExpenseCategoryBreakdown } from "../utils/stats";
import { findCategory } from "../utils/categories";

const CC={income:"#10b981",expense:"#f472b6"};
const PC=["#f472b6","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#06b6d4","#ef4444","#ec4899","#14b8a6","#f59e0b","#6366f1"];
const G=[{key:"daily",label:"📆 日",count:14,desc:"近14天"},{key:"weekly",label:"📊 周",count:8,desc:"近8周"},{key:"monthly",label:"📅 月",count:6,desc:"近6月"}];

function fx(k,v){if(k==="daily"){const[,m,d]=v.split("-");return Number(m)+"/"+Number(d);}if(k==="weekly")return v;if(k==="monthly"){const[,m]=v.split("-");return Number(m)+"月";}return v;}
function ft(k,v){if(k==="daily")return v;if(k==="weekly")return v;if(k==="monthly")return v.replace("-","年")+"月";return v;}
function dk(k){return k==="daily"?"date":k==="weekly"?"week":"month";}
function DayDetail({ point, gran, onClose }) {
  if (!point) return null;
  const k = dk(gran);
  const l = point[k] || "";
  const inc = Number(point.income || 0);
  const exp = Number(point.expense || 0);
  const bal = inc - exp;
  const dl = gran === "daily" ? l : gran === "weekly" ? l : l.replace("-", "年") + "月";
  const icon = gran === "daily" ? "📅" : gran === "weekly" ? "📊" : "📅";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.3)" }} onClick={onClose}>
      <div className="relative bg-white rounded-2xl p-5 max-w-[280px] w-full shadow-soft-lg border-2 border-pink-200 animate-[fadeIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-full bg-pink-50 text-pink-400 hover:bg-pink-100 text-sm">✕</button>
        <p className="text-center text-sm font-extrabold text-pink-500 mb-3">{icon} {dl}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2"><span className="text-xs font-bold text-emerald-600">🌸 收入</span><span className="text-sm font-extrabold text-emerald-600">¥{inc.toFixed(2)}</span></div>
          <div className="flex items-center justify-between rounded-xl bg-rose-50 px-3 py-2"><span className="text-xs font-bold text-rose-500">🍰 支出</span><span className="text-sm font-extrabold text-rose-500">¥{exp.toFixed(2)}</span></div>
          <div className="flex items-center justify-between rounded-xl bg-purple-50 px-3 py-2"><span className="text-xs font-bold text-purple-600">⭐ 结余</span><span className={"text-sm font-extrabold " + (bal >= 0 ? "text-purple-600" : "text-rose-500")}>¥{bal.toFixed(2)}</span></div>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-3">点空白处关闭</p>
      </div>
    </div>
  );
}

export default function TrendPage() {
  const nav = useNavigate();
  const { records, loading } = useRecords();
  const ts = useMemo(() => { const n = new Date(); return n.getFullYear() + "-" + String(n.getMonth() + 1).padStart(2, "0") + "-" + String(n.getDate()).padStart(2, "0"); }, []);
  const [ds, setDs] = useState(ts);
  const [gran, setGran] = useState("daily");
  const [pt, setPt] = useState(null);
  const ld = useMemo(() => {
    if (loading) return [];
    const c = G.find(g => g.key === gran);
    if (gran === "daily") return getDailySummary(records, ds, c.count);
    if (gran === "weekly") return getWeeklySummary(records, ds, c.count);
    return getMonthlySummary(records, ds, c.count);
  }, [records, ds, gran, loading]);
  const eb = useMemo(() => {
    if (loading) return [];
    return getExpenseCategoryBreakdown(records).map((it, i) => ({ ...it, label: findCategory(it.category)?.label || it.category, color: findCategory(it.category)?.color || PC[i % PC.length] }));
  }, [records, loading]);
  const k = dk(gran);
  const hd = ld.some(d => d.income > 0 || d.expense > 0);
  const cc = G.find(g => g.key === gran);
  if (loading) return <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50 flex items-center justify-center"><p className="text-4xl animate-bounce">🐰</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-sky-50">
      <div className="pointer-events-none fixed inset-0 overflow-hidden"><div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" /><div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-purple-200/25 blur-3xl" /></div>
      <div className="relative mx-auto max-w-lg px-4 py-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">📈 趋势分析</h1>
          <div className="flex items-center gap-2"><DatePicker dateStr={ds} onDateChange={setDs} /><button onClick={() => nav("/")} className="rounded-xl bg-white/70 px-2.5 py-1.5 text-xs font-bold text-pink-400 shadow-soft-sm backdrop-blur-sm hover:bg-pink-50 hover:text-pink-500">← 返回</button></div>
        </div>
        <div className="flex gap-1 mb-4">{G.map(g => <button key={g.key} onClick={() => { setGran(g.key); setDs(ts); setPt(null); }} className={"flex-1 rounded-xl py-2 text-xs font-bold transition-all " + (gran === g.key ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-soft-sm scale-105" : "bg-white/60 text-pink-300 shadow-soft-sm hover:bg-pink-50 hover:text-pink-400 backdrop-blur-sm")}>{g.label}</button>)}</div>
        <section className="mb-6 rounded-3xl bg-white/80 p-5 shadow-soft-lg backdrop-blur-sm border border-pink-100">
          <h2 className="text-base font-bold text-pink-500 mb-1 flex items-center gap-2"><span>📊</span> 收支趋势<span className="ml-auto text-xs font-normal text-pink-300">{cc?.desc}</span><span className="text-[10px] text-pink-200">· 点图表看详情</span></h2>
          {hd ? (<div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={ld} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} onClick={(d) => { if (d && d.activePayload && d.activePayload.length > 0) setPt(d.activePayload[0].payload); }}><CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" /><XAxis dataKey={k} tickFormatter={v => fx(gran, v)} tick={{ fontSize: gran === "daily" ? 9 : 11, fill: "#c084fc" }} axisLine={{ stroke: "#fbcfe8" }} tickLine={false} angle={gran === "daily" ? -35 : 0} textAnchor={gran === "daily" ? "end" : "middle"} height={gran === "daily" ? 40 : 30} /><YAxis tick={{ fontSize: 11, fill: "#c084fc" }} axisLine={false} tickLine={false} width={55} /><Tooltip contentStyle={{ borderRadius: "12px", border: "2px solid #fbcfe8", backgroundColor: "#fff", fontSize: "12px" }} formatter={(v, n) => ["¥" + Number(v).toFixed(2), n === "income" ? "收入" : "支出"]} labelFormatter={l => ft(gran, l)} /><Line type="monotone" dataKey="income" name="income" stroke={CC.income} strokeWidth={2.5} dot={{ r: gran === "daily" ? 2 : 4, fill: CC.income, stroke: "#fff", strokeWidth: 1.5, cursor: "pointer" }} activeDot={{ r: 7, stroke: "#f472b6", strokeWidth: 2 }} /><Line type="monotone" dataKey="expense" name="expense" stroke={CC.expense} strokeWidth={2.5} dot={{ r: gran === "daily" ? 2 : 4, fill: CC.expense, stroke: "#fff", strokeWidth: 1.5, cursor: "pointer" }} activeDot={{ r: 7, stroke: "#10b981", strokeWidth: 2 }} /></LineChart></ResponsiveContainer></div>) : (<div className="flex flex-col items-center justify-center py-10 text-pink-300"><p className="text-4xl mb-2">📭</p><p className="text-sm font-medium">该时段暂无数据～</p></div>)}
          {hd && (<div className="flex justify-center gap-6 mt-3"><span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500"><span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" /> 收入</span><span className="flex items-center gap-1.5 text-xs font-medium text-pink-400"><span className="inline-block h-2.5 w-2.5 rounded-full bg-pink-400" /> 支出</span></div>)}
        </section>
        <section className="rounded-3xl bg-white/80 p-5 shadow-soft-lg backdrop-blur-sm border border-pink-100">
          <h2 className="text-base font-bold text-pink-500 mb-4 flex items-center gap-2"><span>🍩</span> 支出分类占比</h2>
          {eb.length > 0 ? (<><div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={eb} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} strokeWidth={2} stroke="#fff">{eb.map(en => <Cell key={en.category} fill={en.color} style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.08))" }} />)}</Pie><Tooltip contentStyle={{ borderRadius: "12px", border: "2px solid #fbcfe8", backgroundColor: "#fff", fontSize: "12px" }} formatter={v => "¥" + Number(v).toFixed(2)} /></PieChart></ResponsiveContainer></div><div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">{eb.map(it => <div key={it.category} className="flex items-center gap-2"><span className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: it.color }} /><span className="truncate text-xs text-gray-500">{it.label}</span><span className="ml-auto shrink-0 text-xs font-semibold text-gray-600">¥{it.value.toFixed(0)}</span></div>)}</div></>) : (<div className="flex flex-col items-center justify-center py-10 text-pink-300"><p className="text-4xl mb-2">🍩</p><p className="text-sm font-medium">还没有支出记录哦～</p></div>)}
        </section>
      </div>
      <NavBar />
      {pt && <DayDetail point={pt} gran={gran} onClose={() => setPt(null)} />}
    </div>
  );
}

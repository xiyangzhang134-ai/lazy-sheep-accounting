import { useState, useMemo, useRef, useEffect } from 'react';

const START_YEAR = 2020;

/** 某年某月天数（含闰年） */
function daysInMonth(year, month) {
  if ([1, 3, 5, 7, 8, 10, 12].includes(month)) return 31;
  if ([4, 6, 9, 11].includes(month)) return 30;
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
}

/**
 * 右上角日期小组件
 * @param {{ dateStr: string, onDateChange: (dateStr: string) => void }}
 * dateStr 格式 YYYY-MM-DD
 */
export default function DatePicker({ dateStr, onDateChange }) {
  const now = new Date();
  const todayY = now.getFullYear();
  const todayM = now.getMonth() + 1;
  const todayD = now.getDate();

  const [defY, defM, defD] = dateStr.split('-').map(Number);

  const [year, setYear] = useState(defY || todayY);
  const [month, setMonth] = useState(defM || todayM);
  const [day, setDay] = useState(defD || todayD);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // 外部 dateStr 变化时同步
  useEffect(() => {
    const [y, m, d] = dateStr.split('-').map(Number);
    setYear(y);
    setMonth(m);
    setDay(d);
  }, [dateStr]);

  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const maxDay = useMemo(() => daysInMonth(year, month), [year, month]);
  const dayOptions = useMemo(() => {
    const arr = [];
    for (let d = 1; d <= maxDay; d++) arr.push(d);
    return arr;
  }, [maxDay]);

  const yearOptions = useMemo(() => {
    const arr = [];
    for (let y = todayY; y >= START_YEAR; y--) arr.push(y);
    return arr;
  }, [todayY]);

  const emit = (y, m, d) => {
    const str = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    onDateChange(str);
  };

  const selectClass =
    'rounded-xl border-2 border-pink-100 bg-white px-2 py-1.5 text-center text-xs font-bold text-pink-500 transition-all cursor-pointer appearance-none hover:border-pink-300 focus:border-pink-400 focus:outline-none';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all shadow-soft-sm ${
          open
            ? 'bg-pink-400 text-white'
            : 'bg-white/70 text-pink-400 hover:bg-pink-50 hover:text-pink-500'
        }`}
      >
        📅 {dateStr}
        <svg className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 rounded-2xl bg-white p-3 shadow-soft-lg border border-pink-100 animate-[fadeIn_0.15s_ease-out]">
          <div className="flex items-center gap-1.5">
            <select
              value={year}
              onChange={(e) => {
                const y = Number(e.target.value);
                setYear(y);
                const d = Math.min(day, daysInMonth(y, month));
                setDay(d);
                emit(y, month, d);
              }}
              className={selectClass}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}年</option>
              ))}
            </select>

            <select
              value={month}
              onChange={(e) => {
                const m = Number(e.target.value);
                setMonth(m);
                const d = Math.min(day, daysInMonth(year, m));
                setDay(d);
                emit(year, m, d);
              }}
              className={selectClass}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{m}月</option>
              ))}
            </select>

            <select
              value={day}
              onChange={(e) => {
                const d = Number(e.target.value);
                setDay(d);
                emit(year, month, d);
              }}
              className={selectClass}
            >
              {dayOptions.map((d) => (
                <option key={d} value={d}>{d}日</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                setYear(todayY);
                setMonth(todayM);
                setDay(todayD);
                emit(todayY, todayM, todayD);
              }}
              className="ml-1 rounded-lg bg-pink-50 px-2 py-1.5 text-[10px] font-bold text-pink-400 hover:bg-pink-100 transition-colors"
            >
              今天
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

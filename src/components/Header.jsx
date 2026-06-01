import { useState, useMemo, useRef, useEffect } from 'react';

const START_YEAR = 2020;
function daysInMonth(year, month) {
  if ([1,3,5,7,8,10,12].includes(month)) return 31;
  if ([4,6,9,11].includes(month)) return 30;
  return (year%4===0&&year%100!==0)||year%400===0?29:28;
}

export default function Header({ income, expense, balance, selectedDate, onDateChange }) {
  const now = new Date();
  const todayY = now.getFullYear();
  const todayM = now.getMonth()+1;
  const todayD = now.getDate();
  const [defY,defM,defD] = selectedDate?selectedDate.split('-').map(Number):[todayY,todayM,todayD];
  const [year,setYear] = useState(defY);
  const [month,setMonth] = useState(defM);
  const [day,setDay] = useState(defD);
  const [open,setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if(selectedDate){const[y,m,d]=selectedDate.split('-').map(Number);setYear(y);setMonth(m);setDay(d);}
    else{setYear(todayY);setMonth(todayM);setDay(todayD);}
  },[selectedDate]);

  useEffect(() => {
    if(!open)return;
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener('mousedown',h);
    return()=>document.removeEventListener('mousedown',h);
  },[open]);

  const maxDay=useMemo(()=>daysInMonth(year,month),[year,month]);
  const dayOptions=useMemo(()=>Array.from({length:maxDay},(_,i)=>i+1),[maxDay]);
  const yearOptions=useMemo(()=>Array.from({length:todayY-START_YEAR+1},(_,i)=>todayY-i),[todayY]);

  const emit=(y,m,d)=>{onDateChange(y+'-'+String(m).padStart(2,'0')+'-'+String(d).padStart(2,'0'));};
  const label=selectedDate||'全部时间';
  const sc='rounded-xl border-2 border-pink-100 bg-white px-2 py-1.5 text-center text-xs font-bold text-pink-500 cursor-pointer appearance-none hover:border-pink-300';

  return (
    <header className='mb-6'>
      <div className='flex items-center justify-between mb-4 gap-2'>
        <h1 className='text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 shrink-0'>🐰 小钱钱记账本</h1>
        <div className='flex items-center gap-1.5'>
          <div className='relative' ref={ref}>
            <button type='button' onClick={()=>setOpen(!open)} className={'flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all shadow-soft-sm whitespace-nowrap '+(open?'bg-pink-400 text-white':selectedDate?'bg-pink-50 text-pink-500 border border-pink-200':'bg-white/70 text-pink-400 hover:bg-pink-50 hover:text-pink-500')}>
              📅 {label}
              <svg className={'h-3 w-3 transition-transform '+(open?'rotate-180':'')} fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={3}><path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7'/></svg>
            </button>
            {open&&<div className='absolute right-0 top-full mt-1.5 z-50 rounded-2xl bg-white p-3 shadow-soft-lg border border-pink-100 animate-[fadeIn_0.15s_ease-out] min-w-[280px]'>
              <div className='flex items-center gap-1.5 flex-wrap justify-end'>
                <select value={year} onChange={e=>{const y=Number(e.target.value);setYear(y);const d=Math.min(day,daysInMonth(y,month));setDay(d);emit(y,month,d);}} className={sc}>{yearOptions.map(y=><option key={y} value={y}>{y}年</option>)}</select>
                <select value={month} onChange={e=>{const m=Number(e.target.value);setMonth(m);const d=Math.min(day,daysInMonth(year,m));setDay(d);emit(year,m,d);}} className={sc}>{Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={m}>{m}月</option>)}</select>
                <select value={day} onChange={e=>{const d=Number(e.target.value);setDay(d);emit(year,month,d);}} className={sc}>{dayOptions.map(d=><option key={d} value={d}>{d}日</option>)}</select>
                <button type='button' onClick={()=>{setYear(todayY);setMonth(todayM);setDay(todayD);emit(todayY,todayM,todayD);}} className='rounded-lg bg-pink-50 px-2 py-1.5 text-[10px] font-bold text-pink-400 hover:bg-pink-100 transition-colors'>今天</button>
              </div>
            </div>}
          </div>
          {selectedDate&&<button onClick={()=>onDateChange(null)} className='rounded-xl bg-white/70 px-2.5 py-1.5 text-xs font-bold text-pink-400 shadow-soft-sm backdrop-blur-sm hover:bg-pink-50 hover:text-pink-500 shrink-0'>← 查看全部</button>}
        </div>
      </div>
      <div className='grid grid-cols-3 gap-3'>
        <StatCard label='收入' amount={income} emoji='🌸' gradient='from-emerald-50 to-teal-50' textColor='text-emerald-600' borderColor='border-emerald-200'/>
        <StatCard label='支出' amount={expense} emoji='🍰' gradient='from-rose-50 to-pink-50' textColor='text-rose-500' borderColor='border-rose-200'/>
        <StatCard label='结余' amount={balance} emoji='⭐' gradient='from-purple-50 to-indigo-50' textColor='text-purple-600' borderColor='border-purple-200'/>
      </div>
    </header>
  );
}

function StatCard({label,amount,emoji,gradient,textColor,borderColor}){
  return <div className={'rounded-2xl bg-gradient-to-br '+gradient+' p-4 text-center shadow-soft-sm border '+borderColor+' transition-all hover:scale-105 hover:shadow-soft-lg'}>
    <p className='text-xl mb-1 drop-shadow-sm'>{emoji}</p>
    <p className={'text-base font-extrabold '+textColor}>¥{amount.toFixed(2)}</p>
    <p className='text-xs text-gray-500 mt-0.5 font-medium'>{label}</p>
  </div>;
}
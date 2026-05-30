import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import ProgressRing from '../components/ProgressRing';
import BadgeCard from '../components/BadgeCard';
import { useRecords, useCheckins } from '../hooks/useData';
import { getRecordDays, todayDateStr, getConsecutiveCheckinDays } from '../utils/storage';

/** 徽章定义 */
const BADGES = [
  { key: 'checkin_7',   emoji: '🌱', name: '初来乍到', desc: '累计打卡 7 天', type: 'checkin', threshold: 7,   color: '#84cc16', bg: 'bg-lime-100' },
  { key: 'checkin_30',  emoji: '🔥', name: '坚持不懈', desc: '累计打卡 30 天', type: 'checkin', threshold: 30,  color: '#f97316', bg: 'bg-orange-100' },
  { key: 'checkin_100', emoji: '👑', name: '打卡达人', desc: '累计打卡 100 天', type: 'checkin', threshold: 100, color: '#f59e0b', bg: 'bg-amber-100' },
  { key: 'streak_30',   emoji: '⭐', name: '全勤奖',   desc: '连续打卡 30 天不间断', type: 'streak', threshold: 30,  color: '#eab308', bg: 'bg-yellow-100' },
  { key: 'record_7',    emoji: '📝', name: '记账新秀', desc: '累计记账 7 天', type: 'record',  threshold: 7,   color: '#38bdf8', bg: 'bg-sky-100' },
  { key: 'record_30',   emoji: '💰', name: '理财能手', desc: '累计记账 30 天', type: 'record',  threshold: 30,  color: '#3b82f6', bg: 'bg-blue-100' },
  { key: 'record_100',  emoji: '🏆', name: '财务管家', desc: '累计记账 100 天', type: 'record',  threshold: 100, color: '#ec4899', bg: 'bg-pink-100' },
];

export default function Achievement() {
  const navigate = useNavigate();

  const { records, loading: recLoading } = useRecords();
  const { checkins, loading: chkLoading, doCheckin } = useCheckins();
  const [checkedToday, setCheckedToday] = useState(false);
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  const recordDays = useMemo(() => getRecordDays(records), [records]);
  const checkinDays = checkins.length;
  const streakDays = useMemo(() => getConsecutiveCheckinDays(checkins), [checkins]);

  const loading = recLoading || chkLoading;

  // 检查今天是否已打卡
  useMemo(() => {
    setCheckedToday(checkins.includes(todayDateStr()));
  }, [checkins]);

  const handleCheckin = async () => {
    const result = await doCheckin();
    setCheckedToday(true);
    if (result.isNew) {
      setJustCheckedIn(true);
      setTimeout(() => setJustCheckedIn(false), 2000);
    }
  };

  // 获取徽章进度
  const getProgress = (badge) => {
    let total;
    if (badge.type === 'checkin') total = checkinDays;
    else if (badge.type === 'streak') total = streakDays;
    else total = recordDays;
    const unlocked = total >= badge.threshold;
    return { total, unlocked };
  };

  const unlockedCount = BADGES.filter((b) => getProgress(b).unlocked).length;

  // 打卡进度环的目标（取下一个未解锁打卡徽章的阈值）
  const checkinGoal = BADGES.find((b) => b.type === 'checkin' && !getProgress(b).unlocked)?.threshold || 100;
  const checkinProgress = Math.min(100, Math.round((checkinDays / checkinGoal) * 100));

  // 记账进度环
  const recordGoal = BADGES.find((b) => b.type === 'record' && !getProgress(b).unlocked)?.threshold || 100;
  const recordProgress = Math.min(100, Math.round((recordDays / recordGoal) * 100));

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
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
            🏆 我的成就
          </h1>
          <button
            onClick={() => navigate('/')}
            className="rounded-xl bg-white/70 px-3 py-1.5 text-xs font-bold text-pink-400 shadow-soft-sm backdrop-blur-sm hover:bg-pink-50 hover:text-pink-500"
          >
            ← 返回记账
          </button>
        </div>

        {/* 统计区：进度环 + 打卡按钮 */}
        <div className="flex items-center justify-center gap-8 mb-6 rounded-3xl bg-white/80 p-6 shadow-soft-lg backdrop-blur-sm border border-pink-100">
          {/* 打卡进度环 */}
          <div className="flex flex-col items-center gap-1">
            <ProgressRing size={90} progress={checkinProgress} color="#f472b6" bgColor="#fce7f3" strokeWidth={7}>
              <span className="text-xl font-extrabold text-pink-500">{checkinDays}</span>
              <span className="text-[10px] text-gray-400 font-medium">打卡</span>
              <span className="text-[9px] text-pink-300">{checkinProgress}%</span>
            </ProgressRing>
            {streakDays >= 3 && (
              <p className="text-[10px] font-bold text-amber-400">🔥 连续 {streakDays} 天</p>
            )}
          </div>

          {/* 中间：打卡按钮 */}
          <div className="relative flex flex-col items-center">
            {checkedToday ? (
              <div className="flex flex-col items-center gap-1 rounded-2xl bg-emerald-50 px-6 py-4 border border-emerald-200">
                <span className="text-3xl">✅</span>
                <p className="text-xs font-bold text-emerald-500">今日已打卡</p>
                <p className="text-[10px] text-emerald-400">{todayDateStr()}</p>
              </div>
            ) : (
              <button
                onClick={handleCheckin}
                className="rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 px-5 py-4 text-sm font-bold text-white shadow-soft-lg transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-95"
              >
                <span className="block text-2xl mb-1">🔥</span>
                今日打卡
              </button>
            )}
            {justCheckedIn && (
              <p className="absolute -top-2 right-0 rounded-full bg-emerald-400 px-2.5 py-0.5 text-xs font-bold text-white shadow-soft animate-[fadeIn_0.3s_ease-out]">
                +1 🎉
              </p>
            )}
          </div>

          {/* 记账进度环 */}
          <div className="flex flex-col items-center gap-1">
            <ProgressRing size={90} progress={recordProgress} color="#a78bfa" bgColor="#ede9fe" strokeWidth={7}>
              <span className="text-xl font-extrabold text-purple-500">{recordDays}</span>
              <span className="text-[10px] text-gray-400 font-medium">记账</span>
              <span className="text-[9px] text-purple-300">{recordProgress}%</span>
            </ProgressRing>
            <p className="text-[10px] font-bold text-purple-400">
              {unlockedCount}/{BADGES.length} 徽章
            </p>
          </div>
        </div>

        {/* 徽章墙 */}
        <section className="rounded-3xl bg-white/80 p-5 shadow-soft-lg backdrop-blur-sm border border-pink-100">
          <h2 className="text-base font-bold text-pink-500 mb-5 flex items-center gap-2">
            <span>🎖️</span> 徽章墙
            <span className="ml-auto text-xs font-normal text-pink-300">
              已解锁 {unlockedCount}/{BADGES.length}
            </span>
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {BADGES.map((badge) => {
              const { total, unlocked } = getProgress(badge);
              const progress = unlocked ? null : { total, threshold: badge.threshold };
              return (
                <BadgeCard
                  key={badge.key}
                  emoji={badge.emoji}
                  name={badge.name}
                  desc={badge.desc}
                  unlocked={unlocked}
                  progress={progress}
                  color={badge.color}
                  bg={badge.bg}
                />
              );
            })}
          </div>
        </section>
      </div>

      <NavBar />
    </div>
  );
}

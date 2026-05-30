import { useState, useRef, useEffect } from 'react';

/**
 * 圆形徽章卡片，hover 弹出说明
 * @param {{ emoji: string, name: string, desc: string, unlocked: boolean, progress?: {total:number, threshold:number}, color: string, bg: string }}
 */
export default function BadgeCard({ emoji, name, desc, unlocked, progress, color, bg }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef(null);

  const pct = progress ? Math.min(100, Math.round((progress.total / progress.threshold) * 100)) : 0;

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={() => setShowTooltip((v) => !v)}
    >
      {/* 圆形卡片 */}
      <div
        className={`flex h-[72px] w-[72px] flex-col items-center justify-center rounded-full border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg ${
          unlocked
            ? `${bg} border-current cursor-default`
            : 'border-gray-200 bg-gray-50 grayscale opacity-50 hover:opacity-70'
        }`}
        style={unlocked ? { color } : {}}
      >
        <span className="text-2xl leading-none">{emoji}</span>
        {!unlocked && progress && (
          <span className="mt-0.5 text-[9px] font-bold text-gray-400">
            {progress.total}/{progress.threshold}
          </span>
        )}
        {!unlocked && !progress && (
          <span className="mt-0.5 flex h-3 w-3 items-center justify-center text-gray-300">🔒</span>
        )}
        {unlocked && (
          <span className="mt-0.5 text-[10px]">✅</span>
        )}
      </div>

      {/* 悬停工具提示 */}
      {showTooltip && (
        <div
          className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-xl bg-white px-3 py-2 shadow-soft-lg border border-pink-100 text-center whitespace-nowrap animate-[fadeIn_0.15s_ease-out]"
        >
          <p className={`text-sm font-bold ${unlocked ? color : 'text-gray-400'}`}>
            {emoji} {name}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
          {!unlocked && progress && (
            <p className="text-[10px] text-pink-400 mt-1 font-bold">
              进度 {progress.total}/{progress.threshold}
            </p>
          )}
          {unlocked && (
            <p className="text-[10px] text-emerald-400 mt-1 font-bold">已解锁 🎉</p>
          )}
          {/* 小三角 */}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-[6px] border-transparent border-t-white" />
        </div>
      )}
    </div>
  );
}

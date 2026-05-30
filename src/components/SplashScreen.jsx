import { useState, useEffect, useRef } from 'react';

/**
 * 懒洋洋启动动画
 */
export default function SplashScreen({ onDone }) {
  const [fadeOut, setFadeOut] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // 2.8s 后开始淡出
    timerRef.current = setTimeout(() => {
      setFadeOut(true);
    }, 2800);

    return () => clearTimeout(timerRef.current);
  }, []);

  // 淡出动画结束后通知父组件移除
  const handleTransitionEnd = () => {
    if (fadeOut) onDone();
  };

  const handleSkip = () => {
    clearTimeout(timerRef.current);
    setFadeOut(true);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-yellow-100 via-amber-50 to-orange-100 overflow-hidden transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      onTransitionEnd={handleTransitionEnd}
      onClick={handleSkip}
    >
      {/* ── 背景装饰：云朵 ── */}
      <Cloud className="top-[12%] left-[8%] text-4xl opacity-70" delay="0s" />
      <Cloud className="top-[20%] right-[10%] text-3xl opacity-50" delay="3s" />
      <Cloud className="top-[35%] left-[70%] text-5xl opacity-60" delay="5s" />

      {/* ── 草地 ── */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around pointer-events-none">
        <span className="text-3xl animate-[sway_4s_ease-in-out_infinite]" style={{ animationDelay: '0s' }}>🌿</span>
        <span className="text-2xl animate-[sway_4s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }}>🌱</span>
        <span className="text-4xl animate-[sway_4s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}>🌿</span>
        <span className="text-2xl animate-[sway_4s_ease-in-out_infinite]" style={{ animationDelay: '1.5s' }}>🌾</span>
        <span className="text-3xl animate-[sway_4s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}>🌱</span>
      </div>

      {/* ── 中央：主角羊 🐑 ── */}
      <div className="relative flex flex-col items-center">
        {/* 睡眠泡泡 */}
        <div className="absolute -top-8 -right-4 pointer-events-none">
          <Bubble delay="0s" />
          <Bubble delay="1s" />
          <Bubble delay="2s" />
        </div>

        {/* 羊 */}
        <div
          className="relative transition-transform select-none"
          style={{ animation: 'sway 3s ease-in-out infinite' }}
        >
          {/* 羊毛身体 */}
          <div className="relative">
            <span
              className="block text-[100px] leading-none drop-shadow-lg select-none"
              style={{
                filter: 'drop-shadow(0 8px 12px rgba(180, 120, 60, 0.25))',
              }}
            >
              🐑
            </span>
          </div>
        </div>

        {/* 羊的影子 */}
        <div
          className="mt-1 h-4 w-24 rounded-full bg-amber-300/40 blur-sm"
          style={{ animation: 'breathe 3s ease-in-out infinite' }}
        />
      </div>

      {/* ── 底部文字 ── */}
      <div className="absolute bottom-[15%] flex flex-col items-center gap-1">
        <p
          className="text-base font-bold text-amber-600 tracking-wider"
          style={{ animation: 'fadeInOut 2.5s ease-in-out infinite' }}
        >
          懒洋洋记账中
        </p>
        <p
          className="text-xs text-amber-400 font-medium"
          style={{ animation: 'fadeInOut 2.5s ease-in-out infinite', animationDelay: '0.3s' }}
        >
          别急，让我伸个懒腰...
        </p>
      </div>

      {/* ── 底部提示：点击跳过 ── */}
      <p className="absolute bottom-8 text-[11px] text-amber-300/60 animate-pulse">
        点击任意位置跳过
      </p>

      {/* ── 内联 CSS 动画（确保 Tailwind 不能直接表达的） ── */}
      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-3deg) translateX(0); }
          50% { transform: rotate(3deg) translateX(4px); }
        }
        @keyframes breathe {
          0%, 100% { transform: scaleX(1); opacity: 0.4; }
          50% { transform: scaleX(0.7); opacity: 0.25; }
        }
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(-60px) scale(0.3); opacity: 0; }
        }
        @keyframes drift {
          0% { transform: translateX(0); }
          50% { transform: translateX(30px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

/** 云朵组件 */
function Cloud({ className = '', delay = '0s' }) {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{ animation: `drift 8s ease-in-out infinite`, animationDelay: delay }}
    >
      ☁️
    </div>
  );
}

/** 睡眠泡泡组件 */
function Bubble({ delay = '0s' }) {
  return (
    <div
      className="absolute text-lg"
      style={{
        animation: `floatUp 2s ease-out ${delay} infinite`,
        opacity: 0,
      }}
    >
      💤
    </div>
  );
}

import { useEffect, useState } from 'react';

export default function AnimalModal({ badge, onClose }) {
  const [hearts, setHearts] = useState([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();
      const x = Math.random() * 100;
      const size = 12 + Math.random() * 20;
      const duration = 2 + Math.random() * 3;
      const emoji = ['💕','✨','💖','🌟','💝','🎀','💗','🫧'][Math.floor(Math.random() * 8)];
      setHearts((prev) => {
        const next = [...prev, { id, x, size, duration, emoji }];
        return next.slice(-15);
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const getAnimalAnimation = (animal) => {
    const map = {
      '🐣': 'animate-hatch',
      '🦊': 'animate-fox',
      '🐧': 'animate-penguin',
      '🐰': 'animate-bunny',
      '🐱': 'animate-cat',
      '🐶': 'animate-dog',
      '🐻': 'animate-bear',
    };
    return map[animal] || 'animate-bounce-soft';
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.35)' }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {hearts.map((h) => (
        <span key={h.id} className="absolute pointer-events-none animate-float-up" style={{ left: h.x + '%', bottom: 0, fontSize: h.size + 'px', animationDuration: h.duration + 's' }}>{h.emoji}</span>
      ))}
      <div className={'relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-soft-lg border-2 border-pink-200 transition-all duration-300 ' + (showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90')} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-pink-50 text-pink-400 hover:bg-pink-100 hover:text-pink-500 transition-colors text-lg">✕</button>
        <div className="text-center mb-2">
          {badge.unlocked
            ? <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-500 text-xs font-bold border border-emerald-200">✅ 已解锁</span>
            : <span className="inline-block px-3 py-0.5 rounded-full bg-gray-100 text-gray-400 text-xs font-bold border border-gray-200">🔒 未解锁 ({badge.total}/{badge.threshold})</span>
          }
        </div>
        <h2 className="text-center text-lg font-extrabold text-gray-800 mt-2">{badge.emoji} {badge.name}</h2>
        <p className="text-center text-xs text-gray-500 mt-1">{badge.desc}</p>
        <div className="relative mt-4 mb-3 mx-auto w-40 h-40 rounded-full flex items-center justify-center overflow-hidden" style={{ background: 'radial-gradient(circle, ' + badge.animalColor + '40 0%, ' + badge.animalColor + '15 60%, transparent 100%)', boxShadow: badge.unlocked ? '0 0 40px ' + badge.animalColor + '40, 0 0 80px ' + badge.animalColor + '20' : 'none', filter: badge.unlocked ? 'none' : 'grayscale(0.5)' }}>
          <div className={'absolute inset-0 rounded-full ' + (badge.unlocked ? 'animate-spin-slow' : '')} style={{ background: 'conic-gradient(from 0deg, transparent, ' + badge.animalColor + '30, transparent, ' + badge.animalColor + '20, transparent)', opacity: 0.6 }} />
          <span className={'relative z-10 text-7xl select-none ' + (badge.unlocked ? getAnimalAnimation(badge.animal) : 'opacity-40')} style={{ textShadow: badge.unlocked ? '0 0 20px rgba(255,255,255,0.8), 0 4px 8px rgba(0,0,0,0.1)' : 'none' }}>{badge.animal}</span>
          <div className={'absolute bottom-5 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full transition-all duration-500 ' + (badge.unlocked ? 'animate-shadow-pulse' : '')} style={{ backgroundColor: badge.unlocked ? badge.animalColor + '30' : 'transparent' }} />
        </div>
        <div className="text-center">
          <p className={'text-sm font-bold ' + (badge.unlocked ? 'text-gray-700' : 'text-gray-400')}>{badge.animalName}</p>
          <p className="text-xs text-gray-400 mt-1 italic">{badge.unlocked ? badge.animalDesc : '继续努力解锁这只小可爱吧~'}</p>
        </div>
        {!badge.unlocked && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-400">解锁进度</span>
              <span className="text-[10px] font-bold text-gray-500">{badge.total}/{badge.threshold}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: Math.min(100, Math.round((badge.total / badge.threshold) * 100)) + '%', background: 'linear-gradient(90deg, ' + badge.color + ', ' + badge.color + 'cc)' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

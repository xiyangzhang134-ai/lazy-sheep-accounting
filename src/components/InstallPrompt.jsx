import { useState, useEffect } from 'react';

// iOS 检测
function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

// 是否已在 PWA standalone 模式
function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || navigator.standalone;  // iOS
}

// sessionStorage 关闭标记
function wasDismissed() {
  try { return sessionStorage.getItem('install-dismissed') === '1'; }
  catch { return false; }
}
function markDismissed() {
  try { sessionStorage.setItem('install-dismissed', '1'); }
  catch { /* noop */ }
}

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [deferred, setDeferred] = useState(null);  // Android beforeinstallprompt
  const [platform, setPlatform] = useState(null);    // 'android' | 'ios' | null

  useEffect(() => {
    if (isStandalone()) return;   // 已安装 PWA
    if (wasDismissed()) return;   // 本次会话已关闭

    // Android / Chrome 原生安装事件
    const handleBIP = (e) => {
      e.preventDefault();
      setDeferred(e);
      setPlatform('android');
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handleBIP);

    // iOS：没有 beforeinstallprompt，延迟 1.5s 显示引导
    let iOSTimer;
    if (isIOS() && !isStandalone()) {
      iOSTimer = setTimeout(() => {
        setPlatform('ios');
        setShow(true);
      }, 1500);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBIP);
      clearTimeout(iOSTimer);
    };
  }, []);

  const handleInstall = async () => {
    if (platform === 'android' && deferred) {
      deferred.prompt();
      const result = await deferred.userChoice;
      if (result.outcome === 'accepted') {
        setShow(false);
      }
      setDeferred(null);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    markDismissed();
  };

  if (!show) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9998] flex items-start gap-3 px-4 py-3 shadow-soft-lg backdrop-blur-md animate-[fadeIn_0.3s_ease-out] border-b-2 ${
        platform === 'ios'
          ? 'bg-white/90 border-pink-200'
          : 'bg-white/90 border-emerald-200'
      }`}
    >
      {/* 左侧图标 */}
      <div className="shrink-0 mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-400 shadow-soft-sm text-xl">
        🐑
      </div>

      {/* 中间文案 */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold text-amber-600">
          添加到主屏幕
        </p>
        {platform === 'android' ? (
          <p className="text-xs text-gray-500 mt-0.5">
            点击按钮一键安装，像原生 App 一样使用
          </p>
        ) : (
          <p className="text-xs text-gray-500 mt-0.5">
            点 Safari 底部 <span className="inline-block align-middle mx-0.5"><svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg></span> → 添加到主屏幕
          </p>
        )}
      </div>

      {/* 右侧按钮 */}
      <div className="flex shrink-0 items-center gap-1.5">
        {platform === 'android' ? (
          <button
            onClick={handleInstall}
            className="rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-3 py-1.5 text-xs font-bold text-white shadow-soft-sm transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-95"
          >
            安装
          </button>
        ) : (
          <button
            onClick={handleDismiss}
            className="rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 px-3 py-1.5 text-xs font-bold text-white shadow-soft-sm transition-all hover:from-pink-500 hover:to-purple-500 active:scale-95"
          >
            知道了
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="rounded-lg p-1 text-gray-300 hover:text-gray-400 transition-colors"
          aria-label="关闭"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

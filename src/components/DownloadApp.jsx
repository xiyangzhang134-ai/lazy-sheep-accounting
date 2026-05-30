import { useState, useEffect } from 'react';

/* ── 平台检测 ── */
function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
function isAndroid() {
  return /android/i.test(navigator.userAgent);
}
function isChrome() {
  return /chrome|crios/i.test(navigator.userAgent);
}
function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || navigator.standalone;
}
function wasDismissed() {
  try { return sessionStorage.getItem('download-dismissed') === '1'; }
  catch { return false; }
}
function markDismissed() {
  try { sessionStorage.setItem('download-dismissed', '1'); }
  catch { /* noop */ }
}

/**
 * 下载APP弹窗
 * - 在开机动画结束后弹出
 * - 支持 iOS / Android / 桌面
 * - 全部浏览器兼容
 * - 用户可手动关闭，本次会话不再弹出
 */
export default function DownloadApp({ force, onClose }) {
  const [show, setShow] = useState(false);
  const [deferred, setDeferred] = useState(null);
  const [platform, setPlatform] = useState('unknown');

  useEffect(() => {
    if (isStandalone()) return;
    if (!force && wasDismissed()) return;

    if (isIOS()) setPlatform('ios');
    else if (isAndroid()) {
      if (isChrome()) setPlatform('chrome');
      else setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // 等待 beforeinstallprompt（Chrome PWA）
    if (isAndroid() && isChrome()) {
      const handleBIP = (e) => {
        e.preventDefault();
        setDeferred(e);
      };
      window.addEventListener('beforeinstallprompt', handleBIP);
      setShow(true);
      return () => window.removeEventListener('beforeinstallprompt', handleBIP);
    }

    // 其他平台延迟一下再弹，让页面先渲染
    const timer = setTimeout(() => setShow(true), 600);
    return () => clearTimeout(timer);
  }, [force]);

  const handleDismiss = () => {
    setShow(false);
    markDismissed();
    onClose?.();
  };

  const handleInstall = async () => {
    if (deferred) {
      deferred.prompt();
      const result = await deferred.userChoice;
      if (result.outcome === 'accepted') {
        setShow(false);
        markDismissed();
        onClose?.();
      }
      setDeferred(null);
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center animate-[fadeIn_0.3s_ease-out]"
      onClick={handleDismiss}
    >
      {/* 半透明遮罩 */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* 弹窗卡片 */}
      <div
        className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 顶部装饰条 ── */}
        <div className="h-2 bg-gradient-to-r from-pink-300 via-amber-300 to-purple-300" />

        {/* ── 头部 ── */}
        <div className="relative pt-8 pb-2 px-6 text-center">
          {/* 羊图标 */}
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 to-orange-300 shadow-soft-lg">
            <span className="text-5xl">🐑</span>
          </div>
          <h2 className="text-xl font-extrabold text-amber-600">
            下载懒羊羊记账
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            {platform === 'desktop' ? '选择你的手机系统下载' : '像 App 一样使用，记账更方便'}
          </p>

          {/* 关闭按钮 */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
            aria-label="关闭"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── 内容区 ── */}
        <div className="px-6 pb-8">
          {platform === 'ios' && <IOSGuide onDismiss={handleDismiss} />}
          {platform === 'chrome' && <ChromeInstall onInstall={handleInstall} onDismiss={handleDismiss} />}
          {platform === 'android' && <AndroidGuide onDismiss={handleDismiss} />}
          {platform === 'desktop' && <DesktopLinks onDismiss={handleDismiss} />}
        </div>
      </div>

      {/* ── 内联动画 ── */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @media (min-width: 640px) {
          @keyframes slideUp {
            from { transform: translateY(40px) scale(0.95); opacity: 0; }
            to   { transform: translateY(0) scale(1); opacity: 1; }
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════
   iOS 引导 — Safari「添加到主屏幕」
   ══════════════════════════════════════════ */
function IOSGuide({ onDismiss }) {
  return (
    <div className="space-y-4">
      {/* 步骤 */}
      <div className="space-y-3">
        <Step num={1} text="在 Safari 中打开本页面" />
        <Step
          num={2}
          text={
            <>
              点击底部
              <svg className="inline-block align-middle mx-1 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              分享按钮
            </>
          }
        />
        <Step num={3} text="选择「添加到主屏幕」" />
      </div>

      {/* 示意图 */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-pink-50 p-4 text-center border border-amber-100">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-soft-sm">
              <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <span className="text-[10px] text-gray-400">分享</span>
          </div>
          <span className="text-gray-300 text-xl">→</span>
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-soft-sm">
              <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-[10px] text-gray-400">主屏幕</span>
          </div>
        </div>
        <p className="text-xs text-gray-400">像原生 App 一样从桌面打开！</p>
      </div>

      <button
        onClick={onDismiss}
        className="w-full rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 py-3.5 text-sm font-bold text-white shadow-soft-sm transition-all hover:from-pink-500 hover:to-rose-500 active:scale-[0.98]"
      >
        我知道了
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   Android Chrome — 一键 PWA 安装
   ══════════════════════════════════════════ */
function ChromeInstall({ onInstall, onDismiss }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-5 text-center border border-emerald-100">
        <span className="text-5xl">📱</span>
        <p className="mt-3 text-sm font-bold text-emerald-700">一键安装懒羊羊记账</p>
        <p className="mt-1 text-xs text-gray-500">安装后像 App 一样从桌面打开，无需每次打开浏览器</p>
      </div>

      <button
        onClick={onInstall}
        className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 py-3.5 text-sm font-bold text-white shadow-soft-sm transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        立即安装
      </button>

      <button
        onClick={onDismiss}
        className="w-full rounded-2xl bg-gray-100 py-3 text-sm font-medium text-gray-500 transition-all hover:bg-gray-200 active:scale-[0.98]"
      >
        暂不需要
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   Android 其他浏览器 — 手动引导
   ══════════════════════════════════════════ */
function AndroidGuide({ onDismiss }) {
  return (
    <div className="space-y-4">
      {/* 步骤 */}
      <div className="space-y-3">
        <Step num={1} text={
          <>
            点浏览器右上角
            <span className="inline-flex align-middle mx-1 items-center justify-center h-5 w-5 rounded bg-gray-200 text-[11px] font-bold text-gray-500">⋮</span>
            菜单
          </>
        } />
        <Step num={2} text="选择「添加到主屏幕」或「安装应用」" />
        <Step num={3} text="从桌面图标打开，像 App 一样使用" />
      </div>

      {/* 提示：推荐用 Chrome */}
      <div className="rounded-2xl bg-amber-50 p-4 border border-amber-100">
        <p className="text-xs text-amber-700 font-medium flex items-center gap-1.5">
          <span>💡</span>
          推荐使用 Chrome 浏览器打开，体验更流畅
        </p>
      </div>

      <button
        onClick={onDismiss}
        className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 py-3.5 text-sm font-bold text-white shadow-soft-sm transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98]"
      >
        我知道了
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   桌面端 — 双平台下载链接
   ══════════════════════════════════════════ */
function DesktopLinks({ onDismiss }) {
  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-gray-500 mb-2">
        用手机扫描二维码，或在手机浏览器打开下方网址
      </p>

      {/* 网址卡片 */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-pink-50 p-4 border border-amber-100">
        <p className="text-xs text-gray-400 text-center mb-2">手机浏览器打开</p>
        <div
          className="rounded-xl bg-white px-4 py-3 text-center text-sm font-mono font-bold text-amber-600 break-all shadow-soft-sm cursor-pointer select-all hover:bg-amber-50 transition-colors"
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
          }}
          title="点击复制"
        >
          {window.location.origin}{window.location.pathname}
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-2">↑ 点击复制网址，发送到手机 ↑</p>
      </div>

      {/* 平台说明 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-3 text-center border border-gray-200">
          <span className="text-2xl">🍎</span>
          <p className="mt-1 text-xs font-bold text-gray-600">iPhone / iPad</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Safari 打开 → 添加到主屏幕</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 p-3 text-center border border-green-200">
          <span className="text-2xl">🤖</span>
          <p className="mt-1 text-xs font-bold text-gray-600">Android</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Chrome 打开 → 一键安装</p>
        </div>
      </div>

      <button
        onClick={onDismiss}
        className="w-full rounded-2xl bg-gray-100 py-3 text-sm font-medium text-gray-500 transition-all hover:bg-gray-200 active:scale-[0.98]"
      >
        关闭
      </button>
    </div>
  );
}

/* ── 步骤组件 ── */
function Step({ num, text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 text-xs font-bold text-white shadow-soft-sm">
        {num}
      </div>
      <span className="text-sm text-gray-600 leading-6">{text}</span>
    </div>
  );
}

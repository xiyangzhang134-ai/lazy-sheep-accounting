import { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import DownloadApp from './components/DownloadApp';
import HomePage from './pages/HomePage';
import TrendPage from './pages/TrendPage';
import Achievement from './pages/Achievement';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showDownload, setShowDownload] = useState(false);

  // 兜底：3.5s 强制结束（防止 transitionEnd 不触发）
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  // 开机动画结束后 → 弹出下载提示
  useEffect(() => {
    if (!showSplash) {
      const timer = setTimeout(() => setShowDownload(true), 400);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const handleCloseDownload = useCallback(() => {
    setShowDownload(false);
  }, []);

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  return (
    <>
      {/* 下载APP弹窗 — 开机动画结束后弹出，用户手动关闭 */}
      {showDownload && <DownloadApp onClose={handleCloseDownload} />}

      <Routes>
        <Route path="/" element={<HomePage onOpenDownload={() => setShowDownload(true)} />} />
        <Route path="/trend" element={<TrendPage />} />
        <Route path="/achievement" element={<Achievement />} />
      </Routes>
    </>
  );
}

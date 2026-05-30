import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import HomePage from './pages/HomePage';
import TrendPage from './pages/TrendPage';
import Achievement from './pages/Achievement';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // 兜底：3.5s 强制结束（防止 transitionEnd 不触发）
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/trend" element={<TrendPage />} />
      <Route path="/achievement" element={<Achievement />} />
    </Routes>
  );
}

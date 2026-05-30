import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-3 pt-1">
      <div className="flex gap-1 rounded-2xl bg-white/80 p-1 shadow-soft-lg backdrop-blur-sm border border-pink-100">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-1 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              isActive
                ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-soft-sm'
                : 'text-pink-300 hover:text-pink-400'
            }`
          }
        >
          ✏️ 记账
        </NavLink>
        <NavLink
          to="/trend"
          className={({ isActive }) =>
            `flex items-center gap-1 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              isActive
                ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-soft-sm'
                : 'text-pink-300 hover:text-pink-400'
            }`
          }
        >
          📈 趋势
        </NavLink>
        <NavLink
          to="/achievement"
          className={({ isActive }) =>
            `flex items-center gap-1 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              isActive
                ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-soft-sm'
                : 'text-pink-300 hover:text-pink-400'
            }`
          }
        >
          🏆 成就
        </NavLink>
      </div>
    </nav>
  );
}

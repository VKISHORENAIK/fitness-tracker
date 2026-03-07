import { NavLink } from 'react-router-dom';

const nav = [
  { to: '/', label: 'Dashboard' },
  { to: '/workouts', label: 'Workouts' },
  { to: '/diet', label: 'Diet' },
  { to: '/calorie-calculator', label: 'Calculator' },
  { to: '/progress', label: 'Progress' },
];

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="bg-surface-elevated border-b border-neutral-200/80 sticky top-0 z-10 backdrop-blur-sm bg-surface-elevated/95">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 text-ink font-semibold text-lg transition-opacity hover:opacity-80"
          >
            <span className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center text-white text-sm font-medium">
              F
            </span>
            FitTrack
          </NavLink>
          <nav className="flex gap-0.5 overflow-x-auto pb-1 -mx-2 px-2 sm:overflow-visible sm:mx-0 sm:px-0">
            {nav.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-ink text-white'
                      : 'text-ink-secondary hover:text-ink hover:bg-neutral-100'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}

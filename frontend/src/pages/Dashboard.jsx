import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { progressApi } from '../api';
import GoalsForm from '../components/GoalsForm';
import { DashboardSkeleton } from '../components/LoadingSkeleton';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGoals, setShowGoals] = useState(false);

  useEffect(() => {
    progressApi
      .getDaily()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [showGoals]);

  if (loading) return <DashboardSkeleton />;
  if (error)
    return (
      <div className="rounded-2xl bg-red-50 text-red-700 p-4 border border-red-100 animate-fade-in">
        {error}
      </div>
    );
  if (!data) return null;

  const {
    caloriesConsumed,
    remainingCalories,
    totalProtein,
    remainingProtein,
    dailyCalorieGoal,
    dailyProteinGoal,
    workouts,
    foodLogs,
  } = data;

  const proteinGoal = dailyProteinGoal || 150;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-semibold text-ink tracking-tight">Today's Overview</h1>
        <div className="flex gap-2">
          <Link
            to="/calorie-calculator"
            className="px-4 py-2 rounded-xl text-sm font-medium text-ink-secondary hover:text-ink hover:bg-neutral-100 transition-all duration-200"
          >
            Calorie Calculator
          </Link>
          <button
            onClick={() => setShowGoals(!showGoals)}
            className="px-4 py-2 rounded-xl text-sm font-medium text-ink-secondary hover:text-ink hover:bg-neutral-100 transition-all duration-200"
          >
            {showGoals ? 'Hide goals' : 'Edit goals'}
          </button>
        </div>
      </div>

      {showGoals && (
        <div className="bg-surface-elevated rounded-2xl shadow-card p-6 border border-neutral-100 animate-fade-in-up">
          <GoalsForm
            onSaved={() => setShowGoals(false)}
            initialCalories={dailyCalorieGoal}
            initialProtein={proteinGoal}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Daily Calorie Target"
          value={`${dailyCalorieGoal} kcal`}
          subtitle="your goal for today"
          index={0}
        />
        <StatCard
          title="Calories Consumed"
          value={caloriesConsumed}
          subtitle={`of ${dailyCalorieGoal} kcal`}
          index={1}
        />
        <StatCard
          title="Remaining Calories"
          value={remainingCalories}
          subtitle="left for today"
          index={2}
          accent
        />
        <StatCard
          title="Protein"
          value={`${totalProtein}g`}
          subtitle={`Target: ${proteinGoal}g`}
          index={3}
        />
        <StatCard
          title="Remaining Protein"
          value={`${Math.round(remainingProtein)}g`}
          subtitle="left for today"
          index={4}
          accent
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-surface-elevated rounded-2xl shadow-card overflow-hidden border border-neutral-100">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="font-semibold text-ink text-sm">Workouts today</h2>
            <Link
              to="/workouts"
              className="text-sm font-medium text-ink-secondary hover:text-ink transition-colors"
            >
              Add workout
            </Link>
          </div>
          <div className="p-6">
            {workouts?.length ? (
              <ul className="space-y-3">
                {workouts.map((w, i) => (
                  <li
                    key={w.id}
                    className="flex justify-between items-start py-2 animate-fade-in-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div>
                      <p className="font-medium text-ink">{w.name}</p>
                      <p className="text-sm text-ink-tertiary">
                        {w.exercises?.length} exercise(s)
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ink-muted text-sm py-4">No workouts logged today.</p>
            )}
          </div>
        </section>

        <section className="bg-surface-elevated rounded-2xl shadow-card overflow-hidden border border-neutral-100">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="font-semibold text-ink text-sm">Food today</h2>
            <Link
              to="/diet"
              className="text-sm font-medium text-ink-secondary hover:text-ink transition-colors"
            >
              Log food
            </Link>
          </div>
          <div className="p-6">
            {foodLogs?.length ? (
              <ul className="space-y-3">
                {foodLogs.map((f, i) => (
                  <li
                    key={f.id}
                    className="flex justify-between items-center py-2 animate-fade-in-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <span className="font-medium text-ink">{f.foodName}</span>
                    <span className="text-sm text-ink-tertiary">
                      {f.calories} kcal · {f.protein}g protein
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ink-muted text-sm py-4">No food logged today.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, index, accent }) {
  return (
    <div
      className={`
        rounded-2xl p-6 shadow-card border transition-all duration-250
        hover:shadow-card-hover hover:scale-[1.01]
        bg-surface-elevated border-neutral-100
        animate-fade-in-up
      `}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <p className="text-sm font-medium text-ink-secondary">{title}</p>
      <p
        className={`text-2xl font-semibold mt-2 tracking-tight ${
          accent ? 'text-ink' : 'text-ink'
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-ink-muted mt-1">{subtitle}</p>
    </div>
  );
}

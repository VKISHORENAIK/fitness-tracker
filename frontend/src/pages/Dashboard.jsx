import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { progressApi } from '../api';
import GoalsForm from '../components/GoalsForm';

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

  if (loading) return <div className="text-center py-12 text-slate-500">Loading...</div>;
  if (error) return <div className="rounded-lg bg-red-50 text-red-700 p-4">{error}</div>;
  if (!data) return null;

  const { caloriesConsumed, remainingCalories, totalProtein, remainingProtein, dailyCalorieGoal, dailyProteinGoal, workouts, foodLogs } = data;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-slate-800">Today's Overview</h1>
        <div className="flex gap-2">
          <Link
            to="/calorie-calculator"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Calorie Calculator
          </Link>
          <button
            onClick={() => setShowGoals(!showGoals)}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            {showGoals ? 'Hide goals' : 'Edit daily goals'}
          </button>
        </div>
      </div>

      {showGoals && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <GoalsForm onSaved={() => setShowGoals(false)} initialCalories={dailyCalorieGoal} initialProtein={dailyProteinGoal} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Daily Calorie Target"
          value={`${dailyCalorieGoal} kcal`}
          subtitle="your goal for today"
          color="primary"
        />
        <StatCard
          title="Calories Consumed Today"
          value={caloriesConsumed}
          subtitle={`of ${dailyCalorieGoal} kcal`}
          color="primary"
        />
        <StatCard
          title="Remaining Calories"
          value={remainingCalories}
          subtitle="left for today"
          color="accent"
        />
        <StatCard
          title="Protein"
          value={`${totalProtein}g`}
          subtitle={`Target: ${dailyProteinGoal}g`}
          color="primary"
        />
        <StatCard
          title="Remaining protein"
          value={`${Math.round(remainingProtein)}g`}
          subtitle="left for today"
          color="accent"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Workouts today</h2>
            <Link to="/workouts" className="text-sm text-primary-600 hover:underline">Add workout</Link>
          </div>
          <div className="p-6">
            {workouts?.length ? (
              <ul className="space-y-3">
                {workouts.map((w) => (
                  <li key={w.id} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-slate-800">{w.name}</p>
                      <p className="text-sm text-slate-500">
                        {w.exercises?.length} exercise(s)
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm">No workouts logged today.</p>
            )}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Food today</h2>
            <Link to="/diet" className="text-sm text-primary-600 hover:underline">Log food</Link>
          </div>
          <div className="p-6">
            {foodLogs?.length ? (
              <ul className="space-y-3">
                {foodLogs.map((f) => (
                  <li key={f.id} className="flex justify-between items-center">
                    <span className="text-slate-800">{f.foodName}</span>
                    <span className="text-sm text-slate-500">{f.calories} kcal · {f.protein}g protein</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm">No food logged today.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, color }) {
  const bg = color === 'primary' ? 'bg-primary-50 border-primary-200' : 'bg-amber-50 border-amber-200';
  const valueCl = color === 'primary' ? 'text-primary-700' : 'text-amber-800';
  return (
    <div className={`rounded-xl border p-6 ${bg}`}>
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className={`text-2xl font-bold mt-1 ${valueCl}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { workoutsApi } from '../api';
import WorkoutForm from '../components/WorkoutForm';
import { CardSkeleton } from '../components/LoadingSkeleton';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  function load() {
    setLoading(true);
    workoutsApi
      .list()
      .then(setWorkouts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => load(), []);

  async function handleDelete(id) {
    if (!confirm('Delete this workout?')) return;
    try {
      await workoutsApi.delete(id);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading)
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between">
          <div className="h-8 w-44 bg-neutral-200 rounded-lg animate-pulse" />
          <div className="h-10 w-28 bg-neutral-200 rounded-xl animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  if (error)
    return (
      <div className="rounded-2xl bg-red-50 text-red-700 p-4 border border-red-100 animate-fade-in">
        {error}
      </div>
    );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-semibold text-ink tracking-tight">Workouts</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-xl bg-ink text-white text-sm font-medium hover:bg-ink/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          {showForm ? 'Cancel' : 'Add workout'}
        </button>
      </div>

      {showForm && (
        <div className="bg-surface-elevated rounded-2xl shadow-card p-6 border border-neutral-100 animate-fade-in-up">
          <WorkoutForm
            onSaved={() => {
              setShowForm(false);
              load();
            }}
          />
        </div>
      )}

      <div className="space-y-4">
        {workouts.length === 0 ? (
          <div className="bg-surface-elevated rounded-2xl shadow-card p-12 text-center border border-neutral-100">
            <p className="text-ink-muted">No workouts yet. Add one above.</p>
          </div>
        ) : (
          workouts.map((w, i) => (
            <div
              key={w.id}
              className="bg-surface-elevated rounded-2xl shadow-card overflow-hidden border border-neutral-100 hover:shadow-card-hover transition-all duration-200 animate-fade-in-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-ink">{w.name}</h2>
                  <p className="text-sm text-ink-tertiary">
                    {new Date(w.date).toLocaleDateString()} {w.notes && `· ${w.notes}`}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(w.id)}
                  className="text-sm text-ink-tertiary hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {w.exercises?.map((e) => (
                    <li
                      key={e.id}
                      className="flex justify-between items-center text-sm py-2 border-b border-neutral-50 last:border-0"
                    >
                      <span className="font-medium text-ink">{e.name}</span>
                      <span className="text-ink-tertiary">
                        {e.sets} sets × {e.reps} reps @ {e.weight} kg
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

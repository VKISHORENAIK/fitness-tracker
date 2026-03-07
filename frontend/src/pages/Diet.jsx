import { useEffect, useState } from 'react';
import { foodApi, foodsLookupApi } from '../api';
import FoodLogForm from '../components/FoodLogForm';
import { CardSkeleton } from '../components/LoadingSkeleton';

export default function Diet() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  function load() {
    setLoading(true);
    foodApi
      .list()
      .then(setLogs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => load(), []);

  async function handleDelete(id) {
    if (!confirm('Remove this food log?')) return;
    try {
      await foodApi.delete(id);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading)
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between">
          <div className="h-8 w-40 bg-neutral-200 rounded-lg animate-pulse" />
          <div className="h-10 w-24 bg-neutral-200 rounded-xl animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
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
        <h1 className="text-2xl font-semibold text-ink tracking-tight">Diet Tracker</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-xl bg-ink text-white text-sm font-medium hover:bg-ink/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          {showForm ? 'Cancel' : 'Log food'}
        </button>
      </div>

      {showForm && (
        <div className="bg-surface-elevated rounded-2xl shadow-card p-6 border border-neutral-100 animate-fade-in-up">
          <FoodLogForm
            onSaved={() => {
              setShowForm(false);
              load();
            }}
          />
        </div>
      )}

      <div className="space-y-3">
        {logs.length === 0 ? (
          <div className="bg-surface-elevated rounded-2xl shadow-card p-12 text-center border border-neutral-100">
            <p className="text-ink-muted">No food logged yet.</p>
          </div>
        ) : (
          logs.map((f, i) => (
            <div
              key={f.id}
              className="bg-surface-elevated rounded-2xl shadow-card px-6 py-4 flex justify-between items-center border border-neutral-100 hover:shadow-card-hover transition-all duration-200 animate-fade-in-up"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div>
                <p className="font-medium text-ink">{f.foodName}</p>
                <p className="text-sm text-ink-tertiary">
                  {f.quantity} {f.unit} · {f.calories} kcal · {f.protein}g protein ·{' '}
                  {new Date(f.date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(f.id)}
                className="text-sm text-ink-tertiary hover:text-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

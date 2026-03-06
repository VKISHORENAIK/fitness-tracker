import { useEffect, useState } from 'react';
import { foodApi, foodsLookupApi } from '../api';
import FoodLogForm from '../components/FoodLogForm';

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

  if (loading) return <div className="text-center py-12 text-slate-500">Loading...</div>;
  if (error) return <div className="rounded-lg bg-red-50 text-red-700 p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Diet Tracker</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-primary-600 text-white px-4 py-2 text-sm font-medium hover:bg-primary-700"
        >
          {showForm ? 'Cancel' : 'Log food'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
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
          <p className="text-slate-500 py-8 text-center">No food logged yet.</p>
        ) : (
          logs.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-xl border border-slate-200 px-6 py-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-slate-800">{f.foodName}</p>
                <p className="text-sm text-slate-500">
                  {f.quantity} {f.unit} · {f.calories} kcal · {f.protein}g protein ·{' '}
                  {new Date(f.date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(f.id)}
                className="text-sm text-red-600 hover:underline"
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

import { useEffect, useState } from 'react';
import { workoutsApi } from '../api';
import WorkoutForm from '../components/WorkoutForm';

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

  if (loading) return <div className="text-center py-12 text-slate-500">Loading...</div>;
  if (error) return <div className="rounded-lg bg-red-50 text-red-700 p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Workout Tracker</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-primary-600 text-white px-4 py-2 text-sm font-medium hover:bg-primary-700"
        >
          {showForm ? 'Cancel' : 'Add workout'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
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
          <p className="text-slate-500 py-8 text-center">No workouts yet. Add one above.</p>
        ) : (
          workouts.map((w) => (
            <div key={w.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-slate-800">{w.name}</h2>
                  <p className="text-sm text-slate-500">
                    {new Date(w.date).toLocaleDateString()} {w.notes && `· ${w.notes}`}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(w.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {w.exercises?.map((e) => (
                    <li key={e.id} className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-800">{e.name}</span>
                      <span className="text-slate-500">
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

import { useState } from 'react';
import { workoutsApi } from '../api';

const defaultExercise = () => ({ name: '', sets: 3, reps: 10, weight: 0, notes: '' });

export default function WorkoutForm({ onSaved }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState([defaultExercise()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function addExercise() {
    setExercises((e) => [...e, defaultExercise()]);
  }

  function updateExercise(i, field, value) {
    setExercises((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  }

  function removeExercise(i) {
    if (exercises.length <= 1) return;
    setExercises((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      name: name || 'Workout',
      date,
      notes: notes || undefined,
      exercises: exercises
        .filter((ex) => ex.name.trim())
        .map((ex) => ({
          name: ex.name,
          sets: Number(ex.sets) || 0,
          reps: Number(ex.reps) || 0,
          weight: Number(ex.weight) || 0,
          notes: ex.notes || undefined,
        })),
    };
    try {
      await workoutsApi.add(payload);
      onSaved?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="font-semibold text-slate-800">New workout</h3>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm text-slate-600">Workout name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Leg Day"
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-600">Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm text-slate-600">Notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </label>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">Exercises</span>
          <button type="button" onClick={addExercise} className="text-sm text-primary-600 hover:underline">
            + Add exercise
          </button>
        </div>
        <div className="space-y-3">
          {exercises.map((ex, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end p-3 rounded-lg bg-slate-50">
              <div className="col-span-12 sm:col-span-3">
                <input
                  type="text"
                  value={ex.name}
                  onChange={(e) => updateExercise(i, 'name', e.target.value)}
                  placeholder="Exercise name"
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <input
                  type="number"
                  min="1"
                  value={ex.sets}
                  onChange={(e) => updateExercise(i, 'sets', e.target.value)}
                  placeholder="Sets"
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <input
                  type="number"
                  min="1"
                  value={ex.reps}
                  onChange={(e) => updateExercise(i, 'reps', e.target.value)}
                  placeholder="Reps"
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={ex.weight || ''}
                  onChange={(e) => updateExercise(i, 'weight', e.target.value)}
                  placeholder="Weight (kg)"
                  className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                />
              </div>
              <div className="col-span-12 sm:col-span-2 flex gap-1">
                <input
                  type="text"
                  value={ex.notes}
                  onChange={(e) => updateExercise(i, 'notes', e.target.value)}
                  placeholder="Notes"
                  className="flex-1 rounded border border-slate-300 px-2 py-1.5 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeExercise(i)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-primary-600 text-white px-4 py-2 text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save workout'}
      </button>
    </form>
  );
}

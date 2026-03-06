import { useState } from 'react';
import { goalsApi } from '../api';

export default function GoalsForm({ onSaved, initialCalories = 2000, initialProtein = 150 }) {
  const [calories, setCalories] = useState(initialCalories);
  const [protein, setProtein] = useState(initialProtein);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await goalsApi.update({ dailyCalories: Number(calories), dailyProtein: Number(protein) });
      onSaved?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-slate-800">Daily nutrition goals</h3>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm text-slate-600">Daily calorie goal (kcal)</span>
          <input
            type="number"
            min="1"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-600">Daily protein goal (g)</span>
          <input
            type="number"
            min="0"
            step="1"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-primary-600 text-white px-4 py-2 text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save goals'}
      </button>
    </form>
  );
}

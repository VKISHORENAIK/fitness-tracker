import { useState } from 'react';
import { goalsApi } from '../api';

const inputClass =
  'mt-1 block w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-ink bg-surface-elevated focus:border-ink/30 transition-colors';

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
      <h3 className="font-semibold text-ink text-sm">Daily nutrition goals</h3>
      {error && (
        <p className="text-sm text-red-600 rounded-lg bg-red-50 px-3 py-2 border border-red-100">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-ink-secondary">Daily calorie goal (kcal)</span>
          <input
            type="number"
            min="1"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink-secondary">Daily protein goal (g)</span>
          <input
            type="number"
            min="0"
            step="1"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-ink text-white px-5 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        {saving ? 'Saving...' : 'Save goals'}
      </button>
    </form>
  );
}

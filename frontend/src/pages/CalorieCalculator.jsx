import { useState } from 'react';
import { calorieApi } from '../api';

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
  { value: 'light', label: 'Light (exercise 1–3 days/week)' },
  { value: 'moderate', label: 'Moderate (exercise 3–5 days/week)' },
  { value: 'active', label: 'Active (exercise 6–7 days/week)' },
  { value: 'very active', label: 'Very active (intense daily exercise)' },
];

const GOAL_OPTIONS = [
  { value: 'maintain weight', label: 'Maintain weight' },
  { value: 'lose weight', label: 'Lose weight' },
  { value: 'gain weight', label: 'Gain weight' },
];

const inputClass =
  'mt-1 block w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-ink bg-surface-elevated focus:border-ink/30 transition-colors';

export default function CalorieCalculator() {
  const [form, setForm] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain weight',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await calorieApi.calculate({
        weight: Number(form.weight),
        height: Number(form.height),
        age: Number(form.age),
        gender: form.gender,
        activityLevel: form.activityLevel,
        goal: form.goal,
        save: true,
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-ink tracking-tight">Calorie Calculator</h1>
        <p className="text-ink-secondary mt-1 text-sm">
          Calculate your daily calorie requirement using the Mifflin-St Jeor equation.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-surface-elevated rounded-2xl shadow-card border border-neutral-100 p-6 sm:p-8 space-y-5"
      >
        <h2 className="font-semibold text-ink text-sm">Your details</h2>
        {error && (
          <div className="rounded-xl bg-red-50 text-red-700 px-4 py-2.5 text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-ink-secondary">Weight (kg)</span>
            <input
              type="number"
              name="weight"
              min="1"
              step="0.1"
              value={form.weight}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink-secondary">Height (cm)</span>
            <input
              type="number"
              name="height"
              min="1"
              step="1"
              value={form.height}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-ink-secondary">Age</span>
            <input
              type="number"
              name="age"
              min="1"
              max="120"
              value={form.age}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink-secondary">Gender</span>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-ink-secondary">Activity level</span>
          <select
            name="activityLevel"
            value={form.activityLevel}
            onChange={handleChange}
            className={inputClass}
          >
            {ACTIVITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-ink-secondary">Goal</span>
          <select
            name="goal"
            value={form.goal}
            onChange={handleChange}
            className={inputClass}
          >
            {GOAL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto rounded-xl bg-ink text-white px-6 py-2.5 text-sm font-medium hover:bg-ink/90 disabled:opacity-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>

      {result && (
        <div className="bg-surface-elevated rounded-2xl shadow-card overflow-hidden border border-neutral-100 animate-fade-in-up">
          <div className="bg-neutral-50 border-b border-neutral-100 px-6 py-4">
            <h2 className="font-semibold text-ink">Your results</h2>
            {result.saved && (
              <p className="text-xs text-ink-tertiary mt-0.5">Saved to your goals</p>
            )}
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-neutral-100">
              <span className="text-ink-secondary">Basal Metabolic Rate (BMR)</span>
              <span className="font-semibold text-ink">{result.bmr} kcal/day</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-neutral-100">
              <span className="text-ink-secondary">Daily calories needed</span>
              <span className="font-semibold text-ink">{result.dailyCalories} kcal</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-ink-secondary">Recommended protein intake</span>
              <span className="font-semibold text-ink">{result.proteinTarget}g/day</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Calorie Calculator</h1>
        <p className="text-slate-600 mt-1 text-sm">
          Calculate your daily calorie requirement using the Mifflin-St Jeor equation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <h2 className="font-semibold text-slate-800">Your details</h2>
        {error && (
          <div className="rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm">{error}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Weight (kg)</span>
            <input
              type="number"
              name="weight"
              min="1"
              step="0.1"
              value={form.weight}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Height (cm)</span>
            <input
              type="number"
              name="height"
              min="1"
              step="1"
              value={form.height}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Age</span>
            <input
              type="number"
              name="age"
              min="1"
              max="120"
              value={form.age}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Gender</span>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Activity level</span>
          <select
            name="activityLevel"
            value={form.activityLevel}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          >
            {ACTIVITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Goal</span>
          <select
            name="goal"
            value={form.goal}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
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
          className="w-full sm:w-auto rounded-lg bg-primary-600 text-white px-6 py-2.5 text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>

      {result && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-primary-50 border-b border-primary-200 px-6 py-4">
            <h2 className="font-semibold text-primary-800">Your results</h2>
            {result.saved && (
              <p className="text-xs text-primary-600 mt-0.5">Saved to your goals</p>
            )}
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-slate-600">Basal Metabolic Rate (BMR)</span>
              <span className="font-bold text-slate-900">{result.bmr} kcal/day</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-slate-600">Daily calories needed</span>
              <span className="font-bold text-primary-600">{result.dailyCalories} kcal</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-slate-600">Recommended protein intake</span>
              <span className="font-bold text-slate-900">{result.proteinTarget}g/day</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

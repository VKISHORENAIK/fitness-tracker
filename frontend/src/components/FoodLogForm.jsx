import { useState, useEffect } from 'react';
import { foodApi, foodsLookupApi } from '../api';

export default function FoodLogForm({ onSaved }) {
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('g');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [suggestions, setSuggestions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!foodName.trim()) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(() => {
      foodsLookupApi
        .search(foodName)
        .then(setSuggestions)
        .catch(() => setSuggestions([]));
    }, 200);
    return () => clearTimeout(t);
  }, [foodName]);

  function selectSuggestion(item) {
    setFoodName(item.name);
    const qty = item.suggestedQuantity ?? 100;
    const cal = item.suggestedCalories ?? 0;
    const prot = item.suggestedProtein ?? 0;
    setQuantity(String(qty));
    setUnit(item.suggestedUnit || 'g');
    if (item.caloriesPer100 != null) {
      const factor = qty / 100;
      setCalories(String(Math.round(item.caloriesPer100 * factor * 10) / 10));
      setProtein(String(Math.round((item.proteinPer100 || 0) * factor * 10) / 10));
    } else if (item.caloriesPerUnit != null) {
      setCalories(String(Math.round((item.caloriesPerUnit || 0) * qty * 10) / 10));
      setProtein(String(Math.round((item.proteinPerUnit || 0) * qty * 10) / 10));
    } else {
      setCalories(String(cal));
      setProtein(String(prot));
    }
    setSuggestions([]);
  }

  useEffect(() => {
    if (!foodName.trim() || !quantity) return;
    const q = parseFloat(quantity);
    if (isNaN(q)) return;
    foodsLookupApi
      .calculate(foodName, q, unit)
      .then(({ calories: c, protein: p, found }) => {
        if (found) {
          setCalories(String(c));
          setProtein(String(p));
        }
      })
      .catch(() => {});
  }, [quantity, unit, foodName]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await foodApi.add({
        foodName: foodName.trim(),
        quantity: parseFloat(quantity) || 1,
        unit,
        calories: parseFloat(calories) || 0,
        protein: parseFloat(protein) || 0,
        date,
      });
      onSaved?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-slate-800">Log food</h3>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="relative">
        <label className="block text-sm text-slate-600 mb-1">Food name (search to auto-fill)</label>
        <input
          type="text"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          placeholder="e.g. Chicken breast, Eggs"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg max-h-48 overflow-y-auto">
            {suggestions.slice(0, 8).map((item, i) => (
              <li
                key={i}
                onClick={() => selectSuggestion(item)}
                className="px-3 py-2 cursor-pointer hover:bg-primary-50 text-slate-800"
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <label className="block">
          <span className="text-sm text-slate-600">Quantity</span>
          <input
            type="number"
            min="0"
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-600">Unit</span>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="g">g</option>
            <option value="ml">ml</option>
            <option value="piece">piece</option>
            <option value="serving">serving</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-slate-600">Calories</span>
          <input
            type="number"
            min="0"
            step="0.1"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-600">Protein (g)</span>
          <input
            type="number"
            min="0"
            step="0.1"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-slate-600">Date</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 max-w-xs"
        />
      </label>

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-primary-600 text-white px-4 py-2 text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Add food log'}
      </button>
    </form>
  );
}

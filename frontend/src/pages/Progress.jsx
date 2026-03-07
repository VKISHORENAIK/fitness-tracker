import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { progressApi } from '../api';
import { CardSkeleton } from '../components/LoadingSkeleton';

export default function Progress() {
  const [weekly, setWeekly] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    progressApi
      .getWeekly()
      .then((data) => setWeekly(data.weeklyData || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <div className="h-8 w-32 bg-neutral-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-64 bg-neutral-100 rounded animate-pulse" />
        </div>
        <div className="space-y-6">
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

  const data = (weekly || []).map((d) => ({
    ...d,
    shortDate: d.date
      ? new Date(d.date).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      : d.date,
  }));

  const chartColor = '#404040';
  const gridColor = '#e5e5e5';

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-ink tracking-tight">Progress</h1>
        <p className="text-ink-secondary mt-1">
          Last 7 days: calories, protein, and workout frequency.
        </p>
      </div>

      <div className="bg-surface-elevated rounded-2xl shadow-card p-6 border border-neutral-100">
        <h2 className="font-semibold text-ink text-sm mb-4">Weekly calories</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="shortDate" tick={{ fontSize: 12, fill: '#737373' }} />
              <YAxis tick={{ fontSize: 12, fill: '#737373' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e5e5e5',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
              />
              <Bar dataKey="calories" fill={chartColor} name="Calories" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-surface-elevated rounded-2xl shadow-card p-6 border border-neutral-100">
        <h2 className="font-semibold text-ink text-sm mb-4">Protein intake (g)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="shortDate" tick={{ fontSize: 12, fill: '#737373' }} />
              <YAxis tick={{ fontSize: 12, fill: '#737373' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e5e5e5',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="protein"
                stroke={chartColor}
                name="Protein (g)"
                strokeWidth={2}
                dot={{ r: 4, fill: chartColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-surface-elevated rounded-2xl shadow-card p-6 border border-neutral-100">
        <h2 className="font-semibold text-ink text-sm mb-4">Workout frequency</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="shortDate" tick={{ fontSize: 12, fill: '#737373' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#737373' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e5e5e5',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
              />
              <Bar dataKey="workoutCount" fill="#737373" name="Workouts" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

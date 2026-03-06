import { apiGet, apiPost, apiPut, apiDelete } from './client';

export const progressApi = {
  getDaily: (date) => apiGet(`/api/progress/daily${date ? `?date=${date}` : ''}`),
  getWeekly: () => apiGet('/api/progress/weekly'),
};

export const workoutsApi = {
  list: (from, to) => {
    let q = '';
    if (from) q += `from=${from}&`;
    if (to) q += `to=${to}`;
    return apiGet(`/api/workouts${q ? '?' + q : ''}`);
  },
  add: (data) => apiPost('/api/workouts', data),
  delete: (id) => apiDelete(`/api/workouts/${id}`),
};

export const foodApi = {
  list: (from, to) => {
    let q = '';
    if (from) q += `from=${from}&`;
    if (to) q += `to=${to}`;
    return apiGet(`/api/food${q ? '?' + q : ''}`);
  },
  add: (data) => apiPost('/api/food', data),
  delete: (id) => apiDelete(`/api/food/${id}`),
};

export const goalsApi = {
  get: () => apiGet('/api/goals'),
  update: (data) => apiPost('/api/goals', data),
};

export const calorieApi = {
  calculate: (data) => apiPost('/api/calorie/calculate', data),
  getGoals: () => apiGet('/api/calorie/goals'),
};

export const foodsLookupApi = {
  search: (q) => apiGet(`/api/foods-lookup/search${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  calculate: (foodName, quantity, unit) =>
    apiGet(
      `/api/foods-lookup/calculate?foodName=${encodeURIComponent(foodName || '')}&quantity=${quantity}&unit=${unit || 'g'}`
    ),
};

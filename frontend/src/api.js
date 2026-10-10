// On Vercel the backend URL comes from the VITE_API_URL environment variable;
// locally it falls back to the backend dev server.
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const getTodos = () => request('/todos');

export const addTodo = (title) =>
  request('/todos', { method: 'POST', body: JSON.stringify({ title }) });

export const toggleTodo = (todo) =>
  request(`/todos/${todo._id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed: !todo.completed }),
  });

export const deleteTodo = (id) => request(`/todos/${id}`, { method: 'DELETE' });

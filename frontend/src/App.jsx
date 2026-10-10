import { useEffect, useState } from 'react';
import { getTodos, addTodo, toggleTodo, deleteTodo } from './api';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() =>
        setError('Could not reach the API - is the backend running?')
      );
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const todo = await addTodo(title.trim());
      setTodos([todo, ...todos]);
      setTitle('');
      setError('');
    } catch {
      setError('Could not add the todo');
    }
  }

  async function handleToggle(todo) {
    try {
      const updated = await toggleTodo(todo);
      setTodos(todos.map((t) => (t._id === todo._id ? updated : t)));
    } catch {
      setError('Could not update the todo');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t._id !== id));
    } catch {
      setError('Could not delete the todo');
    }
  }

  return (
    <main className="app">
      <h1>Todo</h1>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          className="todo-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className={todo.completed ? 'done' : ''}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo)}
              />
              {todo.title}
            </label>
            <button className="delete" onClick={() => handleDelete(todo._id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && !error && (
        <p className="empty">Nothing yet - add your first todo.</p>
      )}
    </main>
  );
}

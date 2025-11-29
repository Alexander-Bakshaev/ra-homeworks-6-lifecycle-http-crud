import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import Note from "./components/Note";
import NoteForm from "./components/NoteForm";

const API_URL = "http://localhost:3000/notes";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadNotes = async () => {
    const startTime = Date.now();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch notes");
      const data = await response.json();
      
      // Гарантируем, что состояние загрузки отображается минимум 500 мс
      const timeElapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 500 - timeElapsed);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (content) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 0, content }),
      });
      if (!response.ok) throw new Error("Failed to add note");
      await loadNotes();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, { 
        method: "DELETE" 
      });
      if (!response.ok) throw new Error("Failed to delete note");
      await loadNotes();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="app">
      <h1>
        Notes
        <button 
          className="refresh-btn" 
          onClick={loadNotes} 
          title="Refresh"
          disabled={loading}
        >
          <FiRefreshCw className={loading ? 'spin' : ''} />
        </button>
      </h1>

      {error && <div className="error-message">{error}</div>}

      {loading && !notes.length ? (
        <div className="loading">Loading notes...</div>
      ) : (
        <div className="notes-container">
          {notes.map((note) => (
            <Note key={note.id} {...note} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <NoteForm onAdd={handleAdd} disabled={loading} />
    </div>
  );
}

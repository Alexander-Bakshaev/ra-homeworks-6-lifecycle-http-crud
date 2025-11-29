import { useState } from "react";
import { FiPlus } from "react-icons/fi";

export default function NoteForm({ onAdd, disabled }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value);
    setValue("");
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <label htmlFor="new-note">New Note</label>
      <textarea
        id="new-note"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder="Enter your note here..."
      />
      <div className="form-footer">
        <button 
          type="submit" 
          className="add-note-btn"
          title="Add note"
          disabled={!value.trim() || disabled}
        >
          <FiPlus className={`icon ${disabled ? 'spin' : ''}`} />
        </button>
      </div>
    </form>
  );
}

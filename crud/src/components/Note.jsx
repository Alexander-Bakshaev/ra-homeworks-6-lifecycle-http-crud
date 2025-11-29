export default function Note({ id, content, onDelete }) {
  return (
    <div className="note">
      <button 
        className="close-btn" 
        onClick={() => onDelete(id)} 
        title="Delete"
      >
        ✖
      </button>
      <div className="note-content">
        {content.split('\n').map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}

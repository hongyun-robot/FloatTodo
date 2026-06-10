import { useState, useRef, useEffect } from "react";
import type { TodoItem } from "../types";

interface Props {
  item: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export function TodoItemView({ item, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function saveEdit() {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== item.text) {
      onEdit(item.id, trimmed);
    } else {
      setEditText(item.text);
    }
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") {
      setEditText(item.text);
      setEditing(false);
    }
  }

  return (
    <div className={`todo-item${item.completed ? " completed" : ""}`}>
      <div
        className={`todo-checkbox${item.completed ? " checked" : ""}`}
        onClick={() => onToggle(item.id)}
      >
        {item.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6l2.5 2.5L9.5 3.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {editing ? (
        <input
          ref={inputRef}
          className="todo-edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          className="todo-text"
          onDoubleClick={() => setEditing(true)}
        >
          {item.text}
        </span>
      )}
      <button
        className="todo-delete-btn"
        onClick={() => onDelete(item.id)}
        aria-label="删除"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

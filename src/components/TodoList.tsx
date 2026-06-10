import type { TodoItem } from "../types";
import { TodoItemView } from "./TodoItem";

interface Props {
  items: TodoItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onClearCompleted: () => void;
  completedCount: number;
}

export function TodoList({ items, onToggle, onDelete, onEdit, onClearCompleted, completedCount }: Props) {
  const sorted = [...items].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.createdAt - b.createdAt;
  });

  if (items.length === 0) {
    return (
      <div className="todo-empty">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="6" width="24" height="20" rx="4" stroke="#C6C6C8" strokeWidth="1.5" />
          <line x1="10" y1="14" x2="22" y2="14" stroke="#C6C6C8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="18" x2="18" y2="18" stroke="#C6C6C8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p className="todo-empty-title">暂无任务</p>
        <p className="todo-empty-subtitle">在上方输入框添加新任务</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      <div className="todo-items">
        {sorted.map((item) => (
          <TodoItemView
            key={item.id}
            item={item}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
      {completedCount > 0 && (
        <div className="todo-footer">
          <button className="todo-clear-btn" onClick={onClearCompleted}>
            清除已完成 ({completedCount})
          </button>
        </div>
      )}
    </div>
  );
}

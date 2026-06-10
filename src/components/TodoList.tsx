import { useState, useRef, useCallback } from "react";
import type { TodoItem } from "../types";
import { TodoItemView } from "./TodoItem";

interface Props {
  items: TodoItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onClearCompleted: () => void;
  onMoveItem: (fromIndex: number, toIndex: number) => void;
  completedCount: number;
}

function sortItems(items: TodoItem[]): TodoItem[] {
  return [...items].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.order - b.order;
  });
}

export function TodoList({ items, onToggle, onDelete, onEdit, onClearCompleted, onMoveItem, completedCount }: Props) {
  const sorted = sortItems(items);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef({ sorted, onMoveItem });
  ctxRef.current = { sorted, onMoveItem };
  const overRef = useRef<number | null>(null);

  const handlePointerDown = useCallback((index: number, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const container = containerRef.current;
    if (!container) return;

    const wrappers = container.querySelectorAll<HTMLElement>(".todo-item-wrapper");
    const el = wrappers[index];
    if (!el) return;

    const startY = e.clientY;
    let lastOffset = 0;
    let raf = 0;

    // Visual: mark element as dragging
    el.style.position = "relative";
    el.style.zIndex = "10";
    el.style.opacity = "0.65";
    el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
    el.style.borderRadius = "10px";
    el.style.background = "var(--bg-card)";

    document.documentElement.style.setProperty("overflow", "visible", "important");
    document.body.style.setProperty("overflow", "visible", "important");

    function onMove(ev: PointerEvent) {
      lastOffset = ev.clientY - startY;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translateY(${lastOffset}px)`;

        // Find target position
        const cur = ctxRef.current.sorted;
        const all = container!.querySelectorAll<HTMLElement>(".todo-item-wrapper");
        let target: number | null = null;

        for (let i = 0; i < all.length; i++) {
          if (i === index) continue; // skip dragged item
          const r = all[i].getBoundingClientRect();
          if (ev.clientY >= r.top && ev.clientY <= r.bottom) {
            target = ev.clientY < r.top + r.height / 2 ? i : i + 1;
            break;
          }
        }

        if (target === null) {
          const first = all[0].getBoundingClientRect();
          const last = all[all.length - 1].getBoundingClientRect();
          if (ev.clientY < first.top) target = 0;
          else if (ev.clientY > last.bottom) target = all.length;
        }

        if (target === null) {
          overRef.current = null;
          setOverIndex(null);
          return;
        }

        const dropIdx = target > index ? target - 1 : target;
        if (dropIdx >= 0 && dropIdx < cur.length
          && cur[index].completed === cur[dropIdx].completed) {
          overRef.current = target;
          setOverIndex(target);
        } else {
          overRef.current = null;
          setOverIndex(null);
        }
      });
    }

    function onUp(ev: PointerEvent) {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.style.removeProperty("overflow");
      document.body.style.removeProperty("overflow");

      const cur = ctxRef.current.sorted;
      const move = ctxRef.current.onMoveItem;
      const all = container!.querySelectorAll<HTMLElement>(".todo-item-wrapper");

      // Compute target directly (not from stale rAF callback)
      let target: number | null = null;
      for (let i = 0; i < all.length; i++) {
        if (i === index) continue;
        const r = all[i].getBoundingClientRect();
        if (ev.clientY >= r.top && ev.clientY <= r.bottom) {
          target = ev.clientY < r.top + r.height / 2 ? i : i + 1;
          break;
        }
      }
      if (target === null) {
        const first = all[0].getBoundingClientRect();
        const last = all[all.length - 1].getBoundingClientRect();
        if (ev.clientY < first.top) target = 0;
        else if (ev.clientY > last.bottom) target = all.length;
      }

      const dropIdx = target !== null && target !== index && target !== index + 1
        ? (target > index ? target - 1 : target)
        : null;

      if (dropIdx !== null
        && dropIdx >= 0 && dropIdx < cur.length
        && cur[index].completed === cur[dropIdx].completed) {

        const fromRect = all[index].getBoundingClientRect();
        const toRect = all[dropIdx].getBoundingClientRect();
        const snapTo = toRect.top - fromRect.top + lastOffset;

        el.style.transition = "transform 0.2s ease";
        el.style.transform = `translateY(${snapTo}px)`;

        setTimeout(() => {
          move(index, dropIdx);
          resetEl(el);
          setOverIndex(null);
        }, 200);
        return;
      }

      // No valid target: animate back
      el.style.transition = "transform 0.2s ease";
      el.style.transform = "translateY(0px)";
      setTimeout(() => {
        resetEl(el);
        setOverIndex(null);
      }, 200);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, []);

  function resetEl(el: HTMLElement) {
    el.style.position = "";
    el.style.zIndex = "";
    el.style.opacity = "";
    el.style.boxShadow = "";
    el.style.borderRadius = "";
    el.style.background = "";
    el.style.transform = "";
    el.style.transition = "";
    overRef.current = null;
  }

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
      <div className="todo-items" ref={containerRef}>
        {sorted.map((item, i) => {
          const showDropAbove = overIndex === i;
          const showDropBelow = overIndex === sorted.length && i === sorted.length - 1;

          return (
            <div
              key={item.id}
              className={`todo-item-wrapper${showDropAbove ? " drop-target" : ""}${showDropBelow ? " drop-below" : ""}`}
            >
              <TodoItemView
                item={item}
                index={i}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
                onPointerDown={handlePointerDown}
              />
            </div>
          );
        })}
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

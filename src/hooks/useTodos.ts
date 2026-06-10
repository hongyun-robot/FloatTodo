import { useState, useEffect, useCallback } from "react";
import type { TodoItem } from "../types";

const STORAGE_KEY = "floattodo-items";

function loadItems(): TodoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveItems(items: TodoItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useTodos() {
  const [items, setItems] = useState<TodoItem[]>(loadItems);

  useEffect(() => {
    saveItems(items);
  }, [items]);

  const addTodo = useCallback((text: string) => {
    setItems((prev) => [
      { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now(), order: Date.now() },
      ...prev,
    ]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const editTodo = useCallback((id: string, text: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text } : item))
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setItems((prev) => prev.filter((item) => !item.completed));
  }, []);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    setItems((prev) => {
      const incomplete = prev.filter((i) => !i.completed).sort((a, b) => a.order - b.order);
      const completed = prev.filter((i) => i.completed).sort((a, b) => a.order - b.order);
      const sorted = [...incomplete, ...completed];

      if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0
        || fromIndex >= sorted.length || toIndex >= sorted.length) {
        return prev;
      }

      const [moved] = sorted.splice(fromIndex, 1);
      sorted.splice(toIndex, 0, moved);

      const orders = new Map<string, number>();
      sorted.forEach((item, i) => orders.set(item.id, (i + 1) * 1000));

      return prev.map((item) => {
        const newOrder = orders.get(item.id);
        return newOrder !== undefined ? { ...item, order: newOrder } : item;
      });
    });
  }, []);

  const completedCount = items.filter((i) => i.completed).length;

  return { items, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted, moveItem, completedCount };
}

import { useTodos } from "./hooks/useTodos";
import { useWindowControls } from "./hooks/useWindowControls";
import { TitleBar } from "./components/TitleBar";
import { TodoInput } from "./components/TodoInput";
import { TodoList } from "./components/TodoList";
import { ResizeHandle } from "./components/ResizeHandle";
import "./App.css";

function App() {
  const { items, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted, completedCount } = useTodos();
  const { isPinned, togglePin, minimize, close } = useWindowControls();

  return (
    <div className="app-container">
      <TitleBar isPinned={isPinned} onTogglePin={togglePin} onMinimize={minimize} onClose={close} />
      <div className="app-content">
        <TodoInput onAdd={addTodo} />
        <TodoList
          items={items}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
          onClearCompleted={clearCompleted}
          completedCount={completedCount}
        />
      </div>
      <ResizeHandle />
    </div>
  );
}

export default App;

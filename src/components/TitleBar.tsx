import { getCurrentWindow } from "@tauri-apps/api/window";

interface Props {
  isPinned: boolean;
  onTogglePin: () => void;
  onMinimize: () => void;
  onClose: () => void;
}

export function TitleBar({ isPinned, onTogglePin, onMinimize, onClose }: Props) {
  const appWindow = getCurrentWindow();

  function handleDragStart(e: React.PointerEvent) {
    const target = e.target as HTMLElement;
    if (target.closest(".window-control")) return;
    appWindow.startDragging();
  }

  return (
    <div className="titlebar" onPointerDown={handleDragStart}>
      <div className="titlebar-drag-region">
        <span className="titlebar-text">FloatTodo</span>
      </div>
      <div className="titlebar-controls">
        <button
          className={`window-control pin-btn${isPinned ? " active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
          aria-label="置顶"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1C4 1 2.5 2.5 2.5 4.5C2.5 7.3 6 11 6 11S9.5 7.3 9.5 4.5C9.5 2.5 8 1 6 1Z"
              fill={isPinned ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle cx="6" cy="4.5" r="1" fill={isPinned ? "#fff" : "currentColor"} />
          </svg>
        </button>
        <button
          className="window-control minimize-btn"
          onClick={(e) => { e.stopPropagation(); onMinimize(); }}
          aria-label="最小化"
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <line x1="2" y1="5" x2="8" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <button
          className="window-control close-btn"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="关闭"
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

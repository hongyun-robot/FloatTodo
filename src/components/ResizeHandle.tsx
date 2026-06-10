import { getCurrentWindow } from "@tauri-apps/api/window";

export function ResizeHandle() {
  function handleResizeStart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    getCurrentWindow().startResizeDragging("SouthEast");
  }

  return (
    <div className="resize-handle" onMouseDown={handleResizeStart}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M11 1v10H1" stroke="#C6C6C8" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 6v5H6" stroke="#C6C6C8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

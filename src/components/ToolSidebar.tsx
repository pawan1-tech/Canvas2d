import type { Tool } from '../types/canvas';

interface ToolSidebarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  onDelete: () => void;
  onClear: () => void;
}

export default function ToolSidebar({ activeTool, onToolChange, onDelete, onClear }: ToolSidebarProps) {
  return (
    <aside className="w-20 bg-white border-r flex flex-col items-center py-4 gap-2">
      <div className="text-xs text-gray-500 mb-2 font-medium">Tools</div>
      
      {/* Select Tool */}
      <button
        onClick={() => onToolChange('select')}
        className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all ${
          activeTool === 'select' ? 'bg-brand-100 text-brand-700 shadow-sm' : 'hover:bg-gray-100 text-gray-600'
        }`}
        title="Select (V)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      </button>

      <div className="w-10 h-px bg-gray-200 my-1"></div>

      {/* Rectangle Tool */}
      <button
        onClick={() => onToolChange('rect')}
        className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all ${
          activeTool === 'rect' ? 'bg-brand-100 text-brand-700 shadow-sm' : 'hover:bg-gray-100 text-gray-600'
        }`}
        title="Rectangle (R)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="4" y="6" width="16" height="12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Circle Tool */}
      <button
        onClick={() => onToolChange('circle')}
        className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all ${
          activeTool === 'circle' ? 'bg-brand-100 text-brand-700 shadow-sm' : 'hover:bg-gray-100 text-gray-600'
        }`}
        title="Circle (C)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" strokeWidth={2} />
        </svg>
      </button>

      {/* Text Tool */}
      <button
        onClick={() => onToolChange('text')}
        className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all ${
          activeTool === 'text' ? 'bg-brand-100 text-brand-700 shadow-sm' : 'hover:bg-gray-100 text-gray-600'
        }`}
        title="Text (T)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      </button>

      {/* Pen Tool */}
      <button
        onClick={() => onToolChange('pen')}
        className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all ${
          activeTool === 'pen' ? 'bg-brand-100 text-brand-700 shadow-sm' : 'hover:bg-gray-100 text-gray-600'
        }`}
        title="Pen (P)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>

      <div className="w-10 h-px bg-gray-200 my-1"></div>

      {/* Delete Tool */}
      <button
        onClick={onDelete}
        className="w-14 h-14 rounded-lg flex items-center justify-center transition-all hover:bg-red-50 text-gray-600 hover:text-red-600"
        title="Delete (Del)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {/* Clear Canvas Tool */}
      <button
        onClick={onClear}
        className="w-14 h-14 rounded-lg flex items-center justify-center transition-all hover:bg-red-50 text-gray-600 hover:text-red-600"
        title="Clear Canvas"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </aside>
  );
}

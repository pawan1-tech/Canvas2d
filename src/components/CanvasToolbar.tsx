interface CanvasToolbarProps {
  fillColor: string;
  strokeColor: string;
  zoom: number;
  showGrid: boolean;
  onFillColorChange: (color: string) => void;
  onStrokeColorChange: (color: string) => void;
  onZoomChange: (direction: 'in' | 'out' | 'reset') => void;
  onGridToggle: () => void;
}

export default function CanvasToolbar({
  fillColor,
  strokeColor,
  zoom,
  showGrid,
  onFillColorChange,
  onStrokeColorChange,
  onZoomChange,
  onGridToggle,
}: CanvasToolbarProps) {
  return (
    <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Fill Color */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Fill</span>
          <input
            type="color"
            value={fillColor}
            onChange={(e) => onFillColorChange(e.target.value)}
            className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
          />
        </div>

        {/* Stroke Color */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Stroke</span>
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => onStrokeColorChange(e.target.value)}
            className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
          />
        </div>

        <div className="h-8 w-px bg-gray-200"></div>

        {/* Grid Toggle */}
        <button
          onClick={onGridToggle}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            showGrid ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Toggle Grid"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onZoomChange('out')}
          disabled={zoom <= 25}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Zoom Out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>
        <span className="text-xs font-medium text-gray-600 min-w-[3rem] text-center">{zoom}%</span>
        <button
          onClick={() => onZoomChange('in')}
          disabled={zoom >= 200}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Zoom In"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
        </button>
        <button
          onClick={() => onZoomChange('reset')}
          className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Reset Zoom"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

interface StatusBarProps {
  selectedObject: { type?: string; width?: number; height?: number } | null;
  zoom: number;
}

export default function StatusBar({ selectedObject, zoom }: StatusBarProps) {
  return (
    <div className="bg-white border-t px-4 py-2 flex items-center justify-between text-xs text-gray-600">
      <div>
        {selectedObject ? (
          <span>
            Selected: {selectedObject.type || 'Object'}{' '}
            {selectedObject.width && selectedObject.height && (
              <>({Math.round(selectedObject.width)} × {Math.round(selectedObject.height)})</>
            )}
          </span>
        ) : (
          <span>No selection</span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span>Zoom: {zoom}%</span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-500">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Del</kbd> to delete • 
          <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono ml-1">Cmd+A</kbd> to select all
        </span>
      </div>
    </div>
  );
}

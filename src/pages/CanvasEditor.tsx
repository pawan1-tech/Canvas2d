import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCanvas, useCanvasTools } from '../hooks/useCanvas';
import ToolSidebar from '../components/ToolSidebar';
import CanvasToolbar from '../components/CanvasToolbar';
import StatusBar from '../components/StatusBar';
import { ErrorBoundary } from '../components/ErrorBoundary';
import type { Tool } from '../types/canvas';

function CanvasEditorContent() {
  const navigate = useNavigate();
  
  // State
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [fillColor, setFillColor] = useState<string>('#6366f1');
  const [strokeColor, setStrokeColor] = useState<string>('#111827');
  const [zoom, setZoom] = useState<number>(100);
  const [showGrid, setShowGrid] = useState(true);

  // Custom hooks
  const { canvasRef, fabricRef, canvasId, isLoading, isSaving, selectedObject, saveCanvas } = useCanvas(showGrid);
  const { configureDrawingMode, addRect, addCircle, addText, deleteSelected, clearCanvas, handleZoom } = useCanvasTools(
    fabricRef,
    fillColor,
    strokeColor
  );

  // Configure drawing mode when tool changes
  useEffect(() => {
    configureDrawingMode(activeTool);
  }, [activeTool, strokeColor, configureDrawingMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const isInputElement = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName);

      // Delete selected objects
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInputElement) {
        e.preventDefault();
        deleteSelected();
      }
      // Tool shortcuts (only when not in input)
      if (!isInputElement && !e.metaKey && !e.ctrlKey) {
        if (e.key === 'v') setActiveTool('select');
        if (e.key === 'r') addRect();
        if (e.key === 'c') addCircle();
        if (e.key === 't') addText();
        if (e.key === 'p') setActiveTool('pen');
      }
      // Save (Cmd/Ctrl + S)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveCanvas();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fabricRef, canvasId, addRect, addCircle, addText, deleteSelected, saveCanvas]);

  // Tool change handler
  const handleToolChange = (tool: Tool) => {
    setActiveTool(tool);
    if (tool === 'select' && fabricRef.current) {
      fabricRef.current.isDrawingMode = false;
    }
    if (tool === 'rect') addRect();
    if (tool === 'circle') addCircle();
    if (tool === 'text') addText();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Navigation */}
      <header className="border-b bg-white shadow-sm z-20">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-700 text-white grid place-items-center shadow-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900">Canvas2D</span>
            </button>
            <div className="h-6 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Canvas</span>
              <span className="text-sm font-mono text-gray-400">#{canvasId?.slice(0, 8)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={saveCanvas}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium shadow-sm transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Canvas Toolbar */}
      <CanvasToolbar
        fillColor={fillColor}
        strokeColor={strokeColor}
        zoom={zoom}
        showGrid={showGrid}
        onFillColorChange={setFillColor}
        onStrokeColorChange={setStrokeColor}
        onZoomChange={(direction) => handleZoom(zoom, direction, setZoom)}
        onGridToggle={() => setShowGrid(!showGrid)}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tool Sidebar */}
        <ToolSidebar
          activeTool={activeTool}
          onToolChange={handleToolChange}
          onDelete={deleteSelected}
          onClear={() => clearCanvas(showGrid)}
        />

        {/* Canvas Container */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <div className="text-center">
                <svg className="w-8 h-8 animate-spin text-brand-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-sm text-gray-600">Loading canvas...</p>
              </div>
            </div>
          )}
          <canvas ref={canvasRef} className="block" />
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar selectedObject={selectedObject} zoom={zoom} />
    </div>
  );
}

export default function CanvasEditor() {
  return (
    <ErrorBoundary>
      <CanvasEditorContent />
    </ErrorBoundary>
  );
}

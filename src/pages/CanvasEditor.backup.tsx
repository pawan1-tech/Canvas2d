import { Component, useEffect, useRef, useState } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Canvas, Rect, Circle, IText, PencilBrush, FabricObject } from 'fabric';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, serverTimestamp, updateDoc, setDoc } from 'firebase/firestore';

type Tool = 'select' | 'rect' | 'circle' | 'text' | 'pen';

// Helper function to clean data for Firestore (remove undefined values and handle nested arrays)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cleanForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  
  if (Array.isArray(obj)) {
    // Convert nested arrays to objects with indices as keys
    const hasNestedArrays = obj.some((item: unknown) => Array.isArray(item));
    if (hasNestedArrays) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cleaned: Record<string, any> = {};
      obj.forEach((item: unknown, index: number) => {
        cleaned[`item_${index}`] = cleanForFirestore(item);
      });
      return cleaned;
    }
    return obj.map(cleanForFirestore);
  }
  
  if (typeof obj === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleaned: Record<string, any> = {};
    for (const key in obj) {
      if (obj[key] !== undefined) {
        cleaned[key] = cleanForFirestore(obj[key]);
      }
    }
    return cleaned;
  }
  
  return obj;
}

export default function CanvasEditor() {
  const { canvasId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [fillColor, setFillColor] = useState<string>('#6366f1');
  const [strokeColor, setStrokeColor] = useState<string>('#111827');
  const [zoom, setZoom] = useState<number>(100);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const parent = canvasRef.current.parentElement;
    if (!parent) return;
    
    const rect = parent.getBoundingClientRect();
    const initialWidth = Math.floor(rect.width) || 800;
    const initialHeight = Math.floor(rect.height) || 600;
    
    const canvas = new Canvas(canvasRef.current as HTMLCanvasElement, {
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
      width: initialWidth,
      height: initialHeight,
    });
    
    fabricRef.current = canvas;

    // Track selection changes
    canvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });
    canvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });
    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    const resize = () => {
      const parent = canvasRef.current?.parentElement;
      if (!parent || !canvas) return;
      
      const rect = parent.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);
      
      if (width > 0 && height > 0) {
        canvas.setWidth(width);
        canvas.setHeight(height);
        canvas.renderAll();
      }
    };
    
    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.dispose();
    };
  }, []); // Remove showGrid dependency

  // Separate effect for grid background
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.backgroundColor = showGrid ? '#fafafa' : '#ffffff';
      fabricRef.current.renderAll();
    }
  }, [showGrid]);

  // Keyboard shortcuts effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      // Delete selected objects
      if ((e.key === 'Delete' || e.key === 'Backspace') && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        const activeObjects = canvas.getActiveObjects();
        activeObjects.forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
      // Select tool (V)
      if (e.key === 'v' && !e.metaKey && !e.ctrlKey) {
        setActiveTool('select');
      }
      // Rectangle (R)
      if (e.key === 'r' && !e.metaKey && !e.ctrlKey) {
        const rect = new Rect({
          left: 100,
          top: 100,
          width: 140,
          height: 100,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: 2,
        });
        canvas.add(rect);
      }
      // Circle (C)
      if (e.key === 'c' && !e.metaKey && !e.ctrlKey) {
        const circle = new Circle({
          left: 140,
          top: 140,
          radius: 56,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: 2,
        });
        canvas.add(circle);
      }
      // Text (T)
      if (e.key === 't' && !e.metaKey && !e.ctrlKey) {
        const text = new IText('Edit me', {
          left: 160,
          top: 160,
          fill: strokeColor,
          fontSize: 28,
          fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        });
        canvas.add(text);
      }
      // Pen (P)
      if (e.key === 'p' && !e.metaKey && !e.ctrlKey) {
        setActiveTool('pen');
      }
      // Save (Cmd/Ctrl + S)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (!canvasId) return;
        const json = canvas.toJSON();
        const cleanedJson = JSON.parse(JSON.stringify(json));
        updateDoc(doc(db, 'canvases', canvasId), {
          data: cleanedJson,
          updatedAt: serverTimestamp(),
        }).then(() => console.log('✅ Canvas saved')).catch((error) => console.error('❌ Save failed:', error));
      }
      // Undo (Cmd/Ctrl + Z)
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fillColor, strokeColor, canvasId, showGrid]);

  useEffect(() => {
    if (!fabricRef.current || !canvasId) return;
    (async () => {
      setIsLoading(true);
      try {
        const snap = await getDoc(doc(db, 'canvases', canvasId));
        const data = snap.data();
        if (data?.data) {
          fabricRef.current?.loadFromJSON(data.data, () => {
            fabricRef.current?.renderAll();
            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load canvas:', error);
        setIsLoading(false);
      }
    })();
  }, [canvasId]);

  useEffect(() => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    canvas.isDrawingMode = activeTool === 'pen';
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = strokeColor;
      canvas.freeDrawingBrush.width = 2;
    }
  }, [activeTool, strokeColor]);

  const addRect = () => {
    if (!fabricRef.current) return;
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 140,
      height: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: 2,
    });
    fabricRef.current.add(rect);
  };

  const addCircle = () => {
    if (!fabricRef.current) return;
    const circle = new Circle({
      left: 140,
      top: 140,
      radius: 56,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: 2,
    });
    fabricRef.current.add(circle);
  };

  const addText = () => {
    if (!fabricRef.current) return;
    const text = new IText('Edit me', {
      left: 160,
      top: 160,
      fill: strokeColor,
      fontSize: 28,
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    });
    fabricRef.current.add(text);
  };

  const deleteSelected = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  const save = async () => {
    if (!fabricRef.current || !canvasId) return;
    setIsSaving(true);
    try {
      const json = fabricRef.current.toJSON();
      // Clean the JSON to remove undefined values and handle nested arrays
      const cleanedJson = cleanForFirestore(json);
      
      const docRef = doc(db, 'canvases', canvasId);
    
      try {
        await updateDoc(docRef, {
          data: cleanedJson,
          updatedAt: serverTimestamp(),
        });
        console.log('✅ Canvas saved');
      } catch {
        console.log('📝 Document not found, creating new one...');
        await setDoc(docRef, {
          data: cleanedJson,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        console.log('✅ Canvas created and saved');
      }
    } catch (error) {
      console.error('❌ Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    let newZoom = zoom;
    
    if (direction === 'in' && zoom < 200) {
      newZoom = Math.min(200, zoom + 25);
    } else if (direction === 'out' && zoom > 25) {
      newZoom = Math.max(25, zoom - 25);
    } else if (direction === 'reset') {
      newZoom = 100;
    }
    
    setZoom(newZoom);
    canvas.setZoom(newZoom / 100);
    canvas.renderAll();
  };

  const clearCanvas = () => {
    if (!fabricRef.current) return;
    if (confirm('Are you sure you want to clear the entire canvas?')) {
      fabricRef.current.clear();
      fabricRef.current.backgroundColor = showGrid ? '#fafafa' : '#ffffff';
      fabricRef.current.renderAll();
    }
  };

  const onColorChange = (type: 'fill' | 'stroke', value: string) => {
    if (type === 'fill') setFillColor(value);
    if (type === 'stroke') setStrokeColor(value);
    const canvas = fabricRef.current;
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (!obj) return;
    if (type === 'fill' && 'set' in obj) (obj as FabricObject).set({ fill: value });
    if (type === 'stroke' && 'set' in obj) (obj as FabricObject).set({ stroke: value });
    canvas.requestRenderAll();
  };

  const handleUndo = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    // Fabric.js doesn't have built-in undo, but you can track history
    console.log('Undo not yet implemented');
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
              onClick={save}
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

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <aside className="w-20 bg-white border-r flex flex-col items-center py-4 gap-2">
          <div className="text-xs text-gray-500 mb-2 font-medium">Tools</div>
          
          <button
            onClick={() => setActiveTool('select')}
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

          <button
            onClick={addRect}
            className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all ${
              activeTool === 'rect' ? 'bg-brand-100 text-brand-700 shadow-sm' : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Rectangle (R)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="4" y="6" width="16" height="12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            onClick={addCircle}
            className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all ${
              activeTool === 'circle' ? 'bg-brand-100 text-brand-700 shadow-sm' : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Circle (C)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" strokeWidth={2} />
            </svg>
          </button>

          <button
            onClick={addText}
            className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all ${
              activeTool === 'text' ? 'bg-brand-100 text-brand-700 shadow-sm' : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Text (T)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </button>

          <button
            onClick={() => setActiveTool('pen')}
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

          <button
            onClick={deleteSelected}
            className="w-14 h-14 rounded-lg flex items-center justify-center transition-all hover:bg-red-50 text-gray-600 hover:text-red-600"
            title="Delete (Del)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          <button
            onClick={clearCanvas}
            className="w-14 h-14 rounded-lg flex items-center justify-center transition-all hover:bg-red-50 text-gray-600 hover:text-red-600"
            title="Clear Canvas"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Toolbar */}
          <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">Fill</span>
                <input
                  type="color"
                  value={fillColor}
                  onChange={(e) => onColorChange('fill', e.target.value)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">Stroke</span>
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => onColorChange('stroke', e.target.value)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                />
              </div>

              <div className="h-8 w-px bg-gray-200"></div>

              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  showGrid ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleZoom('out')}
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
                onClick={() => handleZoom('in')}
                disabled={zoom >= 200}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Zoom In"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </button>
              <button
                onClick={() => handleZoom('reset')}
                className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Reset Zoom"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Canvas Container */}
          <div 
            className="flex-1 bg-gray-50 p-4" 
            style={{ 
              backgroundImage: showGrid 
                ? 'radial-gradient(circle, #d1d5db 1px, transparent 1px)' 
                : 'none',
              backgroundSize: showGrid ? '20px 20px' : 'auto'
            }}
          >
            <div className="w-full h-full bg-white rounded-lg shadow-lg border-2 border-gray-200 relative">
              <div className="absolute inset-0">
                <canvas ref={canvasRef} />
              </div>
            </div>

            {isLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading canvas...</p>
                </div>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="bg-white border-t px-4 py-2 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>
                {selectedObject ? `Selected: ${(selectedObject as FabricObject).type || 'Object'}` : 'No selection'}
              </span>
              <span className="text-gray-300">|</span>
              <span>Zoom: {zoom}%</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-gray-100 rounded border text-[10px]">V</kbd>
              <kbd className="px-2 py-1 bg-gray-100 rounded border text-[10px]">R</kbd>
              <kbd className="px-2 py-1 bg-gray-100 rounded border text-[10px]">C</kbd>
              <kbd className="px-2 py-1 bg-gray-100 rounded border text-[10px]">T</kbd>
              <kbd className="px-2 py-1 bg-gray-100 rounded border text-[10px]">P</kbd>
              <span className="text-gray-300 mx-1">|</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded border text-[10px]">⌘S</kbd>
              <span>Save</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

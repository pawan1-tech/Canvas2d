import { useEffect, useRef, useState } from 'react';
import { Canvas, PencilBrush, Rect, Circle, IText } from 'fabric';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, serverTimestamp, updateDoc, setDoc } from 'firebase/firestore';
import { cleanForFirestore } from '../utils/firestore';

/**
 * Custom hook to manage Fabric.js canvas lifecycle
 * Handles initialization, loading, saving, and cleanup
 */
export function useCanvas(showGrid: boolean) {
  const { canvasId } = useParams();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedObject, setSelectedObject] = useState<{ type?: string; width?: number; height?: number } | null>(null);

  // Initialize canvas
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
      const obj = e.selected?.[0];
      setSelectedObject(obj ? { type: obj.type, width: obj.width, height: obj.height } : null);
    });
    canvas.on('selection:updated', (e) => {
      const obj = e.selected?.[0];
      setSelectedObject(obj ? { type: obj.type, width: obj.width, height: obj.height } : null);
    });
    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    // Resize handler
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
  }, []);

  // Update grid background
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.backgroundColor = showGrid ? '#fafafa' : '#ffffff';
      fabricRef.current.renderAll();
    }
  }, [showGrid]);

  // Load canvas data from Firestore
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

  // Save canvas to Firestore
  const saveCanvas = async () => {
    if (!fabricRef.current || !canvasId) return;
    setIsSaving(true);
    try {
      const json = fabricRef.current.toJSON();
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

  return {
    canvasRef,
    fabricRef,
    canvasId,
    isLoading,
    isSaving,
    selectedObject,
    saveCanvas,
  };
}

/**
 * Custom hook to manage drawing tools and canvas interactions
 */
export function useCanvasTools(
  fabricRef: React.MutableRefObject<Canvas | null>,
  fillColor: string,
  strokeColor: string
) {
  // Configure drawing mode based on active tool
  const configureDrawingMode = (tool: string) => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    
    canvas.isDrawingMode = tool === 'pen';
    if (tool === 'pen') {
      canvas.freeDrawingBrush = new PencilBrush(canvas);
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = strokeColor;
        canvas.freeDrawingBrush.width = 2;
      }
    }
  };

  // Add rectangle
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

  // Add circle
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

  // Add text
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

  // Delete selected objects
  const deleteSelected = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  // Clear entire canvas
  const clearCanvas = (showGrid: boolean) => {
    if (!fabricRef.current) return;
    if (confirm('Are you sure you want to clear the entire canvas?')) {
      fabricRef.current.clear();
      fabricRef.current.backgroundColor = showGrid ? '#fafafa' : '#ffffff';
      fabricRef.current.renderAll();
    }
  };

  // Handle zoom changes
  const handleZoom = (zoom: number, direction: 'in' | 'out' | 'reset', setZoom: (zoom: number) => void) => {
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

  return {
    configureDrawingMode,
    addRect,
    addCircle,
    addText,
    deleteSelected,
    clearCanvas,
    handleZoom,
  };
}

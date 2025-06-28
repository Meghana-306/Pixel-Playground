import React, { useRef, useEffect, useState, useCallback } from 'react';
import './App.css';

function App() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentLineWidth, setCurrentLineWidth] = useState(2);

  // Predefined color palette
  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#008000', '#000080',
    '#FF69B4', '#32CD32', '#FFD700', '#DC143C', '#4169E1'
  ];

  // Brush sizes
  const brushSizes = [1, 2, 5, 10, 15];

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas size to fill the container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      // Set drawing styles
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = currentColor;
      context.lineWidth = currentLineWidth;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [currentColor, currentLineWidth]);

  // Get mouse position relative to canvas
  const getMousePos = useCallback((canvas, e) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, []);

  // Get touch position relative to canvas
  const getTouchPos = useCallback((canvas, e) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  }, []);

  // Start drawing
  const startDrawing = useCallback((pos) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    setIsDrawing(true);
    context.strokeStyle = currentColor;
    context.lineWidth = currentLineWidth;
    context.beginPath();
    context.moveTo(pos.x, pos.y);
  }, [currentColor, currentLineWidth]);

  // Draw line
  const draw = useCallback((pos) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    context.lineTo(pos.x, pos.y);
    context.stroke();
  }, [isDrawing]);

  // Stop drawing
  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Mouse events
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const pos = getMousePos(canvas, e);
    startDrawing(pos);
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const pos = getMousePos(canvas, e);
    draw(pos);
  };

  const handleMouseUp = () => {
    stopDrawing();
  };

  // Touch events
  const handleTouchStart = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const pos = getTouchPos(canvas, e);
    startDrawing(pos);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const pos = getTouchPos(canvas, e);
    draw(pos);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    stopDrawing();
  };

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md p-4">
        <div className="flex flex-col space-y-4">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🎨 Pixel Playground</h1>
            <p className="text-gray-600">Draw, create, and express yourself!</p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Color Palette */}
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700 mr-2">Colors:</span>
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                    currentColor === color 
                      ? 'border-gray-800 shadow-lg scale-110' 
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>

            {/* Brush Size */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Brush:</span>
              {brushSizes.map((size) => (
                <button
                  key={size}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    currentLineWidth === size
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                  onClick={() => setCurrentLineWidth(size)}
                >
                  {size}px
                </button>
              ))}
            </div>

            {/* Clear Button */}
            <button
              className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 shadow-md hover:shadow-lg"
              onClick={clearCanvas}
            >
              🗑️ Clear Canvas
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 p-4">
        <div className="w-full h-full bg-white rounded-lg shadow-inner border-2 border-gray-200 overflow-hidden">
          <canvas
            ref={canvasRef}
            className="cursor-crosshair block"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              touchAction: 'none' // Prevent scrolling on touch devices
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 p-3 text-center">
        <p className="text-sm text-gray-500">
          💡 Tip: Use mouse or touch to draw • Select colors and brush sizes • Clear to start fresh
        </p>
      </div>
    </div>
  );
}

export default App;
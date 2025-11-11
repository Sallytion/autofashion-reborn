import React, { useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Interactive crop boundary with draggable handles
 * Displays a visual frame on the model that users can drag to crop
 */
export function CropBoundary({ 
  position = [0, 0, 0.5], 
  onCropChange 
}) {
  const { gl } = useThree();
  const [bounds, setBounds] = useState({
    top: 2,
    bottom: -2,
    left: -1.5,
    right: 1.5,
  });
  const [isDragging, setIsDragging] = useState(null);
  const dragStartRef = useRef({ point: null, bounds: null });

  // Create handles at each corner (simplified - just 4 corners)
  const handles = [
    { id: 'top-left', position: [bounds.left, bounds.top, 0], cursor: 'nwse-resize' },
    { id: 'top-right', position: [bounds.right, bounds.top, 0], cursor: 'nesw-resize' },
    { id: 'bottom-left', position: [bounds.left, bounds.bottom, 0], cursor: 'nesw-resize' },
    { id: 'bottom-right', position: [bounds.right, bounds.bottom, 0], cursor: 'nwse-resize' },
  ];

  const handlePointerDown = (e, handleId) => {
    e.stopPropagation();
    setIsDragging(handleId);
    dragStartRef.current = {
      point: e.point.clone(),
      bounds: { ...bounds }
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !dragStartRef.current.point) return;
    
    e.stopPropagation();
    const delta = {
      x: e.point.x - dragStartRef.current.point.x,
      y: e.point.y - dragStartRef.current.point.y
    };

    const newBounds = { ...dragStartRef.current.bounds };

    // Update bounds based on which corner is being dragged
    switch (isDragging) {
      case 'top-left':
        newBounds.top = Math.min(4, dragStartRef.current.bounds.top + delta.y);
        newBounds.left = Math.max(-3, dragStartRef.current.bounds.left + delta.x);
        break;
      case 'top-right':
        newBounds.top = Math.min(4, dragStartRef.current.bounds.top + delta.y);
        newBounds.right = Math.min(3, dragStartRef.current.bounds.right + delta.x);
        break;
      case 'bottom-left':
        newBounds.bottom = Math.max(-4, dragStartRef.current.bounds.bottom + delta.y);
        newBounds.left = Math.max(-3, dragStartRef.current.bounds.left + delta.x);
        break;
      case 'bottom-right':
        newBounds.bottom = Math.max(-4, dragStartRef.current.bounds.bottom + delta.y);
        newBounds.right = Math.min(3, dragStartRef.current.bounds.right + delta.x);
        break;
    }

    // Ensure bounds don't cross each other
    if (newBounds.top > newBounds.bottom && newBounds.right > newBounds.left) {
      setBounds(newBounds);
      
      // Convert bounds to crop values (0-1 normalized)
      const fullHeight = 8; // -4 to 4
      const fullWidth = 6; // -3 to 3
      
      const cropTop = (4 - newBounds.top) / fullHeight;
      const cropBottom = (newBounds.bottom + 4) / fullHeight;
      const cropLeft = (newBounds.left + 3) / fullWidth;
      const cropRight = (3 - newBounds.right) / fullWidth;

      onCropChange({
        top: Math.max(0, Math.min(0.9, cropTop)),
        bottom: Math.max(0, Math.min(0.9, cropBottom)),
        left: Math.max(0, Math.min(0.9, cropLeft)),
        right: Math.max(0, Math.min(0.9, cropRight)),
      });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(null);
    dragStartRef.current = { point: null, bounds: null };
    gl.domElement.style.cursor = 'auto';
  };

  return (
    <group position={position}>
      {/* Boundary frame lines using Line component */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={5}
            array={new Float32Array([
              bounds.left, bounds.top, 0,
              bounds.right, bounds.top, 0,
              bounds.right, bounds.bottom, 0,
              bounds.left, bounds.bottom, 0,
              bounds.left, bounds.top, 0,
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00ff00" linewidth={3} />
      </line>

      {/* Draggable corner handles - larger and more visible */}
      {handles.map((handle) => (
        <mesh
          key={handle.id}
          position={handle.position}
          onPointerDown={(e) => handlePointerDown(e, handle.id)}
          onPointerMove={isDragging === handle.id ? handlePointerMove : undefined}
          onPointerUp={handlePointerUp}
          onPointerOver={(e) => {
            e.stopPropagation();
            gl.domElement.style.cursor = handle.cursor;
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            if (!isDragging) gl.domElement.style.cursor = 'auto';
          }}
        >
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial 
            color={isDragging === handle.id ? "#ff0000" : "#00ff00"} 
            transparent={false}
          />
        </mesh>
      ))}
    </group>
  );
}

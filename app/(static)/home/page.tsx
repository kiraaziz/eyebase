"use client"
import React, { useState, useEffect } from 'react';

const CloudMotionMask = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e:any) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('https://thumbs.dreamstime.com/b/streaks-light-abstract-background-d-animation-48423403.jpg?w=400')` 
        }}
      />
      
      {/* Blurred overlay with cloud-like clear zone */}
      <div 
        className="absolute inset-0 backdrop-blur-md"
        style={{
          maskImage: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, transparent 20%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.7) 70%, black 100%)`,
          WebkitMaskImage: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, transparent 20%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.7) 70%, black 100%)`
        }}
      />
      
      {/* Content layer */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-4xl font-bold p-4 bg-opacity-30 rounded">
          Move your mouse to reveal the image
        </div>
      </div>
    </div>
  );
};

export default CloudMotionMask;
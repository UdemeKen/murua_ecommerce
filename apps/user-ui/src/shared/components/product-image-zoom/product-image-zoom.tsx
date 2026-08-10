"use client";

import React, { useState } from "react";

interface ProductImageZoomProps {
  image: string;
  alt?: string;
}

export default function ProductImageZoom({
  image,
  alt = "Product image",
}: ProductImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  const [position, setPosition] = useState({
    x: 50,
    y: 50,
  });

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x =
      ((e.clientX - rect.left) / rect.width) * 100;

    const y =
      ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div
        className="relative w-[300px] h-[300px] overflow-hidden bg-white border border-gray-200"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-contain"
        />

        {/* Magnifying Lens */}
        {isZoomed && (
          <div
            className="
              absolute
              pointer-events-none
              border
              border-gray-400
              bg-white/20
            "
            style={{
              width: "130px",
              height: "130px",
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </div>

      {/* Zoomed Image */}
      {isZoomed && (
        <div
          className="
            absolute
            left-[310px]
            top-0
            w-[400px]
            h-[400px]
            overflow-hidden
            bg-white
            border
            border-gray-200
            z-50
          "
          style={{
            backgroundImage: `url(${image})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "200% 200%",
            backgroundPosition: `${position.x}% ${position.y}%`,
          }}
        />
      )}
    </div>
  );
}
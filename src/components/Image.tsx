import React from "react";
import { Img } from "react-image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
}) => {
  return (
    <Img
      src={src}
      alt={alt}
      style={{ width, height }}
      className={className}
      loader={<div>Loading image…</div>}
    />
  );
};

export default OptimizedImage;

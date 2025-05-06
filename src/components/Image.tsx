import React from "react";
import { Img } from "react-image";

const placeholderSrc = "https://picsum.photos/seed/640/425.webp?random,blur";

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
      loader={<img src={placeholderSrc} alt="placeholder" />}
    />
  );
};

export default OptimizedImage;

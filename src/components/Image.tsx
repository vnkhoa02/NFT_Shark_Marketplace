import React from "react";
import { Img } from "react-image";
import { Skeleton } from "~/components/ui/skeleton";

function SkeletonCard() {
  return (
    <div>
      <Skeleton className="h-[200px] w-full rounded-lg" />
    </div>
  );
}

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
      loader={<SkeletonCard />}
    />
  );
};

export default OptimizedImage;

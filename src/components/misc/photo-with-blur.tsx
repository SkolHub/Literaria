'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

const DEFAULT_ASPECT_RATIO_TOLERANCE = 0.2;

function getRatioDifference(imageRatio: number, containerRatio: number) {
  return Math.abs(imageRatio - containerRatio) / containerRatio;
}

export default function PhotoWithBlur({
  src,
  alt,
  className,
  onClick,
  aspectRatioTolerance = DEFAULT_ASPECT_RATIO_TOLERANCE,
  targetAspectRatio,
  lockBehaviorOnResize = false
}: {
  src: string;
  alt: string;
  onClick?: () => void;
  className?: string;
  aspectRatioTolerance?: number;
  targetAspectRatio?: number;
  lockBehaviorOnResize?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerRatio, setContainerRatio] = useState<number | null>(null);
  const [imageRatio, setImageRatio] = useState<number | null>(null);
  const [lockedShouldCrop, setLockedShouldCrop] = useState<boolean | null>(null);

  useEffect(() => {
    const image = new Image();

    image.onload = () => {
      if (image.naturalWidth > 0 && image.naturalHeight > 0) {
        setImageRatio(image.naturalWidth / image.naturalHeight);
      }
    };

    image.src = src;
  }, [src]);

  useEffect(() => {
    setLockedShouldCrop(null);
  }, [src, targetAspectRatio]);

  useEffect(() => {
    if (targetAspectRatio !== undefined) {
      return;
    }

    const container = containerRef.current;

    if (!container) {
      return;
    }

    const updateContainerRatio = () => {
      const { width, height } = container.getBoundingClientRect();

      if (width > 0 && height > 0) {
        setContainerRatio(width / height);
      }
    };

    updateContainerRatio();

    const resizeObserver = new ResizeObserver(updateContainerRatio);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [targetAspectRatio]);

  const requiredAspectRatio = targetAspectRatio ?? containerRatio;
  const measuredShouldCrop =
    imageRatio !== null &&
    requiredAspectRatio !== null &&
    getRatioDifference(imageRatio, requiredAspectRatio) <= aspectRatioTolerance;
  const shouldCrop = lockBehaviorOnResize
    ? lockedShouldCrop ?? measuredShouldCrop
    : measuredShouldCrop;

  useEffect(() => {
    if (
      !lockBehaviorOnResize ||
      lockedShouldCrop !== null ||
      imageRatio === null ||
      requiredAspectRatio === null
    ) {
      return;
    }

    setLockedShouldCrop(measuredShouldCrop);
  }, [
    imageRatio,
    lockBehaviorOnResize,
    lockedShouldCrop,
    measuredShouldCrop,
    requiredAspectRatio
  ]);

  return (
    <div
      ref={containerRef}
      className={cn('relative h-full w-full overflow-hidden', className)}
      onClick={onClick}
    >
      {shouldCrop ? (
        <img className='h-full w-full object-cover' src={src} alt={alt} />
      ) : (
        <>
          <div className='absolute inset-0'>
            <img
              className='h-full w-full scale-110 object-cover blur-2xl brightness-75'
              src={src}
              alt=''
              aria-hidden='true'
            />
          </div>
          <img
            className='relative h-full w-full object-contain'
            src={src}
            alt={alt}
          />
        </>
      )}
    </div>
  );
}

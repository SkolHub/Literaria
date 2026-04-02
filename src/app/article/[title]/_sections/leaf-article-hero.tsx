'use client';

import BackButton from '@/components/misc/back-button';
import { IncludeBorder } from '@/components/rounded-borders/include-border';
import { RoundedBorder } from '@/components/rounded-borders/rounded-border';
import { RoundedTextBorder } from '@/components/rounded-borders/rounded-text-border';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform
} from 'framer-motion';
import { Vibrant } from 'node-vibrant/browser';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');

  if (normalized.length !== 6) {
    return '30, 30, 30';
  }

  const value = parseInt(normalized, 16);

  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}

function getContrastColor(hex: string) {
  const normalized = hex.replace('#', '');

  if (normalized.length !== 6) {
    return '255, 255, 255';
  }

  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;

  const linear = [r, g, b].map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  );

  const luminance =
    linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;

  const whiteContrast = 1.05 / (luminance + 0.05);
  const blackContrast = (luminance + 0.05) / 0.05;

  return whiteContrast > blackContrast ? '255, 255, 255' : '0, 0, 0';
}

function TitleChip({
  title,
  author,
  merged,
  className
}: {
  title: string;
  author: string;
  merged?: boolean;
  className?: string;
}) {
  return (
    <RoundedBorder
      className={cn('flex flex-col items-center', className)}
      paddingTop={4}
      paddingBottom={8}
      paddingLeft={12}
      paddingRight={12}
      borderRadius={16}
    >
      <RoundedTextBorder className='w-[450px] text-pretty text-center text-3xl font-semibold text-black mobile:w-[80vw] mobile:text-xl'>
        {title}
      </RoundedTextBorder>
      <IncludeBorder>
        <label className='py-2.5 mobile:text-sm'>{author}</label>
      </IncludeBorder>
      {merged && (
        <IncludeBorder>
          <div className='h-0 w-80 mobile:w-[52vw]' />
        </IncludeBorder>
      )}
    </RoundedBorder>
  );
}

export default function LeafArticleHero({
  title,
  author,
  image,
  createdAt,
  backPath
}: {
  title: string;
  author: string;
  image: string;
  createdAt: Date | string;
  backPath?: string;
}) {
  const isMobile = useIsMobile();
  const mainRef = useRef<HTMLElement | null>(null);
  const mergedChipRef = useRef<boolean>(false);

  const [viewportHeight, setViewportHeight] = useState<number>(0);
  const [navRgb, setNavRgb] = useState<string>('30, 30, 30');
  const [navForegroundRgb, setNavForegroundRgb] =
    useState<string>('255, 255, 255');
  const [useMergedChip, setUseMergedChip] = useState<boolean>(false);
  const chipMergeThreshold = 0.72;

  useEffect(() => {
    mainRef.current = document.getElementById('main') as HTMLElement | null;

    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    Vibrant.from(image)
      .getPalette()
      .then((palette) => {
        if (cancelled) {
          return;
        }

        const swatch = palette.Muted?.hex ?? '#1e1e1e';

        setNavRgb(hexToRgb(swatch));
        setNavForegroundRgb(getContrastColor(swatch));
      })
      .catch(() => {
        setNavRgb('30, 30, 30');
        setNavForegroundRgb('255, 255, 255');
      });

    return () => {
      cancelled = true;
    };
  }, [image]);

  const { scrollY } = useScroll({
    container: mainRef,
    layoutEffect: false
  });

  const threshold = isMobile ? 220 : 360;
  const scrollProgress = useTransform(scrollY, (value) =>
    clamp(value / threshold, 0, 1)
  );

  const safeViewportHeight = viewportHeight || 900;
  const heroHeight = useTransform(
    scrollProgress,
    [0, 1],
    [
      safeViewportHeight * (isMobile ? 0.58 : 0.86),
      safeViewportHeight * (isMobile ? 0.5 : 0.7)
    ]
  );
  const heroMarginTop = useTransform(
    scrollProgress,
    [0, 1],
    [0, isMobile ? 80 : 128]
  );
  const heroInset = useTransform(
    scrollProgress,
    [0, 1],
    [0, isMobile ? 16 : 144]
  );
  const heroRadius = useTransform(
    scrollProgress,
    [0, 1],
    [0, isMobile ? 28 : 48]
  );
  const titleBottom = useTransform(
    scrollProgress,
    [0, 0.72, 1],
    [isMobile ? 36 : 64, -4, -4]
  );
  useMotionValueEvent(scrollProgress, 'change', (value) => {
    const root = document.documentElement;
    const solidOpacity = clamp((value - 0.18) / 0.82, 0, 1);
    const nextMergedChip = value >= chipMergeThreshold;

    root.style.setProperty('--literaria-article-nav-rgb', navRgb);
    root.style.setProperty(
      '--literaria-article-nav-foreground-rgb',
      value < 0.6 ? navForegroundRgb : '0, 0, 0'
    );
    root.style.setProperty(
      '--literaria-article-nav-logo-filter',
      value < 0.6 && navForegroundRgb === '255, 255, 255'
        ? 'brightness(0) invert(1)'
        : 'none'
    );
    root.style.setProperty(
      '--literaria-article-nav-search-bg-rgb',
      value < 0.6 ? '255, 255, 255' : '0, 0, 0'
    );
    root.style.setProperty(
      '--literaria-article-nav-search-fg-rgb',
      value < 0.6 ? '0, 0, 0' : '255, 255, 255'
    );
    root.style.setProperty(
      '--literaria-article-nav-gradient-opacity',
      (1 - value).toFixed(3)
    );
    root.style.setProperty(
      '--literaria-article-nav-solid-opacity',
      solidOpacity.toFixed(3)
    );

    if (mergedChipRef.current !== nextMergedChip) {
      mergedChipRef.current = nextMergedChip;
      setUseMergedChip(nextMergedChip);
    }
  });

  useLayoutEffect(() => {
    const root = document.documentElement;
    const initialProgress = clamp(
      (mainRef.current?.scrollTop ?? 0) / threshold,
      0,
      1
    );
    const solidOpacity = clamp((initialProgress - 0.18) / 0.82, 0, 1);

    root.style.setProperty('--literaria-article-nav-rgb', navRgb);
    root.style.setProperty(
      '--literaria-article-nav-foreground-rgb',
      initialProgress < 0.6 ? navForegroundRgb : '0, 0, 0'
    );
    root.style.setProperty(
      '--literaria-article-nav-logo-filter',
      initialProgress < 0.6 && navForegroundRgb === '255, 255, 255'
        ? 'brightness(0) invert(1)'
        : 'none'
    );
    root.style.setProperty(
      '--literaria-article-nav-search-bg-rgb',
      initialProgress < 0.6 ? '255, 255, 255' : '0, 0, 0'
    );
    root.style.setProperty(
      '--literaria-article-nav-search-fg-rgb',
      initialProgress < 0.6 ? '0, 0, 0' : '255, 255, 255'
    );
    root.style.setProperty(
      '--literaria-article-nav-gradient-opacity',
      (1 - initialProgress).toFixed(3)
    );
    root.style.setProperty(
      '--literaria-article-nav-solid-opacity',
      solidOpacity.toFixed(3)
    );

    return () => {
      root.style.removeProperty('--literaria-article-nav-rgb');
      root.style.removeProperty('--literaria-article-nav-foreground-rgb');
      root.style.removeProperty('--literaria-article-nav-logo-filter');
      root.style.removeProperty('--literaria-article-nav-search-bg-rgb');
      root.style.removeProperty('--literaria-article-nav-search-fg-rgb');
      root.style.removeProperty('--literaria-article-nav-gradient-opacity');
      root.style.removeProperty('--literaria-article-nav-solid-opacity');
    };
  }, [navForegroundRgb, navRgb, threshold]);

  return (
    <>
      <motion.div
        className='relative mb-10 mobile:mb-6'
        style={{
          height: heroHeight,
          marginTop: heroMarginTop,
          marginLeft: heroInset,
          marginRight: heroInset
        }}
      >
        <motion.div
          className='absolute inset-0 overflow-hidden'
          style={{
            borderRadius: heroRadius
          }}
        >
          <img
            className='absolute inset-0 h-full w-full scale-110 object-cover blur-3xl brightness-75'
            src={image}
            alt={title}
          />
          <div className='absolute inset-0 bg-black/10' />
          <img
            className='relative h-full w-full object-cover'
            src={image}
            alt={title}
          />
        </motion.div>
        <motion.div
          className='absolute inset-x-0 z-[2] flex justify-center px-3'
          style={{ bottom: titleBottom }}
        >
          <div className='relative'>
            {useMergedChip ? (
              <TitleChip title={title} author={author} merged />
            ) : (
              <TitleChip title={title} author={author} />
            )}
          </div>
        </motion.div>
      </motion.div>
      <section className='px-[9rem] mobile:px-4'>
        <BackButton className='pb-4' path={backPath} />
      </section>
    </>
  );
}

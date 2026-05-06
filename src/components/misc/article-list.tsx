'use client';

import NextItemButton from '@/components/buttons/next-item-button';
import {
  Children,
  ReactNode,
  useEffect,
  useRef,
  useState
} from 'react';
import SwiperCore from 'swiper';
import 'swiper/css';
import { Autoplay, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';

SwiperCore.use([Autoplay, Mousewheel]);

const easedWhiteFadeStops =
  'rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.987) 8.1%, rgba(255, 255, 255, 0.951) 15.5%, rgba(255, 255, 255, 0.896) 22.5%, rgba(255, 255, 255, 0.825) 29%, rgba(255, 255, 255, 0.741) 35.3%, rgba(255, 255, 255, 0.648) 41.2%, rgba(255, 255, 255, 0.55) 47.1%, rgba(255, 255, 255, 0.45) 52.9%, rgba(255, 255, 255, 0.352) 58.8%, rgba(255, 255, 255, 0.259) 64.7%, rgba(255, 255, 255, 0.175) 71%, rgba(255, 255, 255, 0.104) 77.5%, rgba(255, 255, 255, 0.049) 84.5%, rgba(255, 255, 255, 0.013) 91.9%, rgba(255, 255, 255, 0) 100%';

type EdgePadding =
  | number
  | {
      mobile: number;
      laptop: number;
      desktop: number;
    };

function getEdgePadding(edgePadding?: EdgePadding) {
  if (edgePadding === undefined) {
    return {
      mobile: 0,
      laptop: 0,
      desktop: 0
    };
  }

  if (typeof edgePadding === 'number') {
    return {
      mobile: edgePadding,
      laptop: edgePadding,
      desktop: edgePadding
    };
  }

  return edgePadding;
}

export default ({
  children,
  className = '',
  articleCount = 2,
  edgePadding,
  loop = true,
  showEdgeGradients = false
}: {
  children: ReactNode;
  className?: string;
  articleCount?: number;
  edgePadding?: EdgePadding;
  loop?: boolean;
  showEdgeGradients?: boolean;
}) => {
  const ref = useRef<SwiperRef>(null);
  const resolvedEdgePadding = getEdgePadding(edgePadding);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const leftVisibilityClass = !loop && isBeginning
    ? 'pointer-events-none opacity-0'
    : 'opacity-100';
  const rightVisibilityClass = !loop && isEnd
    ? 'pointer-events-none opacity-0'
    : 'opacity-100';

  const updateEdgeState = (swiper: SwiperCore) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  useEffect(() => {
    const handleResize = () => {
      const swiper = ref.current?.swiper;

      if (!swiper) {
        return;
      }

      swiper.slideTo(0);
      updateEdgeState(swiper);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`relative h-full ${className}`}>
      {showEdgeGradients && (
        <>
          <div
            className={`pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-56 transition-opacity duration-300 mobile:w-28 ${leftVisibilityClass}`}
            style={{
              background: `linear-gradient(to right, ${easedWhiteFadeStops})`
            }}
          />
          <div
            className={`pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-56 transition-opacity duration-300 mobile:w-28 ${rightVisibilityClass}`}
            style={{
              background: `linear-gradient(to left, ${easedWhiteFadeStops})`
            }}
          />
        </>
      )}
      <Swiper
        className={showEdgeGradients ? 'article-list-edge-offset h-full' : 'h-full'}
        ref={ref}
        onInit={updateEdgeState}
        onSlideChange={updateEdgeState}
        onReachBeginning={updateEdgeState}
        onReachEnd={updateEdgeState}
        onFromEdge={updateEdgeState}
        onResize={updateEdgeState}
        spaceBetween={30}
        slidesPerView={'auto'}
        loop={loop}
        mousewheel={{
          forceToAxis: true,
          releaseOnEdges: true
        }}
        slidesOffsetBefore={resolvedEdgePadding.mobile}
        slidesOffsetAfter={resolvedEdgePadding.mobile}
        // autoplay={{
        //   delay: 3000
        // }}
        breakpoints={{
          1600: {
            spaceBetween: 50,
            slidesPerView: 'auto',
            centeredSlides: false,
            slidesOffsetBefore: resolvedEdgePadding.desktop,
            slidesOffsetAfter: resolvedEdgePadding.desktop
          },
          900: {
            spaceBetween: 30,
            slidesPerView: 'auto',
            centeredSlides: false,
            slidesOffsetBefore: resolvedEdgePadding.laptop,
            slidesOffsetAfter: resolvedEdgePadding.laptop
          },
          0: {
            centeredSlides: false,
            slidesOffsetBefore: resolvedEdgePadding.mobile,
            slidesOffsetAfter: resolvedEdgePadding.mobile
          }
        }}
      >
        {Children.toArray(children).map((child, index) => (
          <SwiperSlide className='h-full' key={index}>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
      {articleCount > 2 && (
        <>
          <NextItemButton
            className={`swiper-button-next absolute left-8 top-1/2 z-20 -translate-y-1/2 rotate-180 transition-opacity duration-300 ${leftVisibilityClass}`}
            onClick={() => {
              ref.current!.swiper.slidePrev();
            }}
          />
          <NextItemButton
            className={`swiper-button-next absolute right-8 top-1/2 z-20 -translate-y-1/2 transition-opacity duration-300 ${rightVisibilityClass}`}
            onClick={() => {
              ref.current!.swiper.slideNext();
            }}
          />
        </>
      )}
    </div>
  );
};

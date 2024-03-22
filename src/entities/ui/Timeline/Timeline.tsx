import { useEffect, useRef, useState } from 'react';
import { TimelineRuler } from '../TimelineRuler';
import { TimelineSlider } from '../TimelineSlider';
import { TimelineGrid } from '..';
import { useSize } from '../../../shared/lib';

export const Timeline = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [shift, setShift] = useState<number>(0);
  const [tracks, setTracks] = useState<number[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const size = useSize(containerRef);

  const setZoomProtected = (value: (prevState: number) => number) => {
    setZoom((prevState) => {
      const newValue = value(prevState);
      if (newValue >= 1 && newValue <= 24) {
        return newValue;
      } else {
        return prevState;
      }
    });
  };

  const handleWheel = (e: WheelEvent) => {
    const sign = e.deltaY >= 0 ? -1 : 1;

    if (e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();

      setShift((prevState) => {
        const newValue = prevState + 10 * -sign;
        if (newValue >= 0 && newValue <= 100) {
          return newValue;
        }
        return prevState;
      });
    }

    if (e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();

      const zoomValue = 0.25 * sign;
      setZoomProtected((prevState) => prevState + zoomValue);
    }
  };

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: false });
      return () => element.removeEventListener('wheel', handleWheel);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='size-full flex'>
      <div className='border-r border-neutral-600/20 flex-col flex pt-[19px]'>
        {tracks.map((track) => (
          <div
            key={track}
            className='h-[64px] w-[233px] border-b border-neutral-600/40'
          />
        ))}
        <button
          className='text-white h-[64px] w-[233px] flex flex-col items-center border-b border-neutral-600/40'
          onClick={() =>
            setTracks((prevState) => [...prevState, Math.random()])
          }
        >
          <span className=' text-2xl font-bold'>+</span>
          <span>Add new track</span>
        </button>
      </div>
      <div
        className='size-full flex flex-col relative border-r border-neutral-600'
        ref={containerRef}
      >
        <div className='flex w-full'>
          <TimelineRuler
            width={size?.width ?? 1440}
            shiftPercent={zoom > 1 ? shift : 0}
            zoom={zoom}
          />
        </div>
        <div className='w-max-full size-full flex flex-col'>
          <div
            ref={ref}
            className='flex flex-col size-full touch-pan-y select-none border-b border-neutral-600'
          >
            {tracks.map((track) => (
              <div key={track} className='h-[64px] border-b border-neutral-600'>
                <TimelineGrid
                  width={size?.width ?? 1440}
                  color='rgb(82 82 82)'
                  zoom={zoom}
                />
              </div>
            ))}
          </div>
          <div className='flex w-full items-center gap-2 px-5 py-2'>
            <div className='text-white'>{zoom.toFixed(2)}</div>
            <TimelineSlider
              className='w-full'
              zoom={zoom}
              value={shift}
              onChange={(e) => setShift(Number(e.target.value))}
            />
            <div className='flex gap-2'>
              <button
                className='text-white'
                onClick={() =>
                  setZoomProtected((prevState) => prevState + 0.75)
                }
              >
                <span className='material-symbols-outlined'>zoom_in</span>
              </button>
              <button
                className='text-white'
                onClick={() =>
                  setZoomProtected((prevState) => prevState - 0.75)
                }
              >
                <span className='material-symbols-outlined'>zoom_out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

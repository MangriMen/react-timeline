import { useEffect, useRef, useState } from 'react';
import { TimelineRuler } from '../TimelineRuler';
import { TimelineSlider } from '../TimelineSlider';
import { TimelineGrid } from '..';

export const Timeline = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [shift, setShift] = useState<number>(0);

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='size-full flex flex-col relative'>
      <div className='flex w-full'>
        <TimelineRuler shiftPercent={zoom > 1 ? shift : 0} zoom={zoom} />
      </div>
      <div className='w-max-full size-full flex flex-col'>
        <div ref={ref} className='flex size-full touch-pan-y select-none '>
          <TimelineGrid zoom={zoom} shiftPercent={shift} />
          <div className='flex-1' />
        </div>
        <div className='flex w-full items-center gap-2'>
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
              onClick={() => setZoomProtected((prevState) => prevState + 1)}
            >
              <span className='material-symbols-outlined'>zoom_in</span>
            </button>
            <button
              className='text-white'
              onClick={() => setZoomProtected((prevState) => prevState - 1)}
            >
              <span className='material-symbols-outlined'>zoom_out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

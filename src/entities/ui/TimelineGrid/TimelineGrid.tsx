import { useEffect, useRef } from 'react';
import { TimelineGridProps } from './interfaces';
import {
  drawVerticalLine,
  getTicks,
  getSegmentWidth,
  getStep,
  getSubTickSegmentWidth,
} from '../..';

const TimelineGrid = ({ zoom, ...props }: TimelineGridProps) => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const step = getStep(zoom);
    const tickSegmentWidth = getSegmentWidth(zoom);
    const subTickSegmentWidth = getSubTickSegmentWidth();
    const ticks = getTicks(
      1440,
      zoom,
      step,
      tickSegmentWidth.min,
      tickSegmentWidth.max,
      subTickSegmentWidth.min,
      subTickSegmentWidth.max,
    );

    ticks.mainTicks.forEach((tick) => {
      drawVerticalLine(ctx, tick.x, 1);
      if (zoom >= 3) {
        ticks.subTicks.forEach((subTick, i) => {
          if (i % 2 === 1) {
            drawVerticalLine(ctx, tick.x + subTick.x, 1);
          }
        });
      }
    });
  }, [zoom]);

  return <canvas ref={ref} width={1440} height={1} {...props} />;
};

export default TimelineGrid;

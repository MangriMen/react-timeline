import { useEffect, useRef } from 'react';
import { TimelineRulerProps } from './interfaces';

const TimelineRuler = ({
  shiftPercent,
  zoom,
  ...props
}: TimelineRulerProps) => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  const drawMainDash = (
    ctx: CanvasRenderingContext2D,
    offset: number,
    text: string,
  ) => {
    const x = offset + 1;

    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.moveTo(x, ctx.canvas.height);
    ctx.lineTo(x, ctx.canvas.height / 2);
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.fillText(text, x + 4, ctx.canvas.height / 2 + 3);
  };

  const drawSubDash = (
    ctx: CanvasRenderingContext2D,
    offset: number,
    height: number,
  ) => {
    const x = offset + 1;

    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.moveTo(x, ctx.canvas.height);
    ctx.lineTo(x, ctx.canvas.height - height);
    ctx.stroke();
  };

  useEffect(() => {
    const element = canvas.current;

    if (!element) {
      return;
    }

    const ctx = element.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const shift = shiftPercent / 100;

    const startDistance = ctx.canvas.width / 24;
    const distanceBetweenLines =
      zoom > 0 ? startDistance * zoom : startDistance;

    const numberStep = (startDistance / distanceBetweenLines) * 4;
    const subDashCount = zoom <= 2 ? 0 : Math.round(distanceBetweenLines / 17);

    for (
      let x = 0, i = 24 * shift * zoom;
      x < ctx.canvas.width;
      x += distanceBetweenLines, i += 1
    ) {
      const text = (1 + numberStep * i).toFixed(1).replace(/[.,]0+$/, '');

      drawMainDash(ctx, x, text);

      const subDashStep = distanceBetweenLines / subDashCount;

      for (let j = 0; j < subDashCount; j++) {
        const subDashHeight = subDashCount <= 3 ? 7 : 4 + (j % 2) * 3;

        if (x !== x + subDashStep * j) {
          drawSubDash(ctx, x + subDashStep * j, subDashHeight);
        }
      }
    }
  }, [zoom, shiftPercent]);

  return (
    <canvas
      className='border-b border-b-white'
      width={1440}
      height={18}
      ref={canvas}
      {...props}
    />
  );
};

export default TimelineRuler;

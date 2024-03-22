export const drawVerticalLine = (
  ctx: CanvasRenderingContext2D,
  x: number,
  height: number,
) => {
  ctx.beginPath();

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;

  ctx.moveTo(x, ctx.canvas.height);
  ctx.lineTo(x, ctx.canvas.height - height);

  ctx.stroke();
};

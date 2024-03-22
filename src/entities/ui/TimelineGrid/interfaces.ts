import { ComponentProps } from 'react';

export interface TimelineGridProps extends ComponentProps<'canvas'> {
  shiftPercent: number;
  zoom: number;
}

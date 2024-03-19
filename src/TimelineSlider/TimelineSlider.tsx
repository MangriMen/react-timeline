import { clsx } from 'clsx';
import { TimelineSliderProps } from './interfaces';
import styles from './styles.module.css';

const TimelineSlider = ({ zoom, className, ...props }: TimelineSliderProps) => {
  return (
    <input
      type='range'
      min={0}
      max={100}
      className={clsx(styles.timelineSlider, className)}
      style={{
        // @ts-expect-error Type
        '--thumb-width': `calc(100% / ${zoom})`,
      }}
      {...props}
    />
  );
};

export default TimelineSlider;

export const getStep = (zoom: number) => {
  if (zoom === 1) {
    return 4;
  } else if (zoom > 1 && zoom < 2) {
    return 2;
  } else {
    return 1;
  }
};

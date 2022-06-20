export const scale = (
  n: number,
  aMin: number,
  aMax: number,
  bMin = 0,
  bMax = 1,
) => n * (aMin + (aMax - aMin) / (bMax - bMin));

export const clamp = (n: number, min = 0, max = 1) => {
  if (min > n) {
    return min;
  } else if (max < n) {
    return max;
  } else {
    return n;
  }
};

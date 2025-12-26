export const addZero = (value: number) => {
  return value <= 9 ? `0${value}` : value;
};

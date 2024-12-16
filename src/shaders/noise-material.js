const MAX_AMPLITUDE = 0.0017;
const MAX_FREQUENCY = 1.6;
const MIN_AMPLITUDE = 0;
const MIN_FREQUENCY = 1.2;

export const getAmplitude = (surface) =>
  Math.max(
    MAX_AMPLITUDE - Math.log((101 - surface) / 100 + 0.04) * (MAX_AMPLITUDE / Math.log(0.05)),
    MIN_AMPLITUDE
  );
export const getFrequency = (surface) =>
  Math.max(MAX_FREQUENCY - MAX_FREQUENCY * surface * 0.01, MIN_FREQUENCY);

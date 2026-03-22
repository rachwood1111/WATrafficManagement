import { MrwaSpecifics, ValueWithTolerance } from '../types';

// Helper to calculate -10% and +25% or +15m tolerance
const calcTolerance = (val: number): ValueWithTolerance => {
  const min = Math.round(val * 0.9); // -10%
  const maxTolerance = Math.max(val * 0.25, 15);
  const max = Math.round(val + maxTolerance); // +25% or +15m
  return {
    value: val,
    min,
    max,
    display: `${val}m (${min}m - ${max}m)`
  };
};

export const getMrwaSpecifics = (speed: number): MrwaSpecifics => {
  
  // MRWA CoP Lane Widths
  // "lane widths table from code of practice"
  // Logic based on standard CoP guidance:
  // <= 60km/h: 3.0m
  // 61 - 70km/h: 3.2m
  // > 70km/h: 3.5m
  let laneWidth = 3.5;
  if (speed <= 60) laneWidth = 3.0;
  else if (speed <= 70) laneWidth = 3.2;
  
  // MRWA CoP Table 10: Distance from 'Prepare to Stop' sign to 'Stop Here When Directed' (or Traffic Controller)
  // These are often site specific but CoP provides minimums.
  // Approximation based on standard CoP speed bands:
  let table10_prepToStopToTC = 0;
  if (speed <= 45) table10_prepToStopToTC = 30;
  else if (speed <= 55) table10_prepToStopToTC = 40;
  else if (speed <= 65) table10_prepToStopToTC = 60;
  else if (speed <= 75) table10_prepToStopToTC = 80;
  else if (speed <= 85) table10_prepToStopToTC = 100;
  else table10_prepToStopToTC = 120; // > 85

  // MRWA CoP Table 21: Maximum spacing of delineating devices (Cones/Bollards)
  // Usually Tapers vs Parallel. We will use Parallel (general) spacing here as the primary.
  // Generally: Speed / 2 approx, capped.
  let table21_delineatorMaxSpacing = 0;
  if (speed <= 55) table21_delineatorMaxSpacing = 10;
  else if (speed <= 75) table21_delineatorMaxSpacing = 20;
  else table21_delineatorMaxSpacing = 30; // > 75

  // MRWA CoP Table 22: Spacing of Signs (D)
  // Calculates with tolerance
  let baseSignSpacing = 0;
  if (speed <= 45) baseSignSpacing = 20;
  else if (speed <= 55) baseSignSpacing = 40;
  else if (speed <= 65) baseSignSpacing = 60;
  else if (speed <= 75) baseSignSpacing = 80;
  else if (speed <= 85) baseSignSpacing = 100;
  else baseSignSpacing = speed * 1.2; // Generalizing for higher speeds if not explicitly in table
  
  // Hard cap adjustment if matching exact table values:
  // 60km/h -> 60m
  // 80km/h -> 100m usually in CoP
  if (speed === 60) baseSignSpacing = 60;
  if (speed === 80) baseSignSpacing = 100;

  const table22_signSpacing = calcTolerance(baseSignSpacing);

  return {
    table10_prepToStopToTC,
    table21_delineatorMaxSpacing,
    table22_signSpacing,
    laneWidth
  };
};

export const getRadioChannels = () => {
  return [
    { channel: 40, desc: "Truck Channel (Public)" },
    { channel: 29, desc: "Highway/Pacific (Public)" },
    { channel: 18, desc: "Caravan/Campers (Public)" },
    { channel: 5, desc: "Emergency (Do Not Use)" },
    { channel: 35, desc: "Emergency (Do Not Use)" }
  ];
};

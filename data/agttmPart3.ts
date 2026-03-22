import { TrafficRequirements, ValueWithTolerance } from '../types';

// Helper to calculate -10% and +25% or +15m tolerance
// "Code of Practice (10% less and 25% or 15m more)"
const calcTolerance = (val: number): ValueWithTolerance => {
  const min = Math.round(val * 0.9 * 10) / 10; // -10% (1dp)
  const maxTolerance = Math.max(val * 0.25, 15);
  const max = Math.round((val + maxTolerance) * 10) / 10; // +25% or +15m (1dp)
  return {
    value: val,
    min,
    max,
    display: `${val}m (${min}m - ${max}m)`
  };
};

export const getRequirementsForSpeed = (speed: number, isMrwa: boolean = false): TrafficRequirements => {
  
  // AGTTM Part 3 Table 2.2 / MRWA Table 22 (Sign Spacing)
  // We use AGTTM base values here, tolerances applied.
  let baseSignSpacing = 0;
  if (speed <= 55) baseSignSpacing = 15; // Low speed environment
  else if (speed <= 65) baseSignSpacing = 45;
  else baseSignSpacing = speed; 

  // AGTTM Part 3 Table 5.4: Taper Lengths - Lateral Shift
  // Formula approx: L = (W x S) / 3 for shift
  // Assuming 3.5m lane width (W)
  // 40km/h: 15m
  // 60km/h: 30m
  // 80km/h: 70m (Approx)
  // 100km/h: 100m
  let baseTaperLateral = 0;
  if (speed <= 45) baseTaperLateral = 15;
  else if (speed <= 55) baseTaperLateral = 20;
  else if (speed <= 65) baseTaperLateral = 30;
  else if (speed <= 75) baseTaperLateral = 60;
  else if (speed <= 85) baseTaperLateral = 70;
  else if (speed <= 95) baseTaperLateral = 80;
  else baseTaperLateral = 100;

  // AGTTM Part 3 Table 5.5: Taper Lengths - Merge
  // Formula approx: L = W x S
  // Assuming 3.5m lane width
  let baseTaperMerge = 0;
  if (speed <= 45) baseTaperMerge = 30;
  else if (speed <= 55) baseTaperMerge = 50;
  else if (speed <= 65) baseTaperMerge = 80;
  else if (speed <= 75) baseTaperMerge = 115;
  else if (speed <= 85) baseTaperMerge = 130;
  else if (speed <= 95) baseTaperMerge = 145;
  else baseTaperMerge = 160;

  // AGTTM Part 3 Table 5.8: Distance between tapers
  // Usually D (Sign Spacing) or specific table
  let baseDistBetweenTapers = baseSignSpacing; 
  if (speed > 65) baseDistBetweenTapers = speed * 1.5; // AGTTM Part 3 Table 5.8 logic

  // AGTTM Part 3 Table 2.4: Sight distance to signs
  // Note: This is a Minimum value, so tolerances (-10%) usually don't apply for safety, 
  // but we provide the raw minimum.
  let sightDistance = 0;
  if (speed <= 45) sightDistance = 60;
  else if (speed <= 55) sightDistance = 80; // Interpolated
  else if (speed <= 65) sightDistance = 100; // 60km/h -> 100m approx
  else if (speed <= 75) sightDistance = 130;
  else if (speed <= 85) sightDistance = 160;
  else if (speed <= 95) sightDistance = 190;
  else if (speed <= 105) sightDistance = 220;
  else sightDistance = 250;


  return {
    signSpacing: calcTolerance(baseSignSpacing),
    taperLengthLateral: calcTolerance(baseTaperLateral), // Table 5.4
    taperLengthMerge: calcTolerance(baseTaperMerge), // Table 5.5
    distanceBetweenTapers: calcTolerance(baseDistBetweenTapers),
    delineatorSpacing: speed <= 60 ? 10 : 20, // Simplified
    edgeClearance: speed <= 60 ? 0.3 : 0.5,
    safetyBuffer: speed >= 60 ? 30 : 10,
    sightDistance: sightDistance // Table 2.4 (Min)
  };
};

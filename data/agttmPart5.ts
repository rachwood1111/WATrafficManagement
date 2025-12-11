import { ShortTermRequirements } from '../types';

// Data derived from AGTTM Part 5: Short Term Low Impact Worksites
// Tables 2.2, 2.3, 2.4, 4.2, 4.3, 4.6
// Updated to include MRWA Code of Practice Departures

export const getShortTermRequirements = (speed: number, isMrwa: boolean = false): ShortTermRequirements => {
  // Table 2.3: Sign spacing
  let signSpacing: number | string = 0;
  if (speed <= 55) signSpacing = 15;
  else if (speed <= 65) signSpacing = 45;
  else signSpacing = speed;

  // Lane Width Calculation
  // AGTTM Table 2.4: <= 65km/h = 3.0m, >= 66km/h = 3.5m
  // MRWA CoP (Section 4.3): 
  // - <= 60km/h = 3.0m
  // - 61-70km/h = 3.2m  <-- Specific WA Departure
  // - > 70km/h = 3.5m
  let minLaneWidth = 3.5;

  if (isMrwa) {
    if (speed <= 60) minLaneWidth = 3.0;
    else if (speed <= 70) minLaneWidth = 3.2;
    else minLaneWidth = 3.5;
  } else {
    // Standard AGTTM
    minLaneWidth = speed <= 65 ? 3.0 : 3.5;
  }

  // Table 4.3 / 4.6: Sight distance for lookout person
  // (Values are identical in both tables for Short Term & Gaps)
  let lookoutSightDistance = 0;
  if (speed <= 45) lookoutSightDistance = 80;
  else if (speed <= 55) lookoutSightDistance = 100;
  else if (speed <= 65) lookoutSightDistance = 120;
  else if (speed <= 75) lookoutSightDistance = 140;
  else if (speed <= 85) lookoutSightDistance = 160;
  else if (speed <= 95) lookoutSightDistance = 180;
  else if (speed <= 105) lookoutSightDistance = 200;
  else lookoutSightDistance = 220;

  // Table 4.2: Sight distance to vehicle mounted warning device – lookout person NOT required (Gaps in Traffic)
  let gapSightDistance: number | string = 0;
  if (speed <= 45) gapSightDistance = 225;
  else if (speed <= 55) gapSightDistance = 275;
  else if (speed <= 65) gapSightDistance = 335;
  else if (speed <= 75) gapSightDistance = 390;
  else if (speed <= 85) gapSightDistance = 445;
  else if (speed <= 95) gapSightDistance = 500;
  else if (speed <= 110) gapSightDistance = 555;
  else gapSightDistance = "Lookout Required (>110km/h)";

  // Section 4.3.2 Criteria 5: Warning Device Sight Distance
  // <= 60 = 150m, > 60 = 250m
  const warningDeviceSightDistance = speed <= 60 ? 150 : 250;

  return {
    signSpacing,
    minLaneWidth,
    lookoutSightDistance,
    gapSightDistance,
    warningDeviceSightDistance
  };
};
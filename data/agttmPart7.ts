import { TrafficControllerRequirements } from '../types';

// Data derived from AGTTM Part 7: Traffic Controllers
// Table 2.3 and Part 6 Table 7.1

export const getTrafficControllerRequirements = (speed: number): TrafficControllerRequirements => {
  // Part 7 Table 2.3: Prepare to Stop/Traffic Controller (symbolic) sign position from end of traffic queue
  let prepareToStopDistance = 0;
  if (speed <= 45) prepareToStopDistance = 50;
  else if (speed <= 55) prepareToStopDistance = 70;
  else if (speed <= 65) prepareToStopDistance = 90;
  else prepareToStopDistance = 2 * speed; // Two times the speed of traffic (km/h)

  // Part 7 Section 2.7.4 / Table 2.3 generally aligns sign spacing with sight distance
  const minSightDistance = prepareToStopDistance;

  return {
    prepareToStopDistance,
    minSightDistance,
    inspectionFrequency: "Every 2 Hours" // Part 6 Table 7.1
  };
};
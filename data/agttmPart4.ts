import { MobileRequirements } from '../types';

// Data derived from AGTTM Part 4: Mobile Works
// Tables 2.2, 3.1 and Section 2.5.2

export const getMobileRequirements = (speed: number): MobileRequirements => {
  // Table 3.1: Spacing distances between vehicles in mobile works (excluding shadow to work)
  let vehicleSpacing = 0;
  if (speed <= 45) vehicleSpacing = 50;
  else if (speed <= 55) vehicleSpacing = 70;
  else if (speed <= 65) vehicleSpacing = 90;
  else if (speed <= 75) vehicleSpacing = 110;
  else if (speed <= 85) vehicleSpacing = 140;
  else if (speed <= 95) vehicleSpacing = 160;
  else if (speed <= 105) vehicleSpacing = 200;
  else vehicleSpacing = 230;

  // Table 2.2: Sign spacing (Same as Part 3)
  let signSpacing: number | string = 0;
  if (speed <= 55) signSpacing = 15;
  else if (speed <= 65) signSpacing = 45;
  else signSpacing = speed; // Equal to speed km/h -> meters

  // Section 2.5.2 Sight Distance to Vehicle Mounted Warning Device
  // <= 60km/h = 150m, > 60km/h = 250m
  const warningDeviceSightDistance = speed <= 60 ? 150 : 250;

  return {
    signSpacing,
    vehicleSpacing,
    shadowVehicleSpacing: 40, // Section 3.5.3 (Shadow vehicle 40m behind work vehicle/workers)
    warningDeviceSightDistance
  };
};
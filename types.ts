
export interface ToleranceValue {
  base: number;
  min: number;
  max: number;
}

export interface SimplifiedGuideData {
  speed: number;
  signSpacing: ToleranceValue;
  taperMerge: number;
  taperLateral: number;
  laneWidth: number;
  laneWidthNote?: string;
  signSpacingNote?: string;
}

export interface UhfChannelGroup {
  category: string;
  colorClass: string;
  icon: string;
  channels: Array<{
    id: string | number;
    desc: string;
  }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ValueWithTolerance {
  value: number;
  min: number;
  max: number;
  display: string;
}

export interface TrafficRequirements {
  signSpacing: ValueWithTolerance;
  taperLengthLateral: ValueWithTolerance;
  taperLengthMerge: ValueWithTolerance;
  distanceBetweenTapers: ValueWithTolerance;
  delineatorSpacing: number;
  edgeClearance: number;
  safetyBuffer: number;
  sightDistance: number;
}

export interface MobileRequirements {
  signSpacing: number | string;
  vehicleSpacing: number;
  shadowVehicleSpacing: number;
  warningDeviceSightDistance: number;
}

export interface ShortTermRequirements {
  signSpacing: number | string;
  minLaneWidth: number;
  lookoutSightDistance: number;
  gapSightDistance: number | string;
  warningDeviceSightDistance: number;
}

export interface TrafficControllerRequirements {
  prepareToStopDistance: number;
  minSightDistance: number;
  inspectionFrequency: string;
}

export interface RoadCategoryResult {
  category: number;
  description: string;
}

export interface MrwaSpecifics {
  table10_prepToStopToTC: number;
  table21_delineatorMaxSpacing: number;
  table22_signSpacing: ValueWithTolerance;
  laneWidth: number;
}

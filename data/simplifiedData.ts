
import { SimplifiedGuideData, ToleranceValue, UhfChannelGroup } from '../types';

// Calculate -10% and +25% or +15m tolerance (whichever is greater, rounded to 1 decimal place)
const calculateTolerance = (base: number): ToleranceValue => {
  const maxTolerance = Math.max(base * 0.25, 15);
  return {
    base,
    min: Math.round(base * 0.9 * 10) / 10,
    max: Math.round((base + maxTolerance) * 10) / 10
  };
};

export const getSimplifiedData = (speed: number): SimplifiedGuideData => {
  let signSpacingBase = 0;
  let taperMerge = 0;
  let taperLateral = 0;
  let laneWidth = 3.5;
  let laneWidthNote = "";
  let signSpacingNote = "";

  // 1. SIGN SPACING (AGTTM Part 3 Table 2.2)
  // < 55: 15m
  // 56-65: 45m
  // > 65: = Speed (Value equals speed in km/h)
  if (speed <= 50) { // Covers 40, 50 (Band < 55)
    signSpacingBase = 15;
  } else if (speed === 60) { // Covers 60 (Band 56-65)
    signSpacingBase = 45;
  } else { // Covers 70, 80, 90, 100, 110 (Band > 65)
    signSpacingBase = speed;
  }

  // MRWA CoP Departure for sign spacing tolerance (+15m rule)
  // Only a departure if 15m is greater than 25% of base (i.e. base < 60m)
  if (signSpacingBase < 60) {
    signSpacingNote = "(MRWA CoP Departure)";
  }

  // 2. TAPER LENGTHS (AGTTM Part 3 Table 5.7)
  // Merge Taper values updated per user input (40->15m, 50->30m)
  // Lateral Shift values updated per user input (40->5m, 70->70m sequence)
  switch (speed) {
    case 40:
      taperMerge = 15; 
      taperLateral = 5;
      break;
    case 50:
      taperMerge = 30; 
      taperLateral = 15;
      break;
    case 60:
      taperMerge = 60;
      taperLateral = 30;
      break;
    case 70:
      taperMerge = 115;
      taperLateral = 70;
      break;
    case 80:
      taperMerge = 130;
      taperLateral = 80;
      break;
    case 90:
      taperMerge = 145;
      taperLateral = 90;
      break;
    case 100:
      taperMerge = 160;
      taperLateral = 100;
      break;
    case 110:
      taperMerge = 180;
      taperLateral = 110;
      break;
    default:
      // Fallback
      taperMerge = speed * 1.5;
      taperLateral = speed;
  }

  // 3. LANE WIDTHS (MRWA Code of Practice)
  // <= 60: 3.0m
  // 61-80: 3.2m
  // > 80: 3.5m
  if (speed <= 60) {
    laneWidth = 3.0;
  } else if (speed <= 80) {
    laneWidth = 3.2;
    laneWidthNote = "(MRWA CoP Departure)";
  } else {
    laneWidth = 3.5;
  }

  return {
    speed,
    signSpacing: calculateTolerance(signSpacingBase),
    taperMerge,
    taperLateral,
    laneWidth,
    laneWidthNote,
    signSpacingNote
  };
};

export const getUhfGuide = (): UhfChannelGroup[] => {
  return [
    {
      category: "Available (General Chat)",
      colorClass: "bg-green-50 text-green-800 border-green-200",
      icon: "✅",
      channels: [
        { id: "9, 12-17", desc: "Available" },
        { id: "19-21", desc: "Available" },
        { id: "24-28", desc: "Available" },
        { id: "30", desc: "Available" },
        { id: "39", desc: "Available" },
        { id: "49-51", desc: "Available" },
        { id: "54-60", desc: "Available" },
        { id: "64-69", desc: "Available" },
        { id: "71-78", desc: "Available" }
      ]
    },
    {
      category: "Heavy Vehicle (Site Ops)",
      colorClass: "bg-blue-50 text-blue-800 border-blue-200",
      icon: "🚛",
      channels: [
        { id: 40, desc: "Primary communication with Heavy Vehicles/Trucks on highway." }
      ]
    },
    {
      category: "Restricted (DO NOT USE)",
      colorClass: "bg-red-50 text-red-800 border-red-200",
      icon: "⛔",
      channels: [
        { id: "5 & 35", desc: "EMERGENCY ONLY" },
        { id: "1-8", desc: "Duplex Repeater Outputs" },
        { id: "31-38", desc: "Duplex Repeater Inputs" },
        { id: "22 & 23", desc: "Data / Telemetry Only" },
        { id: "52 & 53", desc: "Data / Telemetry Only" },
        { id: "61-63", desc: "Reserved / Future Use" }
      ]
    }
  ];
};

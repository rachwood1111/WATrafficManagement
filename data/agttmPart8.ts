import { RoadCategoryResult } from '../types';

// Data derived from AGTTM Part 8: Processes and Procedures
// Section 2.2 Default TTM Road Categories & Figure 2.1

export const getRoadCategory = (speed: number, aadt: number, isExpressway: boolean): RoadCategoryResult => {
  // Category 3: High volume expressways, grade separated, speed >= 90
  if (isExpressway && speed >= 90) {
    return {
      category: 3,
      description: "High volume/speed multi-lane expressway with grade separated intersections."
    };
  }

  // Category 2: High Volume Roads
  // Speed >= 60 AND AADT >= 3000
  // OR Any Speed AND AADT >= 10000
  if ((speed >= 60 && aadt >= 3000) || aadt >= 10000) {
    return {
      category: 2,
      description: "High-volume road. Multilane, divided roads, or high speed highways."
    };
  }

  // Category 1: Lower volume
  // Any speed with AADT < 3000
  // Speed < 60 and AADT between 3000 and 10000
  return {
    category: 1,
    description: "Most urban streets and lower volume rural roads. Single lane or two-way."
  };
};
/**
 * Calculate solar panel efficiency based on orientation
 * @param azimuth - Panel direction in degrees (0-360, where 0=North, 180=South)
 * @param tilt - Panel tilt angle in degrees (0-90, where 0=horizontal)
 * @param latitude - Location latitude (default: Mumbai at 19.12°N)
 * @returns Efficiency multiplier (0-1)
 */
export const calculatePanelEfficiency = (
  azimuth: number,
  tilt: number,
  latitude: number = 19.12
): number => {
  // Optimal azimuth for northern hemisphere is 180° (south-facing)
  // For southern hemisphere, it would be 0° (north-facing)
  const optimalAzimuth = latitude > 0 ? 180 : 0;
  
  // Optimal tilt is typically equal to latitude
  const optimalTilt = Math.abs(latitude);
  
  // Calculate azimuth efficiency (cosine similarity)
  // Maximum efficiency when facing optimal direction
  const azimuthDiff = Math.abs(azimuth - optimalAzimuth);
  const normalizedAzimuthDiff = Math.min(azimuthDiff, 360 - azimuthDiff);
  const azimuthEfficiency = Math.cos((normalizedAzimuthDiff * Math.PI) / 180);
  
  // Calculate tilt efficiency
  // Maximum efficiency at optimal tilt, decreasing as it deviates
  const tiltDiff = Math.abs(tilt - optimalTilt);
  const tiltEfficiency = Math.cos((tiltDiff * Math.PI) / 180) * 0.7 + 0.3;
  
  // Combined efficiency (weighted average)
  // Azimuth is more important (60%) than tilt (40%)
  const combinedEfficiency = (azimuthEfficiency * 0.6 + tiltEfficiency * 0.4);
  
  // Ensure efficiency is between 0.3 and 1 (minimum 30% even in worst case)
  return Math.max(0.3, Math.min(1, combinedEfficiency));
};

/**
 * Calculate adjusted power output based on panel orientation
 * @param baseOutput - Base power output in watts
 * @param azimuth - Panel direction in degrees
 * @param tilt - Panel tilt angle in degrees
 * @returns Adjusted power output
 */
export const calculateAdjustedOutput = (
  baseOutput: number,
  azimuth: number,
  tilt: number
): number => {
  const efficiency = calculatePanelEfficiency(azimuth, tilt);
  return baseOutput * efficiency;
};

/**
 * Get efficiency as percentage
 */
export const getEfficiencyPercentage = (azimuth: number, tilt: number): number => {
  return calculatePanelEfficiency(azimuth, tilt) * 100;
};

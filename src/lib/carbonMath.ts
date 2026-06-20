/**
 * EcoTrack AI - Centralized Region-Aware Carbon Calculation Logic
 */

export interface CalculationInput {
  region: 'ID' | 'US' | 'EU';
  transport: string;
  diet: string;
  energy: string;
}

export const REGIONAL_GRID_FACTORS = {
  ID: 0.82, // Indonesia - High carbon coal energy mix
  US: 0.38, // United States - Moderate carbon mixed grids
  EU: 0.25, // European Union - Lower carbon clean energy mix
};

export const TRANSPORT_EMISSIONS = {
  car: 180,
  transit: 50,
  cycling: 0,
  walking: 0,
};

export const DIET_EMISSIONS = {
  heavy: 160,
  average: 110,
  vegetarian: 45,
  vegan: 20,
};

export const ENERGY_KWH = {
  low: 100,
  medium: 250,
  high: 500,
};

/**
 * Calculates the monthly carbon footprint in kg CO2e based on regional constants
 */
export function calculateMonthlyFootprint(input: CalculationInput): number {
  const { region, transport, diet, energy } = input;

  // Retrieve transport factor
  const transportEffort = TRANSPORT_EMISSIONS[transport as keyof typeof TRANSPORT_EMISSIONS] !== undefined
    ? TRANSPORT_EMISSIONS[transport as keyof typeof TRANSPORT_EMISSIONS]
    : 50; // Default transit fallback

  // Retrieve diet factor
  const dietEffort = DIET_EMISSIONS[diet as keyof typeof DIET_EMISSIONS] !== undefined
    ? DIET_EMISSIONS[diet as keyof typeof DIET_EMISSIONS]
    : 110; // Default average fallback

  // Retrieve energy consumption in kWh
  const kwh = ENERGY_KWH[energy as keyof typeof ENERGY_KWH] !== undefined
    ? ENERGY_KWH[energy as keyof typeof ENERGY_KWH]
    : 250; // Default medium fallback

  // Retrieve corresponding regional utility multiplier
  const gridFactor = REGIONAL_GRID_FACTORS[region] || 0.38;

  return Math.round(transportEffort + dietEffort + (kwh * gridFactor));
}

/**
 * Estimate annual offset equivalency in maturation trees preserved/planted
 * One matured tree absorbs approximately 25 kg CO2 annually.
 */
export function calculateTreeEquivalency(annualSavingsKg: number): number {
  return Math.max(1, Math.round(annualSavingsKg / 25));
}

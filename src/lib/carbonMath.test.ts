import { describe, it, expect } from "vitest";
import { 
  calculateMonthlyFootprint, 
  calculateTreeEquivalency, 
  REGIONAL_GRID_FACTORS, 
  TRANSPORT_EMISSIONS, 
  DIET_EMISSIONS,
  ENERGY_KWH
} from "./carbonMath";

describe("EcoTrack AI - Regional Carbon Calculations Suite", () => {
  it("should accurately apply Indonesian (ID) high-carbon grid multipliers compared to US and EU", () => {
    const idFootprint = calculateMonthlyFootprint({
      region: "ID",
      transport: "transit",
      diet: "average",
      energy: "medium", // 250 kWh
    });

    const usFootprint = calculateMonthlyFootprint({
      region: "US",
      transport: "transit",
      diet: "average",
      energy: "medium", // 250 kWh
    });

    const euFootprint = calculateMonthlyFootprint({
      region: "EU",
      transport: "transit",
      diet: "average",
      energy: "medium", // 250 kWh
    });

    // Check that ID is highest due to high coal carbon intensity (0.82 vs 0.38 vs 0.25)
    expect(idFootprint).toBeGreaterThan(usFootprint);
    expect(usFootprint).toBeGreaterThan(euFootprint);

    // Manual equation validation for ID: 50 (transit) + 110 (average diet) + (250 * 0.82) = 160 + 205 = 365
    expect(idFootprint).toEqual(365);
    // Manual equation validation for US: 50 + 110 + (250 * 0.38) = 160 + 95 = 255
    expect(usFootprint).toEqual(255);
  });

  it("should verify that driving a car is worse for emissions than taking public transit", () => {
    const carFootprint = calculateMonthlyFootprint({
      region: "US",
      transport: "car",
      diet: "average",
      energy: "medium",
    });

    const transitFootprint = calculateMonthlyFootprint({
      region: "US",
      transport: "transit",
      diet: "average",
      energy: "medium",
    });

    expect(carFootprint).toBeGreaterThan(transitFootprint);
    // Difference should be exactly the car emissions minus public transit emissions (180 - 50 = 130 kg difference)
    expect(carFootprint - transitFootprint).toEqual(130);
  });

  it("should verify relative nutritional footprint hierarchies (Heavy Meat > Vegan)", () => {
    const meatFootprint = calculateMonthlyFootprint({
      region: "US",
      transport: "cycling",
      diet: "heavy",
      energy: "low",
    });

    const veganFootprint = calculateMonthlyFootprint({
      region: "US",
      transport: "cycling",
      diet: "vegan",
      energy: "low",
    });

    expect(meatFootprint).toBeGreaterThan(veganFootprint);
    // Heavy meat is 160 vs Vegan is 20, difference should be exactly 140 kg CO2e
    expect(meatFootprint - veganFootprint).toEqual(140);
  });

  it("should calculate correct tree retention equivalents", () => {
    // A single standardized matured tree preserves approximately 25kg CO2 per year.
    expect(calculateTreeEquivalency(0)).toEqual(1); // Min fallback
    expect(calculateTreeEquivalency(25)).toEqual(1);
    expect(calculateTreeEquivalency(100)).toEqual(4);
    expect(calculateTreeEquivalency(500)).toEqual(20);
  });

  it("should handle unknown inputs gracefully using default fallbacks", () => {
    const unknownFootprint = calculateMonthlyFootprint({
      region: "UNKNOWN_REGION" as any,
      transport: "spaceship",
      diet: "pizza_only",
      energy: "infinity",
    });

    // Default fallback: transit (50) + average (110) + (medium 250 * US 0.38) = 160 + 95 = 255
    expect(unknownFootprint).toEqual(255);
  });
});

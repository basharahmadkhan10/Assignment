import { Dimension } from "@prisma/client"

// Base units: g for weight, mL for volume, count for items.
const conversionRates: Record<string, number> = {
  // Weight
  g: 1,
  kg: 1000,
  mg: 0.001,
  // Volume
  mL: 1,
  L: 1000,
  // Count
  count: 1,
  unit: 1,
}

export function getAvailableUnits(dimension: Dimension): string[] {
  switch (dimension) {
    case "WEIGHT":
      return ["mg", "g", "kg"]
    case "VOLUME":
      return ["mL", "L"]
    case "COUNT":
      return ["count", "unit"]
    default:
      return []
  }
}

export function convertQuantity(amount: number, fromUnit: string, toUnit: string): number {
  if (!conversionRates[fromUnit] || !conversionRates[toUnit]) {
    throw new Error("Invalid units")
  }
  
  // Convert to base, then to target
  const baseAmount = amount * conversionRates[fromUnit]
  return baseAmount / conversionRates[toUnit]
}

export function calculatePrice(amount: number, requestedUnit: string, basePrice: number, baseUnit: string): number {
  // 1. Convert requested quantity to the base unit of the product
  // Example: Requested 1 L. Product base unit is mL. 
  // 1 L = 1000 mL.
  const amountInBaseUnit = convertQuantity(amount, requestedUnit, baseUnit)
  
  // 2. Multiply by base price
  return Number((amountInBaseUnit * basePrice).toFixed(2))
}

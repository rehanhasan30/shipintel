export interface CalculatorInput {
  origin: string;
  destination: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  service: 'standard' | 'express';
}

export interface CourierRecommendation {
  courierName: string;
  courierLogoInitials: string;
  cost: number;
  days: number;
  tag?: string;
  tagClass?: string;
  logoBgClass?: string;
}

export interface CalculatorResult {
  volumetricWeight: number;
  chargeableWeight: number;
  estimatedCost: number;
  recommendations: CourierRecommendation[];
}

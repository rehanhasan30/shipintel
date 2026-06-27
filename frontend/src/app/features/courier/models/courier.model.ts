export interface ServiceLevel {
  name: string;
  transitTime: string;
  maxWeight: string;
  specialHandling: string;
  baseIndex: string;
}

export interface Courier {
  id: string;
  name: string;
  rating: number;
  logoUrl: string;
  modes: string[];
  coverage: string[];
  tags: string[];
  type: string;
  description?: string;
  damageClaims?: string;
  transitTimeRating?: number;
  billingAccuracy?: number;
  serviceLevels?: ServiceLevel[];
}

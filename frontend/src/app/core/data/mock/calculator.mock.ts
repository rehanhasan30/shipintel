import { CourierRecommendation } from '../../../features/calculator/models/calculator.model';

export function getMockRecommendations(weightVal: number, service: 'standard' | 'express'): CourierRecommendation[] {
  if (weightVal <= 0) return [];

  if (service === 'standard') {
    return [
      {
        courierName: 'Maersk Line',
        courierLogoInitials: 'M',
        cost: parseFloat((weightVal * 8.5 + 134.25).toFixed(2)),
        days: 22,
        tag: 'Best Value',
        tagClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
        logoBgClass: 'bg-secondary-container text-on-secondary-container'
      },
      {
        courierName: 'Evergreen Marine',
        courierLogoInitials: 'E',
        cost: parseFloat((weightVal * 7.8 + 118.9).toFixed(2)),
        days: 25,
        logoBgClass: 'bg-surface-variant text-on-surface-variant'
      },
      {
        courierName: 'DHL Global',
        courierLogoInitials: 'D',
        cost: parseFloat((weightVal * 14.5 + 224.95).toFixed(2)),
        days: 12,
        tag: 'Fastest',
        tagClass: 'bg-primary-fixed text-on-primary-fixed',
        logoBgClass: 'bg-error-container text-on-error-container'
      }
    ];
  } else {
    return [
      {
        courierName: 'SwiftLogix Air',
        courierLogoInitials: 'S',
        cost: parseFloat((weightVal * 18.2 + 285.50).toFixed(2)),
        days: 2,
        tag: 'Fastest Express',
        tagClass: 'bg-primary-fixed text-on-primary-fixed',
        logoBgClass: 'bg-primary-container text-on-primary'
      },
      {
        courierName: 'DHL Global Express',
        courierLogoInitials: 'D',
        cost: parseFloat((weightVal * 16.5 + 258.90).toFixed(2)),
        days: 5,
        tag: 'Best Value',
        tagClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
        logoBgClass: 'bg-error-container text-on-error-container'
      },
      {
        courierName: 'Pegasus Flash',
        courierLogoInitials: 'P',
        cost: parseFloat((weightVal * 22.4 + 312.40).toFixed(2)),
        days: 1,
        logoBgClass: 'bg-surface-variant text-on-surface-variant'
      }
    ];
  }
}

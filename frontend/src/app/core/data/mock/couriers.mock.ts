import { Courier } from '../../../features/courier/models/courier.model';

export const MOCK_COURIERS: Courier[] = [
  {
    id: 'swiftlogix-global',
    name: 'SwiftLogix Global',
    rating: 4.9,
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaTPkQet72ahi-Kpwid87ArERjOV3t7wK9aTEVCUWP3Q6pWWfqGkBVVDgaH6sIYu-7sASUzW0uhqFfhhgcS_uOUUH3cwLOc95poEGWufnWIYIz9BG2x9gGzG9gKwnEy6cH_PoQrKpOiqrA6F0UKvI-ARU7ZaGlgX5eqqsE2qa-FIZ0XkmAAL8ohyFkdaToAmRHSBSifnp9I12CfDl9UYRzzHjq_48_hfx5T042wEfzGDO2O2redK1cKS3bnv438yoKSJGcMgwOWyoy',
    modes: ['Express', 'Ground'],
    coverage: ['North America', 'EU', 'APAC'],
    tags: ['API Ready', 'Customs Brokerage'],
    type: 'Global Express Provider',
    description: 'SwiftLogix Global is a premier provider of international express and ground shipping. With transit routes spanning over 150 countries, we utilize automated custom clearances and automated sorting centers to ensure industry-leading transit speed and SLA adherence.',
    damageClaims: '0.12%',
    transitTimeRating: 98.4,
    billingAccuracy: 99.8,
    serviceLevels: [
      {
        name: 'Swift Air Priority',
        transitTime: '1-2 Business Days',
        maxWeight: '5,000 kg',
        specialHandling: 'Hazmat',
        baseIndex: '1.8x'
      },
      {
        name: 'Ocean FCL Standard',
        transitTime: '14-28 Days',
        maxWeight: '40ft HC',
        specialHandling: 'Cold Chain',
        baseIndex: '0.6x'
      },
      {
        name: 'Ground Expedited (EU)',
        transitTime: '2-4 Business Days',
        maxWeight: '24,000 kg',
        specialHandling: 'Standard',
        baseIndex: '1.0x (Base)'
      }
    ]
  },
  {
    id: 'meridian-freight',
    name: 'Meridian Freight',
    rating: 4.7,
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrIrbtclAI33VgiPgyIMT3vZXA4Z2ZzowSfIPeTKToM7w114_xM-oZ8_go28i4jajeq50JeFmuhxLI1_ZIu2xVVTVqeS7lg_4R-OsT9KS5vqkSavK5mduBL1G8OqEjvD-LsEzdvWWoZuP4beF2r0dY3TY7JTxNyg9ZRNL6dISWkxMl2zg22j8vOhUexXUAG-Nvr2GS2OG56rzqHcZ0qNB_PyOWSk3zZXEMKAtag0aIhdrMULzozq4KoM_he15ACX6HSKNrbnY8fqhY',
    modes: ['Sea', 'Air Cargo'],
    coverage: ['Global Routes'],
    tags: ['Heavy Freight', 'Cold Chain'],
    type: 'Sea & Air Specialists',
    description: 'Meridian Freight specializes in bulk shipping and heavy industrial cargo. Our temperature-controlled cold chain logistics ensure pharmaceutical and perishable shipments are kept at target thresholds throughout transit routes.',
    damageClaims: '0.24%',
    transitTimeRating: 94.6,
    billingAccuracy: 98.9,
    serviceLevels: [
      {
        name: 'Meridian Air Freight',
        transitTime: '3-5 Business Days',
        maxWeight: '10,000 kg',
        specialHandling: 'Heavy Cargo',
        baseIndex: '1.4x'
      },
      {
        name: 'Reefer Ocean Freight',
        transitTime: '20-35 Days',
        maxWeight: '26,000 kg',
        specialHandling: 'Cold Chain',
        baseIndex: '0.75x'
      }
    ]
  },
  {
    id: 'ecotransit',
    name: 'EcoTransit',
    rating: 4.5,
    logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-4VMTBBZBW6gJaVQmCRpJHmTdoktTssQ0KL4-6KTp9qEcdkNjgyhRYg1ttj7mgaT-LYQQazL3MPMkDR7g-GQVIVNqoqiL5Ufmplri6AjbJKMpaeUrVEokTt6fDL5J4dtjTGslK4xXLvYv2FCJPrXYGJx4tMQtjXNUaIAcEA7J6KGvNzvzWfcvENPDD198841opx5G-bhDaQ1jGWIfHnhIW77C56iiwZoojsroAvey_fDqcxKgqiv4LRzrKDZwsAiQAT9oHS9etzD2',
    modes: ['EV Ground', 'Last-Mile'],
    coverage: ['Europe', 'UK'],
    tags: ['Carbon Neutral'],
    type: 'Regional Ground Network',
    description: 'EcoTransit leads the logistics sector in sustainable transport. Operating an all-electric fleet of trucks and vans, we provide 100% carbon-neutral delivery networks across European and British metropolitan grids.',
    damageClaims: '0.08%',
    transitTimeRating: 96.2,
    billingAccuracy: 99.5,
    serviceLevels: [
      {
        name: 'EcoLast-Mile Express',
        transitTime: 'Same Day / Next Day',
        maxWeight: '50 kg',
        specialHandling: 'Fragile Care',
        baseIndex: '1.2x'
      },
      {
        name: 'EcoGreen Cargo',
        transitTime: '2-3 Business Days',
        maxWeight: '3,000 kg',
        specialHandling: 'Standard',
        baseIndex: '0.9x'
      }
    ]
  },
  {
    id: 'pegasus-air',
    name: 'Pegasus Air Express',
    rating: 4.8,
    logoUrl: '',
    modes: ['Air Cargo'],
    coverage: ['Global Routes'],
    tags: ['Express', 'Customs Clearance'],
    type: 'Air Freight Specialists',
    description: 'Pegasus Air Express operates daily cargo flights connecting Asian manufacturing hubs with European and American consumer markets. We include built-in customs brokerage to bypass airport holding docks.',
    damageClaims: '0.15%',
    transitTimeRating: 97.8,
    billingAccuracy: 99.1,
    serviceLevels: [
      {
        name: 'Pegasus Flash',
        transitTime: '24-48 Hours',
        maxWeight: '1,000 kg',
        specialHandling: 'SLA Guaranteed',
        baseIndex: '2.1x'
      }
    ]
  },
  {
    id: 'bharat-logistics',
    name: 'Bharat Logistics',
    rating: 4.6,
    logoUrl: '',
    modes: ['Ground', 'Rail'],
    coverage: ['India'],
    tags: ['Hyperlocal', 'API Ready'],
    type: 'Domestic India Network',
    description: 'Bharat Logistics covers 19,000+ PIN codes across India. Integrating rail network freight with last-mile electric distribution, we provide small businesses and e-commerce companies with high reliability and low costs.',
    damageClaims: '0.18%',
    transitTimeRating: 95.0,
    billingAccuracy: 98.7,
    serviceLevels: [
      {
        name: 'Bharat Express',
        transitTime: '2-4 Days',
        maxWeight: '10,000 kg',
        specialHandling: 'COD Support',
        baseIndex: '1.0x'
      },
      {
        name: 'Bharat Saver Rail',
        transitTime: '5-9 Days',
        maxWeight: '50,000 kg',
        specialHandling: 'Bulk Cargo',
        baseIndex: '0.5x'
      }
    ]
  }
];

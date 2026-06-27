import { TestBed } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';
import { HttpService, ApiResponse } from '../../../core/http/http.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { CourierRecommendation } from '../models/calculator.model';

describe('CalculatorService', () => {
  let service: CalculatorService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpService', ['get', 'post']);

    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        { provide: HttpService, useValue: spy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CalculatorService);
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should compute volumetric weight correctly based on length, width, height', () => {
    // Default values: 50, 40, 30
    // Volumetric weight: (50 * 40 * 30) / 5000 = 60000 / 5000 = 12 kg
    expect(service.volumetricWeight()).toBe(12);

    service.updateInputs({ length: 100, width: 50, height: 40 });
    // (100 * 50 * 40) / 5000 = 200000 / 5000 = 40 kg
    expect(service.volumetricWeight()).toBe(40);
  });

  it('should compute chargeable weight as max of physical weight and volumetric weight', () => {
    service.updateInputs({ length: 50, width: 40, height: 30, weight: 10 });
    // Volumetric: 12, Physical: 10 -> Chargeable: 12
    expect(service.chargeableWeight()).toBe(12);

    service.updateInputs({ weight: 25 });
    // Volumetric: 12, Physical: 25 -> Chargeable: 25
    expect(service.chargeableWeight()).toBe(25);
  });

  it('should load recommendations via HTTP post and update estimated lowest cost', () => {
    const mockRecommendations: CourierRecommendation[] = [
      { courierName: 'Test Carrier 1', courierLogoInitials: 'T1', cost: 150, days: 5 },
      { courierName: 'Test Carrier 2', courierLogoInitials: 'T2', cost: 120, days: 10 }
    ];

    const mockResponse: ApiResponse<CourierRecommendation[]> = {
      success: true,
      message: 'Rates calculated',
      data: mockRecommendations,
      timestamp: new Date().toISOString()
    };

    httpServiceSpy.post.and.returnValue(of(mockResponse));

    service.calculateRates();

    expect(service.loading()).toBeFalse();
    expect(service.error()).toBeNull();
    expect(service.recommendations()).toEqual(mockRecommendations);
    expect(service.estimatedLowestCost()).toBe(120);
  });
});

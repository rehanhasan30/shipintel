import { TestBed } from '@angular/core/testing';
import { CourierService } from './courier.service';
import { HttpService, ApiResponse } from '../../../core/http/http.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { MOCK_COURIERS } from '../../../core/data/mock/couriers.mock';

describe('CourierService', () => {
  let service: CourierService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpService', ['get', 'post']);

    TestBed.configureTestingModule({
      providers: [
        CourierService,
        { provide: HttpService, useValue: spy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CourierService);
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load couriers and update signals', () => {
    const mockApiResponse: ApiResponse<any[]> = {
      success: true,
      message: 'Success',
      data: MOCK_COURIERS,
      timestamp: new Date().toISOString()
    };

    httpServiceSpy.get.and.returnValue(of(mockApiResponse));

    service.loadCouriers();

    expect(service.loading()).toBeFalse();
    expect(service.error()).toBeNull();
    expect(service.couriers()).toEqual(MOCK_COURIERS);
  });

  describe('Filters & Computed Signals', () => {
    beforeEach(() => {
      // Initialize with mock couriers
      service.couriers.set(MOCK_COURIERS);
    });

    it('should filter by search query (case-insensitive)', () => {
      service.searchQuery.set('swift');
      const filtered = service.filteredCouriers();
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('SwiftLogix Global');
    });

    it('should filter by coverage', () => {
      service.filterCoverage.set('Global');
      const filtered = service.filteredCouriers();
      // SwiftLogix, Meridian, and Pegasus have global coverage
      expect(filtered.every(c => c.coverage.some(cov => cov.toLowerCase().includes('global')) || c.coverage.includes('APAC') || c.coverage.includes('EU'))).toBeTrue();
    });

    it('should filter by Mode of transport', () => {
      service.filterMode.set('Sea');
      const filtered = service.filteredCouriers();
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Meridian Freight');
    });

    it('should compute isEmpty correctly', () => {
      expect(service.isEmpty()).toBeFalse();
      service.searchQuery.set('NonExistentCourierName123');
      expect(service.isEmpty()).toBeTrue();
    });
  });
});

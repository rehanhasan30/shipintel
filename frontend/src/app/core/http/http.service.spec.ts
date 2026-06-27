import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HttpService, ApiResponse } from './http.service';
import { environment } from '../../../environments/environment';

describe('HttpService', () => {
  let service: HttpService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(HttpService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Mock Data Mode', () => {
    // If environment is configured with useMockData = true, it should return mock datasets
    it('should fetch mock couriers from data mocks directly', (done) => {
      // Force service to use mock data mode for this test
      (service as any).useMockData = true;

      service.get<any[]>('/couriers').subscribe({
        next: (res: ApiResponse<any[]>) => {
          expect(res.success).toBeTrue();
          expect(res.data.length).toBeGreaterThan(0);
          expect(res.data[0].id).toBe('swiftlogix-global');
          done();
        }
      });
    });

    it('should fetch single mock courier detail', (done) => {
      (service as any).useMockData = true;

      service.get<any>('/couriers/swiftlogix-global').subscribe({
        next: (res: ApiResponse<any>) => {
          expect(res.success).toBeTrue();
          expect(res.data.name).toBe('SwiftLogix Global');
          done();
        }
      });
    });

    it('should resolve mock calculator rates', (done) => {
      (service as any).useMockData = true;

      const payload = { weight: 10, service: 'express' };
      service.post<any[]>('/calculator/rates', payload).subscribe({
        next: (res: ApiResponse<any[]>) => {
          expect(res.success).toBeTrue();
          expect(res.data.length).toBeGreaterThan(0);
          expect(res.data[0].courierName).toBe('SwiftLogix Air');
          done();
        }
      });
    });
  });

  describe('Real API Mode', () => {
    it('should make standard GET HTTP request to backend endpoint', (done) => {
      // Force service to make network calls for this test
      (service as any).useMockData = false;

      const mockResponse: ApiResponse<string> = {
        success: true,
        message: 'Loaded successfully',
        data: 'Sample Cargo Details',
        timestamp: new Date().toISOString()
      };

      service.get<string>('/sample-path').subscribe({
        next: (res) => {
          expect(res.success).toBeTrue();
          expect(res.data).toBe('Sample Cargo Details');
          done();
        }
      });

      const req = httpTestingController.expectOne(`${environment.apiBaseUrl}/api/${environment.apiVersion}/sample-path`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should make standard POST HTTP request to backend endpoint', (done) => {
      (service as any).useMockData = false;

      const mockResponse: ApiResponse<string> = {
        success: true,
        message: 'Saved successfully',
        data: 'Record ID 100',
        timestamp: new Date().toISOString()
      };

      const payload = { key: 'value' };

      service.post<string>('/sample-save', payload).subscribe({
        next: (res) => {
          expect(res.success).toBeTrue();
          expect(res.data).toBe('Record ID 100');
          done();
        }
      });

      const req = httpTestingController.expectOne(`${environment.apiBaseUrl}/api/${environment.apiVersion}/sample-save`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);
    });
  });
});

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MOCK_COURIERS } from '../data/mock/couriers.mock';
import { MOCK_ARTICLES } from '../data/mock/blog-articles.mock';
import { getMockRecommendations } from '../data/mock/calculator.mock';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly _http = inject(HttpClient);
  
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly apiVersion = environment.apiVersion;
  private readonly useMockData = environment.useMockData;

  /**
   * Helper to construct backend endpoint URLs dynamically
   */
  private buildUrl(path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}/api/${this.apiVersion}${cleanPath}`;
  }

  /**
   * Wrap data inside standard ApiResponse format
   */
  private wrapMockResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Dedicated HTTP GET request
   */
  get<T>(path: string, options?: { headers?: HttpHeaders; params?: HttpParams }): Observable<ApiResponse<T>> {
    if (this.useMockData) {
      return this.handleMockGet<T>(path);
    }
    return this._http.get<ApiResponse<T>>(this.buildUrl(path), options);
  }

  /**
   * Dedicated HTTP POST request
   */
  post<T>(path: string, body: unknown, options?: { headers?: HttpHeaders; params?: HttpParams }): Observable<ApiResponse<T>> {
    if (this.useMockData) {
      return this.handleMockPost<T>(path, body);
    }
    return this._http.post<ApiResponse<T>>(this.buildUrl(path), body, options);
  }

  /**
   * Dedicated HTTP PUT request
   */
  put<T>(path: string, body: unknown, options?: { headers?: HttpHeaders; params?: HttpParams }): Observable<ApiResponse<T>> {
    if (this.useMockData) {
      return of(this.wrapMockResponse(body as T, 'Mock update successful')).pipe(delay(400));
    }
    return this._http.put<ApiResponse<T>>(this.buildUrl(path), body, options);
  }

  /**
   * Dedicated HTTP DELETE request
   */
  delete<T>(path: string, options?: { headers?: HttpHeaders; params?: HttpParams }): Observable<ApiResponse<T>> {
    if (this.useMockData) {
      return of(this.wrapMockResponse({} as T, 'Mock delete successful')).pipe(delay(400));
    }
    return this._http.delete<ApiResponse<T>>(this.buildUrl(path), options);
  }

  /**
   * Mock GET handlers
   */
  private handleMockGet<T>(path: string): Observable<ApiResponse<T>> {
    // 1. Couriers list
    if (path.endsWith('/couriers')) {
      return of(this.wrapMockResponse(MOCK_COURIERS as unknown as T)).pipe(delay(500));
    }
    
    // 2. Courier detail
    const courierMatch = path.match(/\/couriers\/([a-zA-Z0-9_-]+)/);
    if (courierMatch) {
      const courierId = courierMatch[1];
      const courier = MOCK_COURIERS.find(c => c.id === courierId);
      return of(this.wrapMockResponse(courier as unknown as T, courier ? 'Courier profile loaded' : 'Carrier profile not found')).pipe(delay(400));
    }

    // 3. Blog articles list
    if (path.endsWith('/blog/articles')) {
      return of(this.wrapMockResponse(MOCK_ARTICLES as unknown as T)).pipe(delay(600));
    }

    // 4. Blog article detail
    const articleMatch = path.match(/\/blog\/articles\/([a-zA-Z0-9_-]+)/);
    if (articleMatch) {
      const articleId = articleMatch[1];
      const article = MOCK_ARTICLES.find(a => a.id === articleId);
      return of(this.wrapMockResponse(article as unknown as T, article ? 'Article details loaded' : 'Article not found')).pipe(delay(400));
    }

    return of(this.wrapMockResponse({} as T, 'Mock endpoint matched default')).pipe(delay(200));
  }

  /**
   * Mock POST handlers
   */
  private handleMockPost<T>(path: string, body: unknown): Observable<ApiResponse<T>> {
    // 1. Calculator Rates calculations
    if (path.endsWith('/calculator/rates')) {
      const payload = body as { weight: number; service: 'standard' | 'express' };
      const weight = payload.weight || 0;
      const service = payload.service || 'standard';
      const recommendations = getMockRecommendations(weight, service);
      return of(this.wrapMockResponse(recommendations as unknown as T, 'Calculated rates successfully')).pipe(delay(900));
    }

    // 2. Newsletter subscribe
    if (path.endsWith('/newsletter/subscribe')) {
      const payload = body as { email: string };
      return of(this.wrapMockResponse({ email: payload.email } as unknown as T, 'Newsletter subscription saved')).pipe(delay(500));
    }

    // 3. Contact Support message
    if (path.endsWith('/support/contact')) {
      return of(this.wrapMockResponse(body as T, 'Support ticket generated')).pipe(delay(800));
    }

    return of(this.wrapMockResponse(body as T, 'Mock post successful')).pipe(delay(300));
  }
}

import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpService } from '../../../core/http/http.service';
import { API_CONSTANTS } from '../../../core/constants/api.constants';
import { CalculatorInput, CourierRecommendation } from '../models/calculator.model';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private readonly _httpService = inject(HttpService);

  // Input signals
  readonly origin = signal('Shanghai');
  readonly destination = signal('Los Angeles');
  readonly length = signal<number>(50);
  readonly width = signal<number>(40);
  readonly height = signal<number>(30);
  readonly weight = signal<number>(10);
  readonly service = signal<'standard' | 'express'>('standard');

  // Computed Volumetric Weight (L * W * H / 5000)
  readonly volumetricWeight = computed(() => {
    const l = this.length() || 0;
    const w = this.width() || 0;
    const h = this.height() || 0;
    const rawVal = (l * w * h) / 5000;
    return parseFloat(rawVal.toFixed(2));
  });

  // Computed Chargeable Weight: max of Gross Weight and Volumetric Weight
  readonly chargeableWeight = computed(() => {
    const gross = this.weight() || 0;
    const vol = this.volumetricWeight();
    return Math.max(gross, vol);
  });

  // Recommendations and rates API response signals
  readonly recommendations = signal<CourierRecommendation[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Computed Lowest Cost among all recommendations
  readonly estimatedLowestCost = computed(() => {
    const list = this.recommendations();
    if (list.length === 0) return 0;
    const costs = list.map(item => item.cost);
    return Math.min(...costs);
  });

  /**
   * Update internal inputs
   */
  updateInputs(input: Partial<CalculatorInput>) {
    if (input.origin !== undefined) this.origin.set(input.origin);
    if (input.destination !== undefined) this.destination.set(input.destination);
    if (input.length !== undefined) this.length.set(input.length);
    if (input.width !== undefined) this.width.set(input.width);
    if (input.height !== undefined) this.height.set(input.height);
    if (input.weight !== undefined) this.weight.set(input.weight);
    if (input.service !== undefined) this.service.set(input.service);
  }

  /**
   * Request calculations from the backend API layer
   */
  calculateRates(): void {
    this.loading.set(true);
    this.error.set(null);

    const payload: CalculatorInput = {
      origin: this.origin(),
      destination: this.destination(),
      length: this.length(),
      width: this.width(),
      height: this.height(),
      weight: this.weight(),
      service: this.service()
    };

    this._httpService.post<CourierRecommendation[]>(API_CONSTANTS.CALCULATE_RATES, payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.recommendations.set(res.data);
        } else {
          this.error.set(res.message);
        }
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}

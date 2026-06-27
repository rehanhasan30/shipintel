import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpService } from '../../../core/http/http.service';
import { Courier } from '../models/courier.model';
import { API_CONSTANTS } from '../../../core/constants/api.constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourierService {
  private readonly _httpService = inject(HttpService);

  // Core signals for data state
  readonly couriers = signal<Courier[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Search and filter state signals
  readonly searchQuery = signal('');
  readonly filterCoverage = signal('All');
  readonly filterMode = signal('All');
  readonly filterRating = signal('Any');

  // Computed Signal for filtered couriers (business logic kept in service)
  readonly filteredCouriers = computed(() => {
    const list = this.couriers();
    const query = this.searchQuery().toLowerCase().trim();
    const coverage = this.filterCoverage();
    const mode = this.filterMode();
    const rating = this.filterRating();

    return list.filter(courier => {
      // 1. Search Query Match
      if (query && !courier.name.toLowerCase().includes(query) && 
          !courier.type.toLowerCase().includes(query) &&
          !courier.description?.toLowerCase().includes(query)) {
        return false;
      }

      // 2. Coverage Match
      if (coverage !== 'All') {
        const isGlobalOption = coverage.toLowerCase().includes('global');
        const hasGlobalCoverage = courier.coverage.some(c => c.toLowerCase().includes('global'));
        
        if (isGlobalOption && !hasGlobalCoverage) {
          return false;
        }
        if (!isGlobalOption && hasGlobalCoverage) {
          return false;
        }
      }

      // 3. Mode Match
      if (mode !== 'All') {
        const hasMode = courier.modes.some(m => m.toLowerCase().includes(mode.toLowerCase()));
        if (!hasMode) return false;
      }

      // 4. Rating Match
      if (rating !== 'Any') {
        if (rating === '4+ Stars' && courier.rating < 4.0) {
          return false;
        }
      }

      return true;
    });
  });

  // Computed Signal for checking empty results state
  readonly isEmpty = computed(() => {
    return !this.loading() && this.filteredCouriers().length === 0;
  });

  /**
   * Fetch all couriers from the API layer
   */
  loadCouriers(): void {
    this.loading.set(true);
    this.error.set(null);

    this._httpService.get<Courier[]>(API_CONSTANTS.COURIERS).subscribe({
      next: (res) => {
        if (res.success) {
          this.couriers.set(res.data);
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

  /**
   * Fetch a single courier profile details
   */
  getCourierDetail(id: string): Observable<Courier | undefined> {
    return this._httpService.get<Courier>(API_CONSTANTS.COURIER_DETAIL(id)).pipe(
      map(res => res.success ? res.data : undefined)
    );
  }
}
